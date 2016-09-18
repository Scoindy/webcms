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

CREATE OR REPLACE VIEW v_segments AS
SELECT s.segment_id,
       s.segment_type_id,
       st.segment_type,
       s.segment_name,
       s.description,
       s.created_by,
       DATE_FORMAT(s.created_date,  '%d/%m/%Y %H:%i:%s')  created_date,
       s.modified_by,
       DATE_FORMAT(s.modified_date, '%d/%m/%Y %H:%i:%s')  modified_date
--       COUNT(sc.contact_id)  members
FROM   segments       s
INNER JOIN
       segment_types  st
ON     s.segment_type_id = st.segment_type_id
WHERE  s.deleted         = FALSE;

/*
INNER JOIN
       segment_contacts  sc
ON     s.segment_id = sc.segment_id
GROUP BY
       1,
       2,
       3,
       4,
       5,
       6,
       7;
*/
