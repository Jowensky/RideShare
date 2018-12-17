require("dotenv").config();
var user = require("../model/user");
var uber = require("../dashboard/uber");
var lyft = require("../dashboard/lyft");
var geocoder = require("../dashboard/geocode");
var path = require("path");
var move_decimal = require("move-decimal-point");


// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = function (req, res, next){
  
  if (req.user) {
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/");
}


module.exports = function(app) {


  app.get("/", function(req, res) {
    
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // after login in 
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
  // after log in


  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
};
