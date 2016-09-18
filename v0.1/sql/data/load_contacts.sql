USE dev2;

TRUNCATE TABLE contacts;

LOAD DATA INFILE   '/scratch/contacts_new.csv'
REPLACE INTO TABLE contacts
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
IGNORE 1 lINES (
  client_id,
--  full_name,
  email_address,
  email_permission
);

UPDATE contacts
SET    email_address = 'scott@dev1',
       email_permission = 'Y'
WHERE  contact_id > 185;
