/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segment_items.sql
* Description   : DDL for the segment_items table
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
* SW    | 1.0  | 08 Jun 11 | Initial issue                                     *
*******************************************************************************/
USE dev1;

DROP TABLE IF EXISTS segment_items;

CREATE TABLE segment_items (
  segment_id                INT          NOT NULL COMMENT "Segment ID",
  segment_item_id           INT          NOT NULL COMMENT "Segment item ID",
  segment_item_name         VARCHAR(32)  NOT NULL COMMENT "Segment item name (short to appear in combo)",
  segment_item_description  VARCHAR(512)     NULL COMMENT "Segment item description",
  created_by                VARCHAR(64)  NOT NULL COMMENT "Record created by",
  created_date              DATETIME     NOT NULL COMMENT "Record created datestamp",
  modified_by               VARCHAR(64)      NULL COMMENT "Record modified by",
  modified_date             DATETIME         NULL COMMENT "Record modified datestamp",
  PRIMARY KEY (
    segment_id,
    segment_item_id
  )
);

DROP TRIGGER IF EXISTS t_segment_items_i;
CREATE TRIGGER t_segment_items_i BEFORE INSERT ON segment_items
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segment_items_u;
CREATE TRIGGER t_segment_items_u BEFORE UPDATE ON segment_items
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO segment_items (
  segment_id,
  segment_item_id,
  segment_item_name,
  segment_item_description
) VALUES (
  1,
  1,
  'Auckland',
  'Customers in the Auckland region'
);

INSERT INTO segment_items (
  segment_id,
  segment_item_id,
  segment_item_name,
  segment_item_description
) VALUES (
  1, 
  2,
  'Wellington',
  'Customers in the Wellington region'
);

INSERT INTO segment_items (
  segment_id,
  segment_item_id,
  segment_item_name,
  segment_item_description
) VALUES (
  1,
  3,
  'Christchurch',
  'Customers in the Christchurch region'
);

INSERT INTO segment_items (
  segment_id,
  segment_item_id,
  segment_item_name,
  segment_item_description
) VALUES (
  1,
  4,
  'Other',
  'Customers in other regions'
);

INSERT INTO segment_items (
  segment_id,
  segment_item_id,
  segment_item_name,
  segment_item_description
) VALUES (
  2,
  1,
  'Campaign',
  NULL
);
