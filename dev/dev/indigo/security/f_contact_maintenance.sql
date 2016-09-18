/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : f_contact_maintenance.sql
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

DROP FUNCTION IF EXISTS f_contact_maintenance;
DELIMITER $$
CREATE FUNCTION f_contact_maintenance (
                  p_indigo_id  INT,
                  p_email      INT,
                  p_sms        INT,
                  p_postal     INT,
                  p_action     VARCHAR(1)
                ) RETURNS INT
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'f_contact_maintenance';
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
  *  Are we inserting or updating
  ****/
  CASE p_action 
  WHEN 'U' THEN

    UPDATE contacts
    SET    email_permission  = p_email,
           sms_permission    = p_sms,
           postal_permission = p_postal
    WHERE  indigo_id    = p_indigo_id;

  WHEN 'D' THEN

    /****
    *  Soft delete user
    ****/
    UPDATE contacts
    SET    soft_delete = 1
    WHERE  indigo_id = IFNULL(p_indigo_id, 0);

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
     SET e_exception_s := CONCAT('failed to maintain contact [', p_indigo_id, ']');
     CALL p_log (
            v_event,
            e_exception_s
          );
  ELSE

    CALL p_log (
           v_event,
           CONCAT('maintaned contact [', p_indigo_id, ']')
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
