/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : contact.sql
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
*******************************************************************************/
USE dev1;

DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
  contact_id     INT          NOT NULL AUTO_INCREMENT COMMENT "Unique contact ID",
  organistaion   INT          NOT NULL                COMMENT "Client organisation code",
  client_id      INT          NOT NULL                COMMENT "Client contact ID",
  full_name      VARCHAR(256)     NULL                COMMENT "contact full name",
  date_of_birth  DATE             NULL                COMMENT "contact DOB",
  age            INT              NULL                COMMENT "contact age",
  address_1      VARCHAR(256)     NULL DEFAULT NULL   COMMENT "contact address line 1", 
  address_2      VARCHAR(256)     NULL                COMMENT "contact address line 2", 
  address_3      VARCHAR(256)     NULL                COMMENT "contact address line 3", 
  postcode       VARCHAR(64)      NULL DEFAULT 0      COMMENT "contact postcode",
  phone_home     VARCHAR(64)      NULL                COMMENT "contact home phone number",
  phone_work     VARCHAR(64)      NULL                COMMENT "contact work phone number",
  email          VARCHAR(128)     NULL DEFAULT NULL   COMMENT "contact email address",
  soft_delete    BOOLEAN      NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record modified by",
  modified_date  DATETIME         NULL                COMMENT "Record modified datestamp",
  PRIMARY KEY (
    contact_id
  )
);

DROP TRIGGER IF EXISTS t_contacts_i;
CREATE TRIGGER t_contacts_i BEFORE INSERT ON contacts
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_contacts_u;
CREATE TRIGGER t_contacts_u BEFORE UPDATE ON contacts
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
