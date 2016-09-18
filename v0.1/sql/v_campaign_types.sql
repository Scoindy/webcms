/*******************************************************************************
*                                                                              *
********************************************************************************
* Name          : v_campaign_types.sql
* Description   : DDL for v_filter_operators view
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

CREATE OR REPLACE VIEW v_campaign_types AS
SELECT campaign_type_id,
       campaign_type
FROM   campaign_types
WHERE  deleted = FALSE
ORDER BY
       campaign_type_id ASC;
