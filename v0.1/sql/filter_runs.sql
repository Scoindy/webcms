USE dev2;

DROP TABLE IF EXISTS filter_runs;
CREATE TABLE filter_runs 
SELECT *
FROM   v_contacts
WHERE  1 = 2;

ALTER TABLE filter_runs ADD column (filter_run_id INT NOT NULL);

ALTER TABLE filter_runs ADD PRIMARY KEY (filter_run_id, contact_id);
