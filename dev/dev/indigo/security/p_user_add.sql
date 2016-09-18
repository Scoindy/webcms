/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_user_add.sql
* Description   : Creates an Indigo user
* Author        : Scott Walkinshaw
* Date          : 7th February 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Feb 11 | Initial issue                                     *
*******************************************************************************/
USE dev1;

DROP PROCEDURE IF EXISTS p_user_add;
DELIMITER $$
CREATE PROCEDURE p_user_add (
                   IN  p_first_name  VARCHAR(32),
                   IN  p_last_name   VARCHAR(32),
                   IN  p_username    VARCHAR(32),
                   IN  p_email       VARCHAR(64),
                   IN  p_password    VARCHAR(32),
                   IN  p_role        INT,
                   IN  p_status      INT
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'p_user_add';
  DECLARE v_event        INT            DEFAULT 0;
  DECLARE v_salt1        VARCHAR(64)    DEFAULT 'abc';
  DECLARE v_salt2        VARCHAR(64)    DEFAULT 'xyz';
  DECLARE v_sql          VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql_p        VARCHAR(4096)  DEFAULT '';
  DECLARE v_sha1         VARCHAR(40)    DEFAULT NULL;
  DECLARE v_rows         INT            DEFAULT 0;

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

  /****
  *  Salt password
  ****/
  SELECT sha1(CONCAT(v_salt1, p_password, v_salt2))
  INTO   v_sha1;

  /****
  *  Add INITCAP full name
  ****/
  INSERT INTO indigo_users (
    client_id,
    first_name,
    last_name,
    username, 
    email,
    password,
    user_role_id,
    user_status_id,
    event_id
  ) VALUES (
    '100',
    p_first_name, 
    p_last_name,
    p_username,
    p_email,
    v_sha1,
    p_role,
    p_status,
    1,
    v_event
  );

  /****
  *  Trap errors
  ****/
  IF e_exception THEN
     SET e_exception_s := CONCAT('failed to create user [', p_username, ']');
     SELECT e_exception_s;
     CALL p_log (
            v_event,
            e_exception_s
          );

  ELSE

    CALL p_log (
           v_event,
           CONCAT('created user [', p_username, ']')
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

  ELSE

    /****
    *  Log failure
    ****/
    CALL p_event (
           v_object,
           3,
           v_event
         );
  END CASE;


END ehandler;
END;
$$
