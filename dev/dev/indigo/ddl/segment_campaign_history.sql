/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segment_campaign_history.sql
* Description   : DDL for the segment_campaign_history table
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

DROP TABLE IF EXISTS segment_campaign_history;

CREATE TABLE segment_campaign_history (
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

DROP TRIGGER IF EXISTS t_segment_campaign_history_i;
CREATE TRIGGER t_segment_campaign_history_i BEFORE INSERT ON segment_campaign_history
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segment_campaign_history_u;
CREATE TRIGGER t_segment_campaign_history_u BEFORE UPDATE ON segment_campaign_history
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-08-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 850;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-07-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 800;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-06-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 720;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-05-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 500;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-04-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 600;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-03-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 450;

insert into segment_campaign_history (
  segment_period,
  segment_id,
  segment_item_id,
  contact_id
) select '2011-02-01', segment_id, segment_item_id, contact_id
from segment_contacts
where  segment_id = 2
and    contact_id < 201;
