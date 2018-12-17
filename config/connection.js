// Set up MySQL connection.
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.host,
  port: 3306,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database 
});

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
