/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : f_event.sql
* Description   : Creates an audit event 
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
USE dev2;

DROP PROCEDURE IF EXISTS p_event;
DELIMITER $$
CREATE PROCEDURE p_event (
                  IN     p_object  VARCHAR(32),
                  IN     p_action  INT,
                  INOUT  p_event   INT
                )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'f_event';
  DECLARE v_sql          VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql_p        VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows         INT            DEFAULT 0;

  DECLARE e_exception    INT            DEFAULT FALSE;
  DECLARE e_exception_s  VARCHAR(64)    DEFAULT 'OK';

--  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN SET v_exceptions = 'SQLEXCEPTION'; SET p_exception = TRUE; END;


main:BEGIN

  /****
  *  Log event
  *
  *  Possible actions:
  *    1 - start
  *    2 - complete success
  *    3 - complete failure
  ****/
  CASE
  WHEN p_action = 1 THEN

    INSERT INTO audit_events (
      event_name, 
      event_status
    ) VALUES (
      p_object,
      'STARTED'
    );

    SET p_event := LAST_INSERT_ID();

  WHEN p_action = 2 THEN

    UPDATE audit_events
    SET    event_status = 'SUCCESS'
    WHERE  event_id     = p_event; 

  WHEN p_action = 3 THEN
 
    UPDATE audit_events
    SET    event_status = 'ERROR'
    WHERE  event_id     = p_event; 

  END CASE;  

  /****
  *  Trap errors
  ****/
  SET v_rows = ROW_COUNT();

END main;
END;
$$
