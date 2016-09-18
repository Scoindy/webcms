/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_active_segments.sql
* Description   : DDL for v_active_segments view
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_active_segments AS
SELECT segment_id,
       segment_name
FROM   v_segments;
