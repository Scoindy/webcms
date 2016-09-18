/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : campaign_segments.sql
* Description   : DDL for the campaigns table
* Author        : Scott Walkinshaw
* Date          : 2nd January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 02 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS campaign_segments;

CREATE TABLE campaign_segments (
  campaign_id          INT           NOT NULL AUTO_INCREMENT COMMENT "campaign ID",
  campaign_segment_id  INT           NOT NULL                COMMENT "campaign segment counter",
  segment_id           INT           NOT NULL                COMMENT "segment id",
  deleted              BOOLEAN       NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by           VARCHAR(64)   NOT NULL                COMMENT "Record created by",
  created_date         DATETIME      NOT NULL                COMMENT "Record created datestamp",
  modified_by          VARCHAR(64)       NULL                COMMENT "Record modified by",
  modified_date        DATETIME          NULL                COMMENT "Record modified datestamp",
  PRIMARY KEY (
    campaign_id,
    campaign_segment_id
  ),
  UNIQUE INDEX (
    campaign_id,
    segment_id
  )
);

DROP TRIGGER IF EXISTS t_cs_i;
CREATE TRIGGER t_cs_i BEFORE INSERT ON campaign_segments
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_cs_u;
CREATE TRIGGER t_cs_u BEFORE UPDATE ON campaign_segments
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

