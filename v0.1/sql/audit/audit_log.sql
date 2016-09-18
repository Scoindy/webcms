/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : audit_log.sql
* Description   : DDL for the audit_log table
* Author        : Scott Walkinshaw
* Date          : 8th Feb 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Feb 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS audit_log;

CREATE TABLE audit_log (
  log_id         INT            NOT NULL AUTO_INCREMENT COMMENT "Log ID",
  event_id       INT            NOT NULL                COMMENT "Unique event ID",
  text           VARCHAR(1024)  NOT NULL                COMMENT "Log text",
  mysql_error    VARCHAR(1024)      NULL                COMMENT "MySQL error message",
  created_by     VARCHAR(64)    NOT NULL                COMMENT "Record created by",
  created_date   DATETIME       NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)        NULL                COMMENT "Record created by",
  modified_date  DATETIME           NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    log_id
  )
);

DROP TRIGGER IF EXISTS t_audit_log_i;
CREATE TRIGGER t_audit_log_i BEFORE INSERT ON audit_log
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_events_u;
CREATE TRIGGER t_audit_log_u BEFORE UPDATE ON audit_log
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
