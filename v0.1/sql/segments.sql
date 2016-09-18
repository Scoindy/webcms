/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segments.sql
* Description   : DDL for the segments table
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

DROP TABLE IF EXISTS segments;

CREATE TABLE segments (
  segment_id       INT           NOT NULL AUTO_INCREMENT COMMENT "Unique segment ID",
  segment_type_id  INT           NOT NULL                COMMENT "Segment type ID",
  segment_name     VARCHAR(512)  NOT NULL                COMMENT "Segment name",
  description      VARCHAR(512)  NOT NULL                COMMENT "Segment description",
  query            VARCHAR(1024) NULL                    COMMENT "query",
  count_query      VARCHAR(1024) NULL                    COMMENT "counto query",
  deleted          BOOLEAN       NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by       VARCHAR(64)   NOT NULL                COMMENT "Record created by",
  created_date     DATETIME      NOT NULL                COMMENT "Record created datestamp",
  modified_by      VARCHAR(64)       NULL                COMMENT "Record modified by",
  modified_date    DATETIME          NULL                COMMENT "Record modified datestamp",
  PRIMARY KEY (
    segment_id
  ),
  UNIQUE INDEX (
    segment_name,
    deleted
  )
);

DROP TRIGGER IF EXISTS t_segments_i;
CREATE TRIGGER t_segments_i BEFORE INSERT ON segments
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segments_u;
CREATE TRIGGER t_segments_u BEFORE UPDATE ON segments
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
/*
INSERT INTO segments (
  segment_type_id,
  segment_name,
  description
) VALUES (
  1,
  'Region',
  'Customer region'
);

INSERT INTO segments (
  segment_type_id,
  segment_name,
  description
) VALUES (
  2,
  'Age < 30',
  'Contacts younger than 30 years old'
);
*/
