/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : indigo_user_roles.sql
* Description   : DDL for the indigo_user_roless table
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

DROP TABLE IF EXISTS indigo_user_roles;

CREATE TABLE indigo_user_roles (
  user_role_id   INT          NOT NULL AUTO_INCREMENT COMMENT "Unique user type ID",
  user_role      VARCHAR(32)  NOT NULL UNIQUE         COMMENT "User role descsription",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    user_role_id
  )
);

DROP TRIGGER IF EXISTS t_indigo_user_roles_i;
CREATE TRIGGER t_indigo_user_roles_i BEFORE INSERT ON indigo_user_roles
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_indigo_user_roles_u;
CREATE TRIGGER t_indigo_user_roles_u BEFORE UPDATE ON indigo_user_roles
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

INSERT INTO indigo_user_roles (user_role) VALUES ('Administrator');
INSERT INTO indigo_user_roles (user_role) VALUES ('Standard User');
INSERT INTO indigo_user_roles (user_role) VALUES ('Read Only');
