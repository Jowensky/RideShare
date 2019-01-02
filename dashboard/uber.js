var Uber = require("node-uber");
var uber = new Uber({
  client_id: process.env.Uber_ID,
  client_secret: process.env.Uber_Secret,
  server_token: process.env.Uber_Token,
  redirect_uri: `http://localhost:3000/api/callback`,
  name: "RideShare",
  language: "en_US", // optional, defaults to en_US
  sandbox: true, // optional, defaults to false
  proxy: "" // optional, defaults to none
});

module.exports = uber;
