/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_segment_ruless.sql
* Description   : DDL for v_segment_rules view
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

CREATE OR REPLACE VIEW v_segment_rules AS
SELECT segment_id,
       segment_rule_id,
       and_or,
       profile_field,
       operator,
       value
FROM   segment_rules
ORDER BY
       segment_rule_id ASC;
