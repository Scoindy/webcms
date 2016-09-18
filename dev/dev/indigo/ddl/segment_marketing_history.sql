/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segment_marketing_history.sql
* Description   : DDL for the segment_marketing_history table
* Author        : Scott Walkinshaw
* Date          : 8th April 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Apr 11 | Initial issue                                     *
*******************************************************************************/
USE dev1;

DROP TABLE IF EXISTS segment_marketing_history;

CREATE TABLE segment_marketing_history (
  segment_period   DATE         NOT NULL COMMENT "Segment period",
  segment_id       INT          NOT NULL COMMENT "Unique segment ID",
  segment_item_id  INT          NOT NULL COMMENT "Segment item ID",
  contact_id       INT          NOT NULL COMMENT "Contact ID",
  created_by       VARCHAR(64)  NOT NULL COMMENT "Record created by",
  created_date     DATETIME     NOT NULL COMMENT "Record created datestamp",
  modified_by      VARCHAR(64)      NULL COMMENT "Record modified by",
  modified_date    DATETIME         NULL COMMENT "Record modified datestamp",
  PRIMARY KEY (
    segment_period,
    segment_id,
    segment_item_id,
    contact_id
  )
);

DROP TRIGGER IF EXISTS t_segment_marketing_history_i;
CREATE TRIGGER t_segment_marketing_history_i BEFORE INSERT ON segment_marketing_history
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segment_marketing_history_u;
CREATE TRIGGER t_segment_marketing_history_u BEFORE UPDATE ON segment_marketing_history
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

insert into segment_marketing_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-08-01', segment_id, segment_item_id, contact_id
from segment_contacts;
update segment_marketing_history
set  segment_item_id = 1
where contact_id < 100;

update segment_marketing_history
set  segment_item_id = 2
where contact_id between 100 AND 350;

update segment_marketing_history
set  segment_item_id = 3
where contact_id between 350 AND 700;

update segment_marketing_history
set  segment_item_id = 4
where contact_id > 700;
