/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_log.sql
* Description   : Creates an audit log entry
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

DROP PROCEDURE IF EXISTS p_log;
DELIMITER $$
CREATE PROCEDURE p_log (
                  p_event  INT,
                  p_text   VARCHAR(1024)
                ) 
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object       VARCHAR(32)    DEFAULT 'p_log';
  DECLARE v_sql          VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql_p        VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows         INT            DEFAULT 0;

  DECLARE e_exception    INT            DEFAULT FALSE;
  DECLARE e_exception_s  VARCHAR(64)    DEFAULT 'OK';

--  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN SET v_exceptions = 'SQLEXCEPTION'; SET p_exception = TRUE; END;


main:BEGIN

  INSERT INTO audit_log (
    event_id,
    text
  ) VALUES (
    p_event,
    p_text
  );

END main;
END;
$$
