/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_subscription_maintenance.sql
* Description   : Indigo subscription maintenance
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Dec 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_subscription_maintenance;
DELIMITER $$
CREATE PROCEDURE p_subscription_maintenance (
                   IN   p_u              VARCHAR(64),
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
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_subscription_maintenance';
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
  DECLARE v_subscription_body     LONGTEXT;

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
  *  Unset email permission
  ****/
  IF IFNULL(p_u, '') != '' THEN

    UPDATE contacts
    SET    email_permission = 'N'
    WHERE  uuid             = p_u;

  ELSE
  
    /****
    *  Need to do something drastic here....
    ****/
    SET p_error := 'Unsubscribe without UUID received!';

  END IF;

END main;

ehandler:BEGIN

  CASE 
  WHEN e_exception = FALSE AND
       p_error     = 'OK'  THEN
 
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
           CONCAT('maintained subscription [', p_subscription_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_subscription_name, 
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
