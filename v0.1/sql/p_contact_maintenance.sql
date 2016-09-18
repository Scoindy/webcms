/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_contact_maintenance.sql
* Description   : Indigo contact maintenance
* Author        : Scott Walkinshaw
* Date          : 7th November 2011
* Parameters    : 
* Comments      : need to make sure something is always returned in the out 
*                 parameters
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Nov 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_contact_maintenance;
DELIMITER $$
CREATE PROCEDURE p_contact_maintenance (
                   IN   p_action            VARCHAR(1),
                   IN   p_contact_id        INT,
                   IN   p_email_address     VARCHAR(256),
                   IN   p_email_permission  CHAR(1),
                   IN   p_profile_field     VARCHAR(4096),
                   OUT  p_status            CHAR(1),
                   OUT  p_string            VARCHAR(512),
                   OUT  p_error             VARCHAR(512),
                   OUT  p_error_code        VARCHAR(512),
                   OUT  p_new_id            VARCHAR(16),
                   OUT  p_count             VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_contact_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_fields          INT            DEFAULT 0; 
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
DECLARE v_email_permission CHAR(1);

  DECLARE e_exception    INT            DEFAULT FALSE;

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
  *  What are we doing to the contact?
  ****/
  CASE p_action 
  WHEN 'U' THEN

    /****
    *  Count the number of separators in p_operator
    *  to find out how many contact rules we have
    ****/
    SET v_profile_field := p_profile_field;
    SELECT LENGTH(v_profile_field) - LENGTH(REPLACE(v_profile_field, v_sep, ''))
    INTO   v_fields;

--    select v_fields;

    SET v_query := 'UPDATE v_contact_profiles SET ';

    /****
    *  Strip the first separator off the array
    ****/
    SET p_profile_field := SUBSTR(p_profile_field, 2);

    /****
    *  Separate the rule strings and build query
    ****/
    WHILE (v_i <= v_fields) DO

      /****
      *  Profile Fields
      ****/
      SELECT SUBSTRING_INDEX(p_profile_field, v_sep, 1)
      INTO   v_profile_field;
      SELECT SUBSTRING(p_profile_field, LOCATE(v_sep, p_profile_field) + 1)
      INTO   p_profile_field;

      IF v_i = 1 THEN
        SET v_query := CONCAT(v_query, 'profile_field_0', v_i, ' = \'', v_profile_field, '\'');
      ELSEIF v_i < 10 THEN
        SET v_query := CONCAT(v_query, ',profile_field_0', v_i, ' = \'', v_profile_field, '\'');
      ELSE
        SET v_query := CONCAT(v_query, ',profile_field_', v_i, ' = \'', v_profile_field, '\'');
      END IF;

      SET v_i := v_i + 1;
    END WHILE;

    /****
    *  Update the contacts table
    ****/
    IF p_email_permission = '1' THEN
      SET v_email_permission := 'Y';
    ELSE
      SET v_email_permission := 'N';
    END IF;
    UPDATE contacts
    SET    email_address    = p_email_address,
           email_permission = v_email_permission
    WHERE  contact_id       = p_contact_id;


    /****
    *  Dynamic SQL to update the contact_profiles table
    *  (done through the v_contact_profiles view)
    SELECT v_query;
    ****/
    SET v_query := CONCAT(v_query, ' WHERE contact_id = ', p_contact_id);
    SET    @v_dsql = v_query;
    PREPARE v_dsql FROM @v_dsql;
    EXECUTE v_dsql;

  WHEN 'D' THEN

    /****
    *  Set the deleted flag on
    *  the contacts tables
    ****/
    UPDATE contacts
    SET    deleted = TRUE
    WHERE  contact_id = p_contact_id;

  ELSE

    /****
    *  Nothing to do
    ****/
    SET v_dummy := 'dummy';

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
           CONCAT('maintained contact [', p_contact_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                           ']:[',
                           p_contact_name,
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
