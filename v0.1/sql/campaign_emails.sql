/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : campaign_emails.sql
* Description   : DDL for the campaign_emails.sql table
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

DROP TABLE IF EXISTS campaign_emails;

CREATE TABLE campaign_emails (
  campaign_email_id  INT           NOT NULL                COMMENT "campaign email ID",
  contact_id         INT           NOT NULL                COMMENT "contact_id",
  email_address      VARCHAR(128)  NOT NULL                COMMENT "email address",
  campaign_id        INT           NOT NULL                COMMENT "Unique campaign ID",
  email_id           INT           NOT NULL                COMMENT "email ID",
  email_subject      VARCHAR(128),
  email_body         TEXT          NOT NULL                COMMENT "html/plain text",
  sender_name        VARCHAR(128),  
  sender_address     VARCHAR(128),  
  reply_to           VARCHAR(128),  
  email_status_id    INTEGER       NOT NULL DEFAULT 1      COMMENT "FK to email_status table",
  status_datetime    DATETIME          NULL,
  sent               BOOLEAN       NOT NULL DEFAULT 0      COMMENT "has email been sent",
  sent_datetime      DATETIME          NULL                COMMENT "date email transmitted",
  accepted           BOOLEAN       NOT NULL DEFAULT 0      COMMENT "has email been accepted",
  accepted_datetime  DATETIME          NULL                COMMENT "date email accepted",
  bounced            BOOLEAN       NOT NULL DEFAULT 0      COMMENT "has email been bounced",
  bounced_datetime   DATETIME          NULL                COMMENT "date email bounced",
  rendered           BOOLEAN       NOT NULL DEFAULT 0      COMMENT "has email been rendered",
  rendered_datetime  DATETIME          NULL                COMMENT "date email rendered",
  created_by         VARCHAR(64)   NOT NULL                COMMENT "Record created by",
  created_date       DATETIME      NOT NULL                COMMENT "Record created datestamp",
  modified_by        VARCHAR(64)       NULL                COMMENT "Record modified by",
  modified_date      DATETIME          NULL                COMMENT "Record modified datestamp",
  PRIMARY KEY (
    campaign_email_id,
    contact_id
  ),
  UNIQUE INDEX idx1(
    campaign_email_id,
    sent,
    contact_id
  )
);

DROP TRIGGER IF EXISTS t_ce_i;
CREATE TRIGGER t_ce_i BEFORE INSERT ON campaign_emails
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DELIMITER $$
DROP TRIGGER IF EXISTS t_ce_u;
CREATE TRIGGER t_ce_u BEFORE UPDATE ON campaign_emails
FOR EACH ROW BEGIN
  IF NEW.sent = TRUE THEN
    SET NEW.email_status_id = 2,
        NEW.status_datetime = NEW.sent_datetime;
  ELSEIF NEW.rendered = TRUE THEN
     SET NEW.email_status_id = 3,
         NEW.status_datetime = NEW.rendered_datetime;
  END IF;
  SET NEW.modified_by   = USER(),
      NEW.modified_date = NOW();
END
$$
