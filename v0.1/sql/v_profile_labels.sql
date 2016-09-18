/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_profile_labels.sql
* Description   : DDL for v_profile_labels view
* Author        : Scott Walkinshaw
* Date          : 1st June 2011
* Parameters    : 
* Comments      : used to dynamically label profile fields
*                 - dummy record used to keep array elements in line with
*                   profile field numbering
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 01 Jun 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

CREATE OR REPLACE VIEW v_profile_labels AS
SELECT 0        field_id,
       'dummy'  field_label
UNION ALL 
SELECT field_id,
       field_label
FROM   profile_fields
WHERE  profile_label
AND    deleted = FALSE
ORDER BY 
       field_id ASC;
