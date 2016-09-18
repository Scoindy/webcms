DROP USER 'scott'@'localhost';
CREATE USER 'scott'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'scott'@'localhost' WITH GRANT OPTION;
DROP USER 'scott'@'%';
CREATE USER 'scott'@'%' IDENTIFIED BY 'scott';
GRANT ALL PRIVILEGES ON *.* TO 'scott'@'%' WITH GRANT OPTION;

