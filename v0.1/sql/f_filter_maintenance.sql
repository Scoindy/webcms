/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : f_filter_maintenance.sql
* Description   : Indigo filter maintenance
* Author        : Scott Walkinshaw
* Date          : 7th November 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Nov 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP FUNCTION IF EXISTS f_filter_maintenance;
DELIMITER $$
CREATE FUNCTION f_filter_maintenance (
                  p_action         VARCHAR(1),
                  p_filter_id      INT,
                  p_filter_name    VARCHAR(256),
                  p_description    VARCHAR(1024),
                  p_and_or         VARCHAR(64),
                  p_profile_field  VARCHAR(64),
                  p_operator       VARCHAR(64),
                  p_value          VARCHAR(256)
                ) RETURNS VARCHAR(2048)
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'f_filter_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_query_p        VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_rules          INT            DEFAULT 0; 
  DECLARE v_x              VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_and_or         VARCHAR(1024);
  DECLARE v_operator       VARCHAR(1024);
  DECLARE v_profile_field  VARCHAR(1024);
  DECLARE v_value          VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;

  DECLARE e_exception    INT            DEFAULT FALSE;
  DECLARE e_exception_s  VARCHAR(64)    DEFAULT 'OK';

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN SET e_exception = TRUE; END;


main:BEGIN

  /****
  *  Log entry
  ****/
  CALL p_event (
         v_object,
         1,
         v_event
       );

/*
  SET v_debug := CONCAT(
                   'p_first_name ', p_first_name,
                   ': p_last_name ',  p_last_name,
                   ': p_username ',   p_username,
                   ': p_email ',      p_email,
                   ': p_password ',   p_password,
                   ': p_role ',       p_role,
                   ': p_status ',     p_status,
                   ': v_event ',      v_event,
                   ': v_sha1 ',       v_sha1);

  INSERT INTO debug (
                debug_time,
                text
              ) values (
                NOW(),
                v_debug
              );

  SET v_debug := CONCAT('INSERT INTO indigo_users ( client_id, first_name, last_name, username, email, password, user_role_id, user_status_id, event_id) VALUES ( 100,',
       '\'', p_first_name, '\',',
       '\'', p_last_name,  '\',', 
       '\'', p_username,   '\',', 
       '\'', p_email,      '\',', 
       '\'', v_sha1,       '\',', 
       p_role, ',',
       p_status, ',',
       v_event,
       ')');

  INSERT INTO debug (
                debug_time,
                text
              ) values (
                NOW(),
                v_debug
              );
*/

  /****
  *  What are we doing to the filter?
  ****/
  CASE p_action 
  WHEN 'I' OR
       'U' OR
       'C' THEN

    /****
    *  Get the next filter_id
    ****/
    SELECT IFNULL(MAX(filter_id + 1), 1)
    INTO   p_filter_id
    FROM   filters;

    /****
    *  Count the number of separators in p_operator
    *  to find out how many filter rules we have
    ****/
    SET v_operator := p_operator;
    SELECT LENGTH(v_operator) - LENGTH(REPLACE(v_operator, v_sep, ''))
    INTO   v_rules;

    SET v_query := 'SELECT * FROM v_contacts ';

    /****
    *  Strip the first separator off the parameters
    ****/
    SET p_and_or        := SUBSTR(p_and_or, 2);
    SET p_operator      := SUBSTR(p_operator, 2);
    SET p_profile_field := SUBSTR(p_profile_field, 2);
    SET p_value         := SUBSTR(p_value, 2);

    /****
    *  Replace CONTAINS with LIKE
    ****/
    SET p_operator := REPLACE(p_operator, 'CONTAINS', 'LIKE');

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
        SET v_and_or = 'WHERE';
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

      SET v_query       := CONCAT(v_query, ' ', v_operator);

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
      IF (v_operator = 'LIKE') THEN
        SET v_query       := CONCAT(v_query, ' \'%', v_value, '%\'');
      ELSE
        SET v_query       := CONCAT(v_query, ' \'', v_value, '\'');
      END IF;

      IF p_action = 'I' THEN

        /****
        *  Create filter rule record
        ****/
        INSERT INTO filter_rules (
          filter_id,
          filter_rule_id,
          and_or,
          profile_field,
          operator,
          value
        ) VALUES (
          p_filter_id,
          v_i,
          v_and_or,
          v_profile_field,
          v_operator,
          v_value
        );

      END IF;
      SET v_i := v_i + 1;

    END WHILE;

    /****
    *  Create the filter record
    *
    *  just as well there a no foreign keys
    *  but doing it this way so I don't have to update
    *  the filters table which would fire the modification triggers
    *  could always take them off....
    ****/
    IF p_action = 'I' THEN
      INSERT INTO filters (
        filter_id,
        filter_name,
        description,
        query,
        count_query
      ) VALUES (
        p_filter_id,
        p_filter_name,
        p_description,
        v_query,
        REPLACE(v_query, '*', 'COUNT(*) ')
     );
   END IF;

  END CASE;

  /****
  *  Count how many elements we need to parse
  SET v_sql := CONCAT('SELECT EXTRACTVALUE(xml, \'COUNT(',
                       v_xml_element,
                      ')\') INTO @v_count FROM ',
                       v_load_schema,
                      '.',
                       v_xml_table);
  ****/

  /****
  *  If we're counting then run the query
  IF p_action = 'C' THEN
    SET    @v_dsql = REPLACE(v_query, '*', 'COUNT(*) ');
    PREPARE v_dsql FROM @v_dsql;
    EXECUTE v_dsql;

    SET v_count := @v_count;
  END IF;
  ****/


  /****
  *  Trap errors
  ****/
  IF e_exception THEN
     SET e_exception_s := CONCAT('failed to maintain filter [', 
                                 p_filter_name, 
                                 '] : action [', 
                                 p_action,
                                  ']');
     CALL p_log (
            v_event,
            e_exception_s
          );
  ELSE

    CALL p_log (
           v_event,
           CONCAT('maintained filter [', p_filter_name, '] : action [', p_action, ']')
         );
  END IF;

END main;

ehandler:BEGIN

  CASE e_exception_s
  WHEN 'OK' THEN

    /****
    *  Log success
    ****/
    CALL p_event (
           v_object,
           2,
           v_event
         );

    IF p_action = 'C' THEN
      RETURN REPLACE(v_query, '*', 'COUNT(*) ');
    ELSE
      RETURN TRUE;
    END IF;

  ELSE

    /****
    *  Log failure
    ****/
    CALL p_event (
           v_object,
           3,
           v_event
         );
  RETURN FALSE;
  END CASE;


END ehandler;
END;
$$
