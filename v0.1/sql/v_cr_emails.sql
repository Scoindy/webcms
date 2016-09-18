/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_cr_emails.sql
* Description   : DDL for v_cr_emails
* Author        : Scott Walkinshaw
* Date          : 7th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_cr_emails AS
SELECT ce.campaign_email_id,
       ce.contact_id,
       vc.full_name,
       ce.email_address,
       es.email_status,
       DATE_FORMAT(ce.status_datetime, '%d/%m/%Y %H:%i:%s')  status_datetime
FROM   campaign_emails  ce
INNER JOIN
       email_status     es
ON     ce.email_status_id = es.email_status_id
INNER JOIN
       v_contacts       vc
ON     vc.contact_id = ce.contact_id;

