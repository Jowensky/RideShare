// NPM Package
var express = require("express");
var session = require("express-session");
// Creating "express" server
var passport = require("./config/passport");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// the public folder is the where the stylesheet will be
app.use(express.static("public"));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./controllers/apiController")(app);
require("./controllers/routeController")(app);

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`)
});

