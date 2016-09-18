USE dev2;

TRUNCATE TABLE filter_operators;

LOAD DATA INFILE   '/scratch/filter_operators.csv'
REPLACE INTO TABLE filter_operators
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
IGNORE 1 lINES (
  operator
)
