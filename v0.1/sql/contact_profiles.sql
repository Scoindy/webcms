/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : contact_profiles.sql
* Description   : DDL for the contact_profiles table
* Author        : Scott Walkinshaw
* Date          : 24th December 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 24 Dec 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS contact_profiles;

CREATE TABLE contact_profiles (
  contact_id         INT           NOT NULL AUTO_INCREMENT COMMENT "indigo contact ID",
  first_name         VARCHAR(64)       NULL,
  last_name          VARCHAR(64)       NULL,
  title              VARCHAR(16)       NULL,
  company            VARCHAR(64)       NULL,
  department         VARCHAR(64)       NULL,
  address_1          VARCHAR(64)       NULL,
  address_2          VARCHAR(64)       NULL,
  address_3          VARCHAR(64)       NULL,
  address_4          VARCHAR(64)       NULL,
  postcode           VARCHAR(32)       NULL,
  phone_work         VARCHAR(64)       NULL,
  phone_mobile       VARCHAR(64)       NULL,
  fax                VARCHAR(64)       NULL,
  datamine_bdm       VARCHAR(64)       NULL,
  retail_watch_flag  BOOLEAN       NOT NULL DEFAULT 0,
  deleted            BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by         VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date       DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by        VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date      DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    contact_id
  )
);

DROP TRIGGER IF EXISTS t_cp_i;
CREATE TRIGGER t_cp_i BEFORE INSERT ON contact_profiles
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_cp_u;
CREATE TRIGGER t_cp_u BEFORE UPDATE ON contact_profiles
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
