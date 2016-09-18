USE dev2;

DROP TABLE IF EXISTS segment_runs;
CREATE TABLE segment_runs 
SELECT *
FROM   v_contacts
WHERE  1 = 2;

ALTER TABLE segment_runs ADD column (segment_run_id INT NOT NULL);

ALTER TABLE segment_runs ADD PRIMARY KEY (segment_run_id, contact_id);
