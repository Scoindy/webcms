/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : indigo_clients.sql
* Description   : DDL for the indigo_clients table
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

DROP TABLE IF EXISTS indigo_clients;

CREATE TABLE indigo_clients (
  client_id      INT          NOT NULL AUTO_INCREMENT COMMENT "Unique client ID",
  name           VARCHAR(64)  NOT NULL                COMMENT "Client Name",
  created_by     VARCHAR(64)  NOT NULL                COMMENT "Record created by",
  created_date   DATETIME     NOT NULL                COMMENT "Record created datestamp",
  modified_by    VARCHAR(64)      NULL                COMMENT "Record created by",
  modified_date  DATETIME         NULL                COMMENT "Record created datestamp",
  PRIMARY KEY (
    client_id
  )
);

DROP TRIGGER IF EXISTS t_indigo_clients_i;
CREATE TRIGGER t_indigo_clients_i BEFORE INSERT ON indigo_clients
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_indigo_clients_u;
CREATE TRIGGER t_indigo_clients_u BEFORE UPDATE ON indigo_clients
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();
