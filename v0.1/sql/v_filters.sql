/*******************************************************************************
* Indigo
********************************************************************************
* Name          : v_filters.sql
* Description   : DDL for v_filters view
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

CREATE OR REPLACE VIEW v_filters AS
SELECT f.filter_id,
       f.filter_name,
       f.description,
       f.created_by,
       DATE_FORMAT(f.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       f.modified_by,
       DATE_FORMAT(f.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
FROM   filters       f
WHERE  deleted = FALSE
ORDER BY
       filter_id ASC;
