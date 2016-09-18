/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segment_types.sql
* Description   : DDL for the segment_types table
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

DROP TABLE IF EXISTS segment_types;

CREATE TABLE segment_types (
  segment_type_id  INT          NOT NULL AUTO_INCREMENT COMMENT "segment type ID",
  segment_type     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "segment type descsription",
  created_by       VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date     DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by      VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date    DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    segment_type_id
  )
);

DROP TRIGGER IF EXISTS t_segment_types_i;
CREATE TRIGGER t_segment_types_i BEFORE INSERT ON segment_types
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segment_types_u;
CREATE TRIGGER t_segment_types_u BEFORE UPDATE ON segment_types
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO segment_types (segment_type) VALUES ('Marketing');
INSERT INTO segment_types (segment_type) VALUES ('Campaign');
INSERT INTO segment_types (segment_type) VALUES ('System');
