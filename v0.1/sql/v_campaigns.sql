/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_filters.sql
* Description   : DDL for v_filters view
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
* SW    | 1.0  | 01 Jun 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_campaigns AS
SELECT c.campaign_id,
       c.campaign_type_id,
       st.campaign_type,
       c.campaign_name,
/*
       CASE 
       WHEN CURDATE() < IFNULL(c.end_date, '2900-01-01') THEN
         'Active' 
       ELSE
         'Expired'
       END                                                campaign_status,
*/
       cs.campaign_status,                               
       c.description,
       DATE_FORMAT(c.start_date, '%d/%m/%Y')              start_date,
       DATE_FORMAT(c.end_date,   '%d/%m/%Y')              end_date,
       IFNULL(c.campaign_email_id, 0)                     campaign_email_id,                     
       c.email_id                                           email_id,
       e.email_name                                         email_name,
       c.created_by,
       DATE_FORMAT(c.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       c.modified_by,
       DATE_FORMAT(c.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   campaigns       c
INNER JOIN
       campaign_types  st
ON     c.campaign_type_id = st.campaign_type_id
INNER JOIN
       campaign_status cs
ON     c.campaign_status_id = cs.campaign_status_id
INNER JOIN
       emails          e
ON     c.email_id = e.email_id
WHERE  c.deleted  = FALSE;
