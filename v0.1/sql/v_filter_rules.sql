/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_filter_ruless.sql
* Description   : DDL for v_filter_rules view
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

CREATE OR REPLACE VIEW v_filter_rules AS
SELECT filter_id,
       filter_rule_id,
       and_or,
       profile_field,
       operator,
       value
FROM   filter_rules
ORDER BY
       filter_rule_id ASC;
