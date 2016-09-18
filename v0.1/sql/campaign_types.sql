/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : campaign_types.sql
* Description   : DDL for the campaign_types table
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

DROP TABLE IF EXISTS campaign_types;

CREATE TABLE campaign_types (
  campaign_type_id  INT          NOT NULL AUTO_INCREMENT COMMENT "campaign type ID",
  campaign_type     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "campaign type descsription",
  deleted           BOOLEAN      NOT NULL DEFAULT 0,
  created_by        VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date      DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by       VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date     DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    campaign_type_id
  )
);

DROP TRIGGER IF EXISTS t_ct_i;
CREATE TRIGGER t_ct_i BEFORE INSERT ON campaign_types
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_ct_u;
CREATE TRIGGER t_ct_u BEFORE UPDATE ON campaign_types
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO campaign_types (campaign_type) VALUES ('Email');
INSERT INTO campaign_types (campaign_type) VALUES ('SMS');
