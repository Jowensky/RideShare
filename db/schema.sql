CREATE DATABASE rideshare_db;

USE rideshare_db;

CREATE TABLE addresses (
	
     ID INTEGER(11) AUTO_INCREMENT NOT NULL,
     Location VARCHAR(100) NULL,
     Destination VARCHAR(100) NULL,
	PRIMARY KEY (ID)
);

CREATE TABLE users (
	
     ID INTEGER(11) AUTO_INCREMENT NOT NULL,
     username VARCHAR(100) NULL,
     passwords VARCHAR(100) NULL,
	PRIMARY KEY (ID)
);

