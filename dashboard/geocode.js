
var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "mapquest",
  apiKey: process.env.Geocode
};
var geocoder = NodeGeocoder(options);

module.exports = geocoder;