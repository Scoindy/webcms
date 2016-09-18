/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : audit_login.sql
* Description   : DDL for the audit_login table
* Author        : Scott Walkinshaw
* Date          : 18th Feb 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 18 Feb 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS audit_login;

CREATE TABLE audit_login (
  login_id       INT            NOT NULL AUTO_INCREMENT COMMENT "Log ID",
  username       VARCHAR(32)    NOT NULL                COMMENT "Unique event ID",
  login_time     DATETIME       NOT NULL                COMMENT "Login time",
  logout_time    DATETIME           NULL                COMMENT "Logout time",
  ip_address     VARCHAR(32)        NULL                COMMENT "Logout time",
  browser        VARCHAR(128)       NULL                COMMENT "Browser type",
  created_by     VARCHAR(64)    NOT NULL                COMMENT "Record created by",
  created_date   DATETIME       NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)        NULL                COMMENT "Record created by",
  modified_date  DATETIME           NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    login_id
  )
);

DROP TRIGGER IF EXISTS t_audit_login_i;
CREATE TRIGGER t_audit_login_i BEFORE INSERT ON audit_login
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_events_u;
CREATE TRIGGER t_audit_login_u BEFORE UPDATE ON audit_login
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
