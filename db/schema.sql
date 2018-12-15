
CREATE DATABASE address_db;

USE address_db;

CREATE TABLE addresses (
	
     ID INTEGER(11) AUTO_INCREMENT NOT NULL,
     Location VARCHAR(100) NULL,
     Destination VARCHAR(100) NULL,
	PRIMARY KEY (ID)
);
