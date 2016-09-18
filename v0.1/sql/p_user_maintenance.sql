/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_user_maintenance.sql
* Description   : Indigo user maintenance
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Dec 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_user_maintenance;
DELIMITER $$
CREATE PROCEDURE p_user_maintenance (
                   IN   p_action      VARCHAR(1),
                   IN   p_user_id     INT,
                   IN   p_first_name  VARCHAR(256),
                   IN   p_last_name   VARCHAR(1024),
                   IN   p_username    VARCHAR(64),
                   IN   p_password    VARCHAR(64),
                   IN   p_email       VARCHAR(64),
                   IN   p_role_id     VARCHAR(64),
                   IN   p_status_id   VARCHAR(64),
                   OUT  p_status      CHAR(1),
                   OUT  p_string      VARCHAR(512),
                   OUT  p_error       VARCHAR(512),
                   OUT  p_error_code  VARCHAR(512),
                   OUT  p_new_id      VARCHAR(16),
                   OUT  p_count       VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_user_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_segments       INT            DEFAULT 0; 
  DECLARE v_dummy          VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_run_id         INT            DEFAULT 1;
  DECLARE v_segment_id     VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;
  DECLARE v_done           BOOLEAN         DEFAULT FALSE;
  DECLARE v_db             VARCHAR(16);
  DECLARE v_column         VARCHAR(64);
  DECLARE v_position       INT;
  DECLARE v_columns        VARCHAR(1024)   DEFAULT '';

  DECLARE v_sha1           VARCHAR(40)    DEFAULT NULL;
  DECLARE v_salt1          VARCHAR(64)    DEFAULT 'abc';
  DECLARE v_salt2          VARCHAR(64)    DEFAULT 'xyz';

  DECLARE e_exception      INT            DEFAULT FALSE;

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
  *  Get the next id if creating
  *
  *  we need to send the new id back to the browser
  *  but need to rethink this as > 1 person
  *  could be creating filters at the same time
  *  opt 1 - could lock the table until the proc finished
  *  opt 2 - select the id back out of the table using the name
  *  opt 3 - keep them in a table (could skip sequence though)
  ****/
  IF p_action = 'I' THEN
    SELECT IFNULL(MAX(user_id + 1), 1)
    INTO   p_new_id
    FROM   users;
  END IF;


  /****
  *  Salt and generate password
  ****/
  SELECT sha1(CONCAT(v_salt1, p_password, v_salt2))
  INTO   v_sha1;

  /****
  *  What are we doing to the user?
  ****/
  CASE p_action 
  WHEN 'I' THEN
    INSERT INTO users (
      user_id,
      first_name,
      last_name,
      username,
      password,
      email,
      user_role_id, 
      user_status_id 
    ) VALUES (
      p_new_id,
      p_first_name,
      p_last_name,
      p_username,
      v_sha1,
      p_email,
      p_role_id, 
      p_status_id 
    );

/*
select p_new_id;
select p_first_name;
select p_last_name;
select p_username;
select v_sha1;
select p_email;
select p_role_id;
select p_status_id;
select e_exception;
*/

    IF e_exception THEN
      SET p_error := CONCAT('Error creating user [',
                             p_user_name,
                             ']');
      SET p_error_code := '10';
    END IF;

  WHEN 'U' THEN

   UPDATE users
   SET    first_name     = p_first_name,
          last_name      = p_last_name,
          password       = v_sha1,
          email          = p_email,
          user_role_id   = p_role_id,
          user_status_id = p_status_id
   WHERE  user_id   = p_user_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error updating user [',
                             p_user_name,
                             ']');
      SET p_error_code := '11';
    END IF;

  WHEN 'D' THEN

    UPDATE users
    SET    deleted     = TRUE
    WHERE  user_id = p_user_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error deleting user [',
                             p_user_name,
                             ']');
      SET p_error_code := '12';
    END IF;

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
           CONCAT('maintained user [', p_user_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_user_name, 
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
