/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : f_user_delete.sql
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

DROP FUNCTION IF EXISTS f_user_delete;
DELIMITER $$
CREATE FUNCTION f_user_delete (
                  p_user_id  INT
                ) RETURNS INT
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'f_user_delete';
  DECLARE v_event        INT            DEFAULT 0;
  DECLARE v_salt1        VARCHAR(64)    DEFAULT 'abc';
  DECLARE v_salt2        VARCHAR(64)    DEFAULT 'xyz';
  DECLARE v_sql          VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql_p        VARCHAR(4096)  DEFAULT '';
  DECLARE v_sha1         VARCHAR(40)    DEFAULT NULL;
  DECLARE v_rows         INT            DEFAULT 0;
  DECLARE v_debug        VARCHAR(1024)  DEFAULT 'test';

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
  *  Salt and generate password
  ****/
  SELECT sha1(CONCAT(v_salt1, p_password, v_salt2))
  INTO   v_sha1;

/*
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
  *  Soft delete user
  ****/
  UPDATE indigo_users 
  SET    soft_delete = 1
  WHERE  indigo_user_id = IFNULL(p_user_id, 0);

  /****
  *  Trap errors
  *
  *  looks like sqlexception gets set to the number of rows updated?
  ****/
  IF e_exception != 1 THEN
--     SET e_exception_s := CONCAT('failed to soft delete user [', p_user_id, ']');
     SET e_exception_s := CONCAT('failed to soft delete user [', e_exception, ']');
     CALL p_log (
            v_event,
            e_exception_s
          );
  ELSE

    CALL p_log (
           v_event,
           CONCAT('soft deleted user [', p_user_id, ']')
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
    RETURN TRUE;

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
