/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : indigo_user_status.sql
* Description   : DDL for the indigo_user_status table
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
USE dev1;

DROP TABLE IF EXISTS indigo_user_status;

CREATE TABLE indigo_user_status (
  user_status_id  INT          NOT NULL AUTO_INCREMENT COMMENT "Unique user type ID",
  user_status     VARCHAR(32)  NOT NULL UNIQUE         COMMENT "User status",
  created_by      VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date    DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by     VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date   DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    user_status_id
  )
);

DROP TRIGGER IF EXISTS t_indigo_user_status_i;
CREATE TRIGGER t_indigo_user_status_i BEFORE INSERT ON indigo_user_status
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_indigo_user_status_u;
CREATE TRIGGER t_indigo_user_status_u BEFORE UPDATE ON indigo_user_status
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO indigo_user_status (user_status) VALUES ('Active');
INSERT INTO indigo_user_status (user_status) VALUES ('Inactive');
