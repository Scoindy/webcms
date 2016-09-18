/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_campaign_emails.sql
* Description   : DDL for v_campaign_emails
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
* SW    | 1.0  | 07 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_campaign_emails AS
SELECT email_id,
       email_name
FROM   emails
WHERE  deleted = FALSE;
