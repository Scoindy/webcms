USE dev1;
CREATE OR REPLACE VIEW v_segment_marketing_chart AS
SELECT 'Current'             period,
       s.segment_id          segment_id,
       s.segment_name        segment_name,
       si.segment_item_id    segment_item_id,
       si.segment_item_name  segment_item_name,
       COUNT(sc.contact_id)  segment_item_count
FROM   segments       s
INNER JOIN
       segment_items  si
ON     s.segment_id = si.segment_id
INNER JOIN
       segment_types  st
ON     s.segment_type_id = st.segment_type_id
INNER JOIN
       segment_contacts sc
ON     sc.segment_id      = si.segment_id
AND    sc.segment_item_id = si.segment_item_id
WHERE  s.segment_type_id  = 1
GROUP BY
       period,
       segment_id,
       segment_name,
       segment_item_id,
       segment_item_name
UNION
SELECT DATE_FORMAT(smh.segment_period, '%b-%Y')  period,
       s.segment_id                              segment_id,
       s.segment_name                            segment_name,
       si.segment_item_id                        segment_item_id,
       si.segment_item_name                      segment_item_name,
       COUNT(smh.contact_id)                     segment_item_count
FROM   segments       s
INNER JOIN
       segment_items  si
ON     s.segment_id = si.segment_id
INNER JOIN
       segment_types  st
ON     s.segment_type_id = st.segment_type_id
INNER JOIN
       segment_marketing_history smh
ON     smh.segment_id      = si.segment_id
AND    smh.segment_item_id = si.segment_item_id
WHERE  s.segment_type_id   = 1
GROUP BY
       period,
       segment_id,
       segment_name,
       segment_item_id,
       segment_item_name;
