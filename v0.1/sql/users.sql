/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : users.sql
* Description   : DDL for the users table
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

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id         INT           NOT NULL AUTO_INCREMENT COMMENT "Unique user ID",
  first_name      VARCHAR(64)   NOT NULL                COMMENT "First Name",
  last_name       VARCHAR(64)   NOT NULL                COMMENT "Last Name",
  user_role_id    INT	        NOT NULL                COMMENT "User role",
  user_status_id  INT	        NOT NULL                COMMENT "User Status",
  email           VARCHAR(128)      NULL DEFAULT NULL   COMMENT "Email address",
  username        VARCHAR(32)   NOT NULL UNIQUE         COMMENT "Username",
  password        VARCHAR(40)   NOT NULL                COMMENT "SHA1 encrypted password",
  deleted         BOOLEAN       NOT NULL DEFAULT 0      COMMENT "Soft delete flag",
  created_by      VARCHAR(64)   NOT NULL                COMMENT "Record created by",
  created_date    DATETIME      NOT NULL                COMMENT "Record created datestamp",
  modified_by     VARCHAR(64)       NULL                COMMENT "Record created by",
  modified_date   DATETIME          NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    user_id,
    deleted
  ),
  UNIQUE INDEX idx1 (
    username
  )
);

DROP TRIGGER IF EXISTS t_u_i;
CREATE TRIGGER t_u_i BEFORE INSERT ON users
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_u_u;
CREATE TRIGGER t_u_u BEFORE UPDATE ON users
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
