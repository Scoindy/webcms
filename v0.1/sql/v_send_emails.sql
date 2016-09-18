/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_send_emails.sql
* Description   : DDL for v_send_emails
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

CREATE OR REPLACE VIEW v_send_emails AS
SELECT campaign_email_id,
       contact_id,
       email_address,
       email_subject,
       email_body,
       sender_name,
       sender_address,
       reply_to
FROM   campaign_emails
WHERE  sent = FALSE;
