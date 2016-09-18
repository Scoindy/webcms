USE dev2;
DELIMITER $$
DROP PROCEDURE IF EXISTS p_test;
CREATE PROCEDURE p_test (
                   INOUT  p_return1  VARCHAR(512),
                   INOUT  p_return2  VARCHAR(16),
                   INOUT  p_return3  VARCHAR(16)
                 )
BEGIN
  SET p_return1 := '1234';
  SET p_return2 := 'xxxx';
  SET p_return3 := 'yyyyyyyyy';
END;
$$
