/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_dashboard_charts.sql
* Description   : DDL for v_dashboard_charts view
* Author        : Scott Walkinshaw
* Date          : 
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 04 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_dashboard_charts AS
SELECT 'C'                     chart_type,
       CASE
       WHEN email_permission  = 'Y' THEN
         'Subscribed'
       ELSE
         'Unsubscribed'
       END                     status,
       COUNT(*)                count
FROM   contacts
WHERE  NOT deleted
GROUP BY 1,2;

-- could change the js so we populate stores in memory rather than select each time

