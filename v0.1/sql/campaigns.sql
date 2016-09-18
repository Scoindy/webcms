/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : campaigns.sql
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

DROP TABLE IF EXISTS campaigns;

CREATE TABLE campaigns (
  campaign_id         INT           NOT NULL AUTO_INCREMENT COMMENT "Unique campaign ID",
  campaign_type_id    INT           NOT NULL                COMMENT "campaign type ID",
  campaign_status_id  INT           NOT NULL                COMMENT "campaign status",
  campaign_name       VARCHAR(512)  NOT NULL                COMMENT "campaign name",
  description         VARCHAR(512)      NULL                COMMENT "campaign description",
  start_date          DATE          NOT NULL                COMMENT "start date",
  end_date            DATE              NULL                COMMENT "end date",
  email_id            INT               NULL                COMMENT "email_id",
  campaign_email_id   INT               NULL                COMMENT "the campaign_email_id",
  deleted             BOOLEAN       NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by          VARCHAR(64)    NULL                COMMENT "Record created by",
  created_date        DATETIME       NULL                COMMENT "Record created datestamp",
  modified_by         VARCHAR(64)       NULL                COMMENT "Record modified by",
  modified_date       DATETIME          NULL                COMMENT "Record modified datestamp",
  PRIMARY KEY (
    campaign_id
  )
/*
  UNIQUE INDEX (
    campaign_name,
    deleted
  )
*/
);

DROP TRIGGER IF EXISTS t_cm_i;
CREATE TRIGGER t_cm_i BEFORE INSERT ON campaigns
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_cm_u;
CREATE TRIGGER t_cm_u BEFORE UPDATE ON campaigns
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();


