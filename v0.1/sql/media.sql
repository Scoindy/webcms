/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : media.sql
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

DROP TABLE IF EXISTS media;

CREATE TABLE media (
  media_id       INT           NOT NULL            COMMENT "unique ID",
  media_name     VARCHAR(64)       NULL            COMMENT "media name",
  description    VARCHAR(256)      NULL            COMMENT "description",
  media_type_id  INT           NOT NULL            COMMENT "FK to media_types",
  url            VARCHAR(256)   NULL            COMMENT "media URL",
  thumbnail_url  VARCHAR(256)   NULL            COMMENT "thumbnail URL",
  filename       VARCHAR(256)   NULL            COMMENT "Filename",
  mime_type      VARCHAR(64)    NULL            COMMENT "Object mime type",
  size           DECIMAL(8,2)   NULL DEFAULT 0  COMMENT "Object size in KB",
  width          INT            NULL DEFAULT 0  COMMENT "Image width",
  height         INT            NULL DEFAULT 0  COMMENT "Image height",
  deleted        BOOLEAN       NOT NULL DEFAULT 0  COMMENT "soft delete flag",
  created_by     VARCHAR(64)   NOT NULL            COMMENT "record created by",
  created_date   DATETIME      NOT NULL            COMMENT "record created datestamp",
  modified_by    VARCHAR(64)       NULL            COMMENT "record modified by",
  modified_date  DATETIME          NULL            COMMENT "record modified datestamp",
  PRIMARY KEY (
    media_id
  )
);

DROP TRIGGER IF EXISTS t_m_i;
CREATE TRIGGER t_m_i BEFORE INSERT ON media
FOR EACH ROW 
SET NEW.created_by   = USER(),
    NEW.created_date = NOW();

DROP TRIGGER IF EXISTS t_m_u;
CREATE TRIGGER t_m_u BEFORE UPDATE ON media
FOR EACH ROW 
SET NEW.modified_by   = USER(),
    NEW.modified_date = NOW();

