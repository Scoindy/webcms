/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : indigo_config.sql
* Description   : DDL for the indigo_config table
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

DROP TABLE IF EXISTS indigo_config;

CREATE TABLE indigo_config (
  name           VARCHAR(32)  NOT NULL,
  value          VARCHAR(32)  NOT NULL,
  created_by     VARCHAR(64)   NOT NULL            COMMENT "record created by",
  created_date   DATETIME      NOT NULL            COMMENT "record created datestamp",
  modified_by    VARCHAR(64)       NULL            COMMENT "record modified by",
  modified_date  DATETIME          NULL            COMMENT "record modified datestamp",
  PRIMARY KEY (
    name
  )
);

DROP TRIGGER IF EXISTS t_ic_i;
CREATE TRIGGER t_ic_i BEFORE INSERT ON indigo_config
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_ic_u;
CREATE TRIGGER t_ic_u BEFORE UPDATE ON indigo_config
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO indigo_config VALUES (
  'filter_run_id',
  0,
  0,
  0,
  NULL,
  NULL
);

INSERT INTO indigo_config VALUES (
  'segment_run_id',
  0,
  0,
  0,
  NULL,
  NULL
);

INSERT INTO indigo_config VALUES (
  'database',
  'dev2',
  0,
  0,
  NULL,
  NULL
);

INSERT INTO indigo_config VALUES (
  'dashboard_logo',
  'images/datamine_logo.jpg',
  0,
  0,
  NULL,
  NULL
);

TRUNCATE TABLE filter_runs;
TRUNCATE TABLE segment_runs;

