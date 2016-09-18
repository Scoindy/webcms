/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_dashboard_pivot.sql
* Description   : DDL for v_dashboard_pivot view
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

CREATE OR REPLACE VIEW v_dashboard_pivot AS
SELECT 'logo_url'              name,
       value                   value
FROM   indigo_config
WHERE  name = 'dashboard_logo'
UNION 
SELECT 'contact_total'         name,
       COUNT(*)                value
FROM   contacts
WHERE  NOT deleted
UNION
SELECT 'contact_subscribed'    name,
       COUNT(*)                value
FROM   contacts
WHERE  NOT deleted
AND    email_permission
UNION 
SELECT 'contact_unsubscribed'  name,
       COUNT(*)                value
FROM   contacts
WHERE  NOT deleted
AND    NOT email_permission
UNION 
SELECT 'segment_count'         name, 
       COUNT(*)                value
FROM   segments
WHERE  NOT deleted
UNION 
SELECT 'campaign_count'        name,
       10                      value;
