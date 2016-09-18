/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : f_user_maintenance.sql
* Description   : Indigo user maintenance
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

DROP FUNCTION IF EXISTS f_user_maintenance;
DELIMITER $$
CREATE FUNCTION f_user_maintenance (
                  p_user_id     INT,
                  p_first_name  VARCHAR(32),
                  p_last_name   VARCHAR(32),
                  p_username    VARCHAR(32),
                  p_email       VARCHAR(64),
                  p_password    VARCHAR(32),
                  p_role        INT,
                  p_status      INT,
                  p_action      VARCHAR(1)
                ) RETURNS INT
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'f_user_maintenance';
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

  /****
  *  Are we inserting or updating
  ****/
  CASE p_action 
  WHEN 'I' THEN

    /****
    *  Salt and generate password
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
      v_event
    );

  WHEN 'U' THEN

    UPDATE indigo_users
    SET    first_name     = p_first_name,
           last_name      = p_last_name,
           full_name      = CONCAT(p_first_name, ' ', p_last_name),
           email          = p_email,
           password       = v_sha1,
           user_role_id   = p_role,
           user_status_id = p_status,
           event_id       = v_event
    WHERE  indigo_user_id = p_user_id;

    /****
    *  Has the password changed?
    ****/
    IF p_password != '[[[[]]]]' THEN

      /****
      *  Salt and generate password
      ****/
      SELECT sha1(CONCAT(v_salt1, p_password, v_salt2))
      INTO   v_sha1;

      UPDATE indigo_users
      SET    password = v_sha1
      WHERE  indigo_user_id = p_user_id;
    END IF;

  WHEN 'D' THEN

    /****
    *  Soft delete user
    ****/
    UPDATE indigo_users
    SET    soft_delete = 1
    WHERE  indigo_user_id = IFNULL(p_user_id, 0);

  ELSE

    RETURN FALSE;

  END CASE;

  INSERT INTO debug (
                debug_time,
                text
              ) values (
                NOW(),
                'x1'
              );

  /****
  *  Trap errors
  ****/
  IF e_exception THEN
     SET e_exception_s := CONCAT('failed to create user [', p_username, ']');
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
