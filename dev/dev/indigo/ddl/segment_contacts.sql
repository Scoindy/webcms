/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : segment_contacts.sql
* Description   : DDL for the segment_contacts table
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

DROP TABLE IF EXISTS segment_contacts;

CREATE TABLE segment_contacts (
  segment_id       INT          NOT NULL COMMENT "Unique segment ID",
  segment_item_id  INT          NOT NULL COMMENT "Segment item ID",
  contact_id       INT          NOT NULL COMMENT "Contact ID",
  created_by       VARCHAR(64)  NOT NULL COMMENT "Record created by",
  created_date     DATETIME     NOT NULL COMMENT "Record created datestamp",
  modified_by      VARCHAR(64)      NULL COMMENT "Record modified by",
  modified_date    DATETIME         NULL COMMENT "Record modified datestamp",
  PRIMARY KEY (
    segment_id,
    segment_item_id,
    contact_id
  )
);

DROP TRIGGER IF EXISTS t_segment_contacts_i;
CREATE TRIGGER t_segment_contacts_i BEFORE INSERT ON segment_contacts
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_segment_contacts_u;
CREATE TRIGGER t_segment_contacts_u BEFORE UPDATE ON segment_contacts
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO segment_contacts
SELECT 1,
       1,
       indigo_id,
       NULL,
       NULL,
       NULL,
       NULL
FROM   contacts
WHERE  region = 'Auckland';

INSERT INTO segment_contacts
SELECT 1, 
       2,
       indigo_id,
       NULL,
       NULL,
       NULL,
       NULL
FROM   contacts
WHERE  region = 'Wellington';
                     
INSERT INTO segment_contacts
SELECT 1,
       3,
       indigo_id,
       NULL,
       NULL,
       NULL,
       NULL
FROM   contacts
WHERE  region = 'Christchurch';

INSERT INTO segment_contacts
SELECT 1,
       4,
       indigo_id,
       NULL,
       NULL,
       NULL,
       NULL
FROM   contacts
WHERE  IFNULL(region, 'Other') = 'Other' ;

INSERT INTO segment_contacts
SELECT 2,
       1,
       indigo_id,
       NULL,
       NULL,
       NULL,
       NULL
FROM   contacts
WHERE  age < 30;

insert into segment_contacts (
  segment_id,
  segment_item_id,
  contact_id
) select 2,
       1,
       contact_id
from   segment_contacts;
