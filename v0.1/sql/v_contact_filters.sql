/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_contact_filters.sql
* Description   : DDL for v_contact_filters view
* Author        : Scott Walkinshaw
* Date          : 1st June 2011
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

CREATE OR REPLACE VIEW v_contact_filters AS
SELECT field_id,
       field_label,
       view_column
FROM   profile_fields
WHERE  contact_filter
AND    deleted = FALSE
ORDER BY 
       field_id ASC;
