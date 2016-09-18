/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : filter_rules.sql
* Description   : DDL for the filter_rules table
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

DROP TABLE IF EXISTS filter_rules;

CREATE TABLE filter_rules (
  filter_id         INT           NOT NULL COMMENT "filter ID",
  filter_rule_id    INT           NOT NULL COMMENT "filter rule ID",
  and_or            VARCHAR(64),
  profile_field     VARCHAR(64),
  operator          VARCHAR(64),
  value             VARCHAR(64),
  deleted           BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by        VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date      DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by       VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date     DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    filter_id,
    filter_rule_id
  )
);

DROP TRIGGER IF EXISTS t_fr_i;
CREATE TRIGGER t_fr_i BEFORE INSERT ON filter_rules
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_fr_u;
CREATE TRIGGER t_fr_u BEFORE UPDATE ON filter_rules
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

