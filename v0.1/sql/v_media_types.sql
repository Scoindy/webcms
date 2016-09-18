/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_media_types.sql
* Description   : DDL for v_media_types view
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

CREATE OR REPLACE VIEW v_media_types AS
SELECT m.media_type_id,
       m.media_type
FROM   media_types  m
WHERE  m.deleted = FALSE;



