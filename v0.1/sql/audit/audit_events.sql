/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : audit_events.sql
* Description   : DDL for the audit_events table
* Author        : Scott Walkinshaw
* Date          : 8th Feb 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Feb 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS audit_events;

CREATE TABLE audit_events (
  event_id       INT          NOT NULL AUTO_INCREMENT COMMENT "Unique event ID",
  event_name     VARCHAR(32)  NOT NULL                COMMENT "Event Name",
  event_status   VARCHAR(32)  NOT NULL                COMMENT "Status of event",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    event_id
  )
);

DROP TRIGGER IF EXISTS t_audit_events_i;
CREATE TRIGGER t_audit_events_i BEFORE INSERT ON audit_events
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_events_u;
CREATE TRIGGER t_audit_events_u BEFORE UPDATE ON audit_events
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
