/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : templates.sql
* Description   : DDL for the contact table
* Author        : Scott Walkinshaw
* Date          : 19th December 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 19 Dec 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS templates;

CREATE TABLE templates (
  template_id    INT           NOT NULL AUTO_INCREMENT COMMENT "unique ID",
  template_name  VARCHAR(64)   NOT NULL                COMMENT "template name",
  html           LONGTEXT      NOT NULL                COMMENT "HTML",
  description    VARCHAR(256)      NULL                COMMENT "description",
  deleted        BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by     VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date   DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by    VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date  DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    template_id
  )
);

DROP TRIGGER IF EXISTS t_t_i;
CREATE TRIGGER t_t_i BEFORE INSERT ON templates
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_t_u;
CREATE TRIGGER t_t_u BEFORE UPDATE ON templates
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

