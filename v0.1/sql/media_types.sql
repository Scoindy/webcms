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
USE dev2;

DROP TABLE IF EXISTS media_types;

CREATE TABLE media_types (
  media_type_id  INT          NOT NULL AUTO_INCREMENT COMMENT "media type ID",
  media_type     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "media type descsription",
  deleted        BOOLEAN      NOT NULL DEFAULT 0,
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    media_type_id
  )
);

DROP TRIGGER IF EXISTS t_mt_i;
CREATE TRIGGER t_mt_i BEFORE INSERT ON media_types
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_mt_u;
CREATE TRIGGER t_mt_u BEFORE UPDATE ON media_types
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO media_types (media_type) VALUES ('Image');
INSERT INTO media_types (media_type) VALUES ('Video');
