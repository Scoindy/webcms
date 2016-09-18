USE dev1;

TRUNCATE TABLE clients;

LOAD DATA INFILE '/scratch/customer.csv'
REPLACE INTO TABLE clients
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
IGNORE 1 lINES (
  organistaion,
  client_id,
  full_name,
  @date_of_birth,
  age,
  address_1,
  address_2,
  address_3,
  postcode,
  phone_home,
  phone_work,
  email
)
SET
date_of_birth=STR_TO_DATE(@date_of_birth, '%d%M%Y');
