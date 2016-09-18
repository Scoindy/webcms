/*******************************************************************************
*                                                                              *
********************************************************************************
* Name          : v_filter_operators.sql
* Description   : DDL for v_filter_operators view
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

CREATE OR REPLACE VIEW v_filter_operators AS
SELECT operator_id,
       operator
FROM   filter_operators
WHERE  deleted = FALSE
ORDER BY
       operator_id ASC;
