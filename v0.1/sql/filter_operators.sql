/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : filter_operators.sql
* Description   : DDL for the filter_operators table
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
* SW    | 1.1  | 18 Dec 11 | split out profile fields                          *
*******************************************************************************/
USE dev2;

DROP TABLE IF EXISTS filter_operators;

CREATE TABLE filter_operators (
  operator_id    INT           NOT NULL AUTO_INCREMENT COMMENT "filter operator ID",
  operator       VARCHAR(16)   NOT NULL,
  deleted        BOOLEAN       NOT NULL DEFAULT 0      COMMENT "soft delete flag",
  created_by     VARCHAR(64)   NOT NULL                COMMENT "record created by",
  created_date   DATETIME      NOT NULL                COMMENT "record created datestamp",
  modified_by    VARCHAR(64)       NULL                COMMENT "record modified by",
  modified_date  DATETIME          NULL                COMMENT "record modified datestamp",
  PRIMARY KEY (
    operator_id
  )
);

DROP TRIGGER IF EXISTS t_fo_i;
CREATE TRIGGER t_fo_i BEFORE INSERT ON filter_operators
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_fo_u;
CREATE TRIGGER t_fo_u BEFORE UPDATE ON filter_operators
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
