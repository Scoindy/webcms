/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_dashboard.sql
* Description   : DDL for v_dashboard view
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

CREATE OR REPLACE VIEW v_dashboard AS
SELECT GROUP_CONCAT(if(name = 'logo_url',              value, NULL)) AS 'logo_url',
       GROUP_CONCAT(if(name = 'contact_total',         value, NULL)) AS 'contact_total',
       GROUP_CONCAT(if(name = 'contact_subscribed',    value, NULL)) AS 'contact_subscribed',
       GROUP_CONCAT(if(name = 'contact_unsubscribed',  value, NULL)) AS 'contact_unsubscribed',
       GROUP_CONCAT(if(name = 'segment_count',  value, NULL)) AS 'segment_count',
       GROUP_CONCAT(if(name = 'campaign_count', value, NULL)) AS 'campaign_count'
FROM   v_dashboard_pivot;
