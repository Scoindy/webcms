/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : profile_fields.sql
* Description   : DDL for the profile_fields table
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

DROP TABLE IF EXISTS profile_fields;

CREATE TABLE profile_fields (
  field_id              INT           NOT NULL AUTO_INCREMENT COMMENT "indigo contact ID",
  field_label           VARCHAR(64)       NULL,
  source_column         VARCHAR(64)       NULL,
  view_column           VARCHAR(64)       NULL,
  substitution_default  VARCHAR(64)       NULL,
  substitution_field    BOOLEAN       NOT NULL DEFAULT 0,
  contact_search        BOOLEAN       NOT NULL DEFAULT 0,
  contact_filter        BOOLEAN       NOT NULL DEFAULT 0,
  profile_label         BOOLEAN       NOT NULL DEFAULT 0,
  deleted               BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by            VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date          DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by           VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date         DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    field_id
  )
);

DROP TRIGGER IF EXISTS t_pf_i;
CREATE TRIGGER t_pf_i BEFORE INSERT ON profile_fields
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_pf_u;
CREATE TRIGGER t_pf_u BEFORE UPDATE ON profile_fields
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

source data/load_profile_fields.sql

UPDATE profile_fields
SET    substitution_default = CONCAT('default_sub_', source_column),
       substitution_field   = contact_search;
