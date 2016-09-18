/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : filters.sql
* Description   : DDL for the contact table
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

DROP TABLE IF EXISTS filters;

CREATE TABLE filters (
  filter_id         INT           NOT NULL            COMMENT "indigo filter ID",
  filter_name       VARCHAR(32)   NULL                COMMENT "filter name",
  description       VARCHAR(256)  NULL                COMMENT "description",
  query             VARCHAR(1024) NULL                COMMENT "query",
  count_query       VARCHAR(1024) NULL                COMMENT "counto query",
  deleted           BOOLEAN       NOT NULL DEFAULT 0  COMMENT "soft delete flag",
  created_by        VARCHAR(64)   NOT NULL            COMMENT "record created by",
  created_date      DATETIME      NOT NULL            COMMENT "record created datestamp",
  modified_by       VARCHAR(64)       NULL            COMMENT "record modified by",
  modified_date     DATETIME          NULL            COMMENT "record modified datestamp",
  PRIMARY KEY (
    filter_id
  )
/*
  UNIQUE INDEX (
    filter_name,
    deleted
  )
*/
);

DROP TRIGGER IF EXISTS t_f_i;
CREATE TRIGGER t_f_i BEFORE INSERT ON filters
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_f_u;
CREATE TRIGGER t_f_u BEFORE UPDATE ON filters
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
