USE dev1;
CREATE OR REPLACE VIEW v_segments AS
SELECT s.segment_id,
       s.segment_type_id,
       st.segment_type,
       s.segment_name,
       s.segment_description,
       s.created_date,
       s.modified_date,
       COUNT(sc.contact_id)  members
FROM   segments       s
INNER JOIN
       segment_types  st
ON     s.segment_type_id = st.segment_type_id
AND    s.deleted     = FALSE
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
