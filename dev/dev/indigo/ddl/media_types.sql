/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : media_types.sql
* Description   : DDL for the media_types table
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

DROP TABLE IF EXISTS media_types;

CREATE TABLE media_types (
  media_type_id  INT          NOT NULL AUTO_INCREMENT COMMENT "Media type ID",
  media_type     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "Media type descsription",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    media_type_id
  )
);

DROP TRIGGER IF EXISTS t_media_types_i;
CREATE TRIGGER t_media_types_i BEFORE INSERT ON media_types
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_media_types_u;
CREATE TRIGGER t_media_types_u BEFORE UPDATE ON media_types
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO media_types (media_type) VALUES ('Image');
INSERT INTO media_types (media_type) VALUES ('Office Document');
INSERT INTO media_types (media_type) VALUES ('MP3');
