/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_campaign_segments.sql
* Description   : DDL for v_campaign_segments view
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

CREATE OR REPLACE VIEW v_campaign_segments AS
SELECT campaign_id,
       campaign_segment_id,
       segment_id
FROM   campaign_segments;
