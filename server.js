// NPM Package
var express = require("express");
// Creating "express" server
var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// the public folder is the where the stylesheet will be
app.use(express.static("public"));

require("./controllers/userControl")(app);

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`)
});

