/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_substitution_fields.sql
* Description   : DDL for v_substitution_fields view
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
* SW    | 1.0  | 01 Jun 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_substitution_fields AS
SELECT field_id,
       field_label,
       substitution_default
FROM   profile_fields
WHERE  substitution_field
AND    deleted = FALSE
ORDER BY 
       field_id ASC;
