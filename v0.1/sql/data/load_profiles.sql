USE dev2;

TRUNCATE TABLE contact_profiles;

LOAD DATA INFILE   '/scratch/profiles.csv'
REPLACE INTO TABLE contact_profiles
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
IGNORE 1 lINES (
  first_name,
  last_name,
  title,
  address_1,
  address_2,
  address_3,
  postcode,
  phone_work,
  phone_mobile,
  fax,
  company,
  department,
  datamine_bdm,
  retail_watch_flag
);

update contacts
set email_permission = 1, email_address = 'scott@dev1'
where contact_id > 185;

exit

update contact_profiles cp
inner join
      contacts          c
on    cp.contact_id = c.contact_id
set   cp.first_name = SUBSTRING_INDEX(c.full_name, ' ', 1),
      cp.last_name  = SUBSTRING(c.full_name, INSTR(c.full_name, ' ') + 1);
