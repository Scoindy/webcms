/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_templates.sql
* Description   : DDL for v_templates view
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Jan 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_templates AS
SELECT template_id,
       template_name,
       html,
       created_by,
       DATE_FORMAT(created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       modified_by,
       DATE_FORMAT(modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   templates  t
WHERE  deleted = FALSE;



