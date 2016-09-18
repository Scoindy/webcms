/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : substitution_fields.sql
* Description   : DDL for the substitution_fields table
* Author        : Scott Walkinshaw
* Date          : 7th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS substitution_fields;

CREATE TABLE substitution_fields (
  substitution_id  INT           NOT NULL AUTO_INCREMENT COMMENT "unique ID",
  profile_field    VARCHAR(64)   NOT NULL,
  default_value    VARCHAR(64)   NOT NULL,
  deleted          BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by       VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date     DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by      VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date    DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    substitution_id
  )
);

DROP TRIGGER IF EXISTS t_ff_i;
CREATE TRIGGER t_sf_i BEFORE INSERT ON substitution_fields
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_sf_u;
CREATE TRIGGER t_sf_u BEFORE UPDATE ON substitution_fields
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
