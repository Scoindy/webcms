/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : email_status.sql
* Description   : DDL for the email_status table
* Author        : Scott Walkinshaw
* Date          : 8th July 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Jul 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS email_status;

CREATE TABLE email_status (
  email_status_id  INT          NOT NULL AUTO_INCREMENT COMMENT "campaign type ID",
  email_status     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "campaign type descsription",
  deleted          BOOLEAN      NOT NULL DEFAULT 0,
  created_by       VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date     DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by      VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date    DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    email_status_id
  )
);

DROP TRIGGER IF EXISTS t_es_i;
CREATE TRIGGER t_es_i BEFORE INSERT ON email_status
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_es_u;
CREATE TRIGGER t_es_u BEFORE UPDATE ON email_status
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO email_status (email_status) VALUES ('Not Sent');
INSERT INTO email_status (email_status) VALUES ('Sent');
INSERT INTO email_status (email_status) VALUES ('Accepted');
INSERT INTO email_status (email_status) VALUES ('Bounced');
INSERT INTO email_status (email_status) VALUES ('Rendered');
INSERT INTO email_status (email_status) VALUES ('Error');
