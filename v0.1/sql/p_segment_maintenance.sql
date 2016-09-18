/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_segment_maintenance.sql
* Description   : Indigo segment maintenance
* Author        : Scott Walkinshaw
* Date          : 27th November 2011
* Parameters    : 
* Comments      : need to make sure something is always returned in the out 
*                 parameters
*                 Segments are contacts with email_permission
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 27 Nov 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_segment_maintenance;
DELIMITER $$
CREATE PROCEDURE p_segment_maintenance (
                   IN   p_action         VARCHAR(1),
                   IN   p_segment_id     INT,
                   IN   p_segment_name   VARCHAR(256),
                   IN   p_description    VARCHAR(1024),
                   IN   p_and_or         VARCHAR(64),
                   IN   p_profile_field  VARCHAR(64),
                   IN   p_operator       VARCHAR(64),
                   IN   p_value          VARCHAR(256),
                   OUT  p_status         CHAR(1),
                   OUT  p_string         VARCHAR(512),
                   OUT  p_error          VARCHAR(512),
                   OUT  p_error_code     VARCHAR(512),
                   OUT  p_new_id         VARCHAR(16),
                   OUT  p_count          VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_segment_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_rules          INT            DEFAULT 0; 
  DECLARE v_dummy          VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_run_id         INT            DEFAULT 1;
  DECLARE v_and_or         VARCHAR(1024);
  DECLARE v_operator       VARCHAR(1024);
  DECLARE v_profile_field  VARCHAR(1024);
  DECLARE v_value          VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;
  DECLARE v_done           BOOLEAN         DEFAULT FALSE;
  DECLARE v_db             VARCHAR(16);
  DECLARE v_column         VARCHAR(64);
  DECLARE v_position       INT;
  DECLARE v_columns        VARCHAR(1024)   DEFAULT '';

  DECLARE e_exception      INT            DEFAULT FALSE;


  DECLARE c_1 CURSOR FOR
  SELECT ordinal_position,
         column_name
  FROM   Information_Schema.columns
  WHERE  table_name       = 'v_contacts'
  AND    table_schema     = v_db
  ORDER BY
         ordinal_position ASC;

  DECLARE CONTINUE HANDLER FOR NOT FOUND          SET v_done      = TRUE;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN SET e_exception = TRUE; END;

  SET SQL_BIG_SELECTS = TRUE;

main:BEGIN

  /****
  *  Log entry
  ****/
  CALL p_event (
         v_object,
         1,
         v_event
       );

  /****
  *  Out parameter defaults
  ****/
  SET p_string := 'empty';
  SET p_status := '-1';
  SET p_count  := '-1';
  SET p_error  := 'OK';

  /****
  *  Get the next segment_id if creating
  ****/
  IF p_action = 'I' THEN
    SELECT IFNULL(MAX(segment_id + 1), 1)
    INTO   p_new_id
    FROM   segments;
  END IF;

  /****
  *  Get the next run_segment_id if creating
  ****/
  IF p_action = 'R' THEN
    SELECT IFNULL(MAX(value + 1), 1)
    INTO   v_run_id
    FROM   indigo_config
    WHERE  name = 'segment_run_id';

    SELECT value
    INTO   v_db
    FROM   indigo_config
    WHERE  name = 'database';

    UPDATE indigo_config
    SET    value = v_run_id
    WHERE  name = 'segment_run_id';

  END IF;

  /****
  *  If updating delete the old rules - they will be replaced
  *
  *  NOTE: could soft delete them - I'd need a auto_increment column on the table
  ****/
  IF p_action = 'U' THEN
    DELETE
    FROM   segment_rules
    WHERE  segment_id = p_segment_id;
  END IF;

  /****
  *  What are we doing to the segment?
  ****/
  CASE p_action 
  WHEN 'I' OR
       'U' OR
       'C' OR 
       'R' THEN

    /****
    *  Count the number of separators in p_operator
    *  to find out how many segment rules we have
    ****/
    SET v_operator := p_operator;
    SELECT LENGTH(v_operator) - LENGTH(REPLACE(v_operator, v_sep, ''))
    INTO   v_rules;

    /****
    *  Only people with an email address
    *  and email permissions are added to segments
    ****/
--    SET v_query := ' FROM v_contacts WHERE (IFNULL(email_address, \'\') != \'\' AND email_permission = \'Y\') ';
    SET v_query := ' FROM v_contacts WHERE (IFNULL(email_address, \'\') != \'\' AND email_permission) ';

    /****
    *  Strip the first separator off the parameters
    ****/
    SET p_and_or        := SUBSTR(p_and_or, 2);
    SET p_operator      := SUBSTR(p_operator, 2);
    SET p_profile_field := SUBSTR(p_profile_field, 2);
    SET p_value         := SUBSTR(p_value, 2);

    /****
    *  Separate the rule strings and build query
    ****/
    WHILE (v_i <= v_rules) DO

      /****
      *  Don't use the and/or the first
      *  time through the loop
      ****/
      IF (v_i > 1) THEN
        SELECT SUBSTRING_INDEX(p_and_or, v_sep, 1)
        INTO   v_and_or;

        SELECT SUBSTRING(p_and_or, LOCATE(v_sep, p_and_or) + 1)
        INTO   p_and_or;

      ELSE
        SET v_and_or = 'AND';
      END IF;
      SET v_query := CONCAT(v_query, ' ', v_and_or);

      /****
      *  Profile Fields
      ****/
      SELECT SUBSTRING_INDEX(p_profile_field, v_sep, 1)
      INTO   v_profile_field;
      SELECT SUBSTRING(p_profile_field, LOCATE(v_sep, p_profile_field) + 1)
      INTO   p_profile_field;

      SET v_query := CONCAT(v_query, ' ', v_profile_field);

      /****
      *  Operators
      ****/
      SELECT SUBSTRING_INDEX(p_operator, v_sep, 1)
      INTO   v_operator;
      SELECT SUBSTRING(p_operator, LOCATE(v_sep, p_operator) + 1)
      INTO   p_operator;

      SET v_query := CONCAT(v_query, ' ', REPLACE(v_operator, 'CONTAINS', 'LIKE'));

      /****
      *  Values
      ****/
      SELECT SUBSTRING_INDEX(p_value, v_sep, 1)
      INTO   v_value;
      SELECT SUBSTRING(p_value, LOCATE(v_sep, p_value) + 1)
      INTO   p_value;

      /****
      *  Are we doing a LIKE?
      ****/
      IF (v_operator = 'CONTAINS') THEN
        SET v_query       := CONCAT(v_query, ' \'%', v_value, '%\'');
      ELSE
        SET v_query       := CONCAT(v_query, ' \'', v_value, '\'');
      END IF;

      /****
      *  Create segment rule record
      ****/
      IF p_action = 'I' OR
         p_action = 'U' THEN

        INSERT INTO segment_rules (
          segment_id,
          segment_rule_id,
          and_or,
          profile_field,
          operator,
          value
        ) VALUES (
          IFNULL(p_new_id, p_segment_id),
          v_i,
          v_and_or,
          v_profile_field,
          v_operator,
          v_value
        );
      END IF;
      SET v_i := v_i + 1;
    END WHILE;

  ELSE

    /****
    *  Nothing to do yet
    ****/
    SET v_dummy := 'dummy';

  END CASE;


  /****
  *  More action specific tasks
  ****/
  CASE p_action 
  WHEN 'I' THEN

    /****
    *  Create the segment record
    *
    *  just as well there a no foreign keys
    *  but doing it this way so I don't have to update
    *  the segments table which would fire the modification triggers
    *  could always take them off....
    ****/
    INSERT INTO segments (
      segment_id,
      segment_type_id,
      segment_name,
      description,
      query,
      count_query
    ) VALUES (
      p_new_id,
      '1',
      p_segment_name,
      p_description,
      v_query,
      REPLACE(v_query, '*', 'COUNT(*) ')
    );
 
    IF e_exception THEN
      SET p_error := CONCAT('Duplicate segment name [',
                             p_segment_name,
                             ']');
      SET p_error_code := '2';
   END IF;

  WHEN 'U' THEN

     UPDATE segments
     SET    segment_name = p_segment_name,
            description  = p_description,
            query        = v_query,
            count_query  = CONCAT('SELECT COUNT(*) INTO @v_count ', v_query)
     WHERE  segment_id   = p_segment_id;

  WHEN 'C' THEN

    /****
    *  If we're counting then run the query
    ****/
    SET v_query :=  CONCAT('SELECT COUNT(*) INTO @v_count ', v_query);
     
    SET    @v_dsql = v_query;
    PREPARE v_dsql FROM @v_dsql;
    EXECUTE v_dsql;

    SET p_count := @v_count;

  WHEN 'R' THEN
    
    /**** 
    *  Build string of stage table columns
    ****/
    set v_done := FALSE;
    OPEN c_1;
    c_1: LOOP

      FETCH c_1
      INTO v_position,
           v_column;

      /****
      *  Exit loop when we've build query
      ****/
      IF v_done THEN
        SET v_done := FALSE;
        CLOSE c_1;
        LEAVE c_1;
      END IF;

    /****
    *  Build column list
    ****/
    SET v_columns := CONCAT(IF(v_columns = '', v_columns, CONCAT(v_columns, ',')),
                            v_column);

    END LOOP c_1;

    /****
    *  Dynamic SQL to do insert
    ****/
    SET v_sql := CONCAT('INSERT INTO segment_runs (segment_run_id,',
                         v_columns,
                        ') SELECT ',
                         v_run_id,
                        ',',
                         v_columns,
                         v_query);

    SET    @v_dsql = v_sql;
    PREPARE v_dsql FROM @v_dsql;
    EXECUTE v_dsql;

    /****
    *  Send the segment_run_id back
    ****/
    SET p_new_id := v_run_id;

  WHEN 'D' THEN

    /****
    *  Set the deleted flag on 
    *  the segment & segment_rules tables
    ****/
    UPDATE segment_rules
    SET    deleted    = TRUE
    WHERE  segment_id = p_segment_id;

    UPDATE segments
    SET    deleted    = TRUE
    WHERE  segment_id = p_segment_id;

  END CASE;

END main;

ehandler:BEGIN

  CASE e_exception
  WHEN FALSE THEN
 
    /****
    *  Log success
    ****/
    CALL p_event (
           v_object,
           2,
           v_event
         );
    CALL p_log (
           v_event,
           CONCAT('maintained segment [', p_segment_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_segment_name, 
                           ']:action [', 
                           p_action,
                           ']:',
                           p_error);
    /****
    *  Log failure
    ****/
    CALL p_log (
           v_event,
           p_error
         );
    CALL p_event (
           v_object,
           3,
           v_event
         );
    SET p_status := '0';
  END CASE;

END ehandler;
END;
$$
