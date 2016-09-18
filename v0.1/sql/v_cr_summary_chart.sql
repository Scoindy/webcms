/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_cr_summary_chart.sql
* Description   : DDL for ciew that returns data used to render campaign
*                 summary charts
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

CREATE OR REPLACE VIEW v_cr_summary_chart AS
SELECT campaign_email_id,
       COUNT(*)          total,
       SUM(sent)         sent,
       SUM(accepted)     accepted,
       SUM(bounced)      bounced,
       SUM(rendered)     rendered
FROM   campaign_emails
GROUP BY 
       1;

