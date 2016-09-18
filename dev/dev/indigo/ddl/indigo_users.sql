/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : indigo_users.sql
* Description   : DDL for the indigo_users table
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

DROP TABLE IF EXISTS indigo_users;

CREATE TABLE indigo_users (
  indigo_user_id  INT           NOT NULL AUTO_INCREMENT COMMENT "Unique user ID",
  client_id       INT           NOT NULL                COMMENT "FK to clients",
  first_name      VARCHAR(64)   NOT NULL                COMMENT "First Name",
  last_name       VARCHAR(64)   NOT NULL                COMMENT "Last Name",
  full_name       VARCHAR(128)  NOT NULL                COMMENT "Full name",
  user_role_id    INT	        NOT NULL                COMMENT "User role",
  user_status_id  INT	        NOT NULL                COMMENT "User Status",
  email           VARCHAR(128)      NULL DEFAULT NULL   COMMENT "Email address",
  username        VARCHAR(32)   NOT NULL UNIQUE         COMMENT "Username",
  password        VARCHAR(40)   NOT NULL                COMMENT "SHA1 encrypted password",
  soft_delete     BOOLEAN       NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  event_id        INT           NOT NULL                COMMENT "Event ID",
  created_by      VARCHAR(64)   NOT NULL                COMMENT "Record created by",
  created_date    DATETIME      NOT NULL                COMMENT "Record created datestamp",
  modified_by     VARCHAR(64)       NULL                COMMENT "Record created by",
  modified_date   DATETIME          NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    indigo_user_id,
    soft_delete
  ),
  UNIQUE INDEX idx1 (
    username
  )
);

DROP TRIGGER IF EXISTS t_indigo_users_i;
CREATE TRIGGER t_indigo_users_i BEFORE INSERT ON indigo_users
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW(),
    NEW.full_name    = CONCAT(NEW.first_name, ' ', NEW.last_name);

DROP TRIGGER IF EXISTS t_indigo_users_u;
CREATE TRIGGER t_indigo_users_u BEFORE UPDATE ON indigo_users
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
