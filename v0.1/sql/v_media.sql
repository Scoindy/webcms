/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_media.sql
* Description   : DDL for v_media view
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_media AS
SELECT m.media_id,
       m.media_name,
       m.description,
       m.media_type_id,
       mt.media_type,
       m.url,
       CONCAT('http://indigo.com/', m.url) full_url,
       m.thumbnail_url,
       m.filename,
       m.mime_type,
       m.size,
       m.width,
       m.height,
       m.created_by,
       DATE_FORMAT(m.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       m.modified_by,
       DATE_FORMAT(m.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   media        m
INNER JOIN
       media_types  mt
ON     m.media_type_id = mt.media_type_id
WHERE  m.deleted       = FALSE;



