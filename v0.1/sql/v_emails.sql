/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_emails.sql
* Description   : DDL for v_emails view
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

CREATE OR REPLACE VIEW v_emails AS
SELECT e.email_id,
       e.email_name,
       e.email_subject,
       e.email_body,
       e.sender_name,
       e.sender_address,
       e.reply_to,
       e.description,
       e.template_id,
       CASE
       WHEN e.template_id = 0 THEN
         'Ad-hoc'
       ELSE
         'Template'
       END                                                email_type,
       e.created_by,
       DATE_FORMAT(e.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       e.modified_by,
       DATE_FORMAT(e.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   emails       e
WHERE  deleted = FALSE
ORDER BY
       email_id ASC;
