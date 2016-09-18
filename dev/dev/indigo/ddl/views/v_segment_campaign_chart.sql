USE dev1;
CREATE OR REPLACE VIEW v_segment_campaign_chart AS
SELECT 'Current'             period,
       '9999-12-12'          period_date,
       s.segment_id          segment_id,
       s.segment_name        segment_name,
       COUNT(sc.contact_id)  segment_item_count
FROM   segments       s
INNER JOIN
       segment_items  si
ON     s.segment_id = si.segment_id
INNER JOIN
       segment_contacts sc
ON     sc.segment_id      = si.segment_id
AND    sc.segment_item_id = si.segment_item_id
WHERE  s.segment_type_id  = 2
GROUP BY
       period,
       period_date,
       segment_id,
       segment_name
UNION
SELECT DATE_FORMAT(sch.segment_period, '%b-%Y')  period,
       sch.segment_period                        period_date,
       s.segment_id                              segment_id,
       s.segment_name                            segment_name,
       COUNT(sch.contact_id)                     segment_item_count
FROM   segments       s
INNER JOIN
       segment_items  si
ON     s.segment_id = si.segment_id
INNER JOIN
       segment_campaign_history sch
ON     sch.segment_id      = si.segment_id
AND    sch.segment_item_id = si.segment_item_id
WHERE  s.segment_type_id   = 2
GROUP BY
       period,
       period_date,
       segment_id,
       segment_name
ORDER BY
       2 ASC;
