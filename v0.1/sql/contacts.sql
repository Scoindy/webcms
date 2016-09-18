/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : contacts.sql
* Description   : DDL for the contact table
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
* SW    | 1.1  | 18 Dec 11 | split out profile fields                          *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
  contact_id        INT           NOT NULL AUTO_INCREMENT COMMENT "indigo contact ID",
  client_id         VARCHAR(32)   NULL                    COMMENT "client contact ID",
--  full_name         VARCHAR(256)  NULL                    COMMENT "contact full name",
  uuid              VARCHAR(64)   NOT NULL                COMMENT "contact UUID",
  email_address     VARCHAR(128)  NULL                    COMMENT "contact email address",
  email_permission  CHAR(1)       NOT NULL DEFAULT 0,
  deleted           BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by        VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date      DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by       VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date     DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    contact_id
  ),
  INDEX idx1 (
    deleted,
    email_permission
  )
);

DROP TRIGGER IF EXISTS t_c_i;
CREATE TRIGGER t_c_i BEFORE INSERT ON contacts
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW(),
    NEW.uuid         = UUID();

DROP TRIGGER IF EXISTS t_c_u;
CREATE TRIGGER t_c_u BEFORE UPDATE ON contacts
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
