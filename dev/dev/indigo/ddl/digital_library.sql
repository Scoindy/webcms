/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : digital_library.sql
* Description   : DDL for the digital_library table
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

DROP TABLE IF EXISTS digital_library;

CREATE TABLE digital_library (
  library_id     INT          NOT NULL AUTO_INCREMENT COMMENT "Unique digital library ID",
  media_type_id  INT          NOT NULL                COMMENT "FK to library_types",  
  title          VARCHAR(64)  NOT NULL                COMMENT "library object title",
  url            VARCHAR(256) NOT NULL                COMMENT "Object URL",
  thumbnail_url  VARCHAR(256) NOT NULL                COMMENT "Thumnail URL",
  filename       VARCHAR(256) NOT NULL                COMMENT "Filename",
  mime_type      VARCHAR(64)  NOT NULL                COMMENT "Object mime type",
  size           DECIMAL(6,2) NOT NULL DEFAULT 0      COMMENT "Object size in KB",
  width          INT          NOT NULL DEFAULT 0      COMMENT "Image width",
  height         INT          NOT NULL DEFAULT 0      COMMENT "Image height",
  soft_delete    BOOLEAN      NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    library_id
  )
);

DROP TRIGGER IF EXISTS t_digital_library_i;
CREATE TRIGGER t_digital_library_i BEFORE INSERT ON digital_library
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_digital_library_u;
CREATE TRIGGER t_digital_library_u BEFORE UPDATE ON digital_library
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
