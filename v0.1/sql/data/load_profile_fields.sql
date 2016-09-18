USE dev2;

TRUNCATE TABLE profile_fields;

LOAD DATA INFILE   '/scratch/profile_fields.csv'
REPLACE INTO TABLE profile_fields
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
IGNORE 1 lINES (
  source_column,
  view_column,
  field_label,
  contact_search,
  contact_filter,
  profile_label
);

UPDATE profile_fields
SET   substitution_field = 1
WHERE  field_id NOT IN (
3,
5,
6,
7,
8,
9);

UPDATE profile_fields
SET    substitution_default = CONCAT('default_', source_column);

update profile_fields set view_column = 'email_permission'
where field_id = 5;
