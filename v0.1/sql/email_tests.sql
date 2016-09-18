/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : email_tests.sql
* Description   : DDL for the emails table
* Author        : Scott Walkinshaw
* Date          : 5th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 05 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS email_tests;

CREATE TABLE email_tests (
  email_id        INT           NOT NULL            COMMENT "unique email ID",
  email_name      VARCHAR(32)   NULL                COMMENT "emails name",
  email_subject   VARCHAR(128)  NOT NULL            COMMENT "email subject",
  email_body      LONGTEXT      NOT NULL            COMMENT "HTML email body",
  email_body_sub  LONGTEXT      NOT NULL            COMMENT "HTML email body",
  sender_name     VARCHAR(128)  NOT NULL            COMMENT "email from name",
  sender_address  VARCHAR(128)  NOT NULL            COMMENT "email from address",
  reply_to        VARCHAR(128)  NOT NULL            COMMENT "reply to address",
  description     VARCHAR(256)  NULL                COMMENT "description",
  template_id     INTEGER       NULL                COMMENT "the ID of the template",
  test_address    VARCHAR(64)   NOT NULL            COMMENT "the test email address",
  deleted         BOOLEAN       NOT NULL DEFAULT 0  COMMENT "soft delete flag",
  created_by      VARCHAR(64)   NOT NULL            COMMENT "record created by",
  created_date    DATETIME      NOT NULL            COMMENT "record created datestamp",
  modified_by     VARCHAR(64)       NULL            COMMENT "record modified by",
  modified_date   DATETIME          NULL            COMMENT "record modified datestamp",
  PRIMARY KEY (
    email_id
  )
);

DROP TRIGGER IF EXISTS t_et_i;
CREATE TRIGGER t_et_i BEFORE INSERT ON email_tests
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_et_u;
CREATE TRIGGER t_et_u BEFORE UPDATE ON email_tests
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

