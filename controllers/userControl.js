require("dotenv").config();
var user = require("../model/user");
var uber = require("../dashboard/uber");
var lyft = require("../dashboard/lyft");
var geocoder = require("../dashboard/geocode");

module.exports = function(app) {
  app.get("/price", function(req, res, next) {
    var trip = [];
  
    var address1 = "2503 Fleming Drive, South Carolina"; /*req.body.from;*/
    var address2 = "1210 Bolt Drive, South Carolina"; /* req.body.to;*/
    geocoder.geocode(address1, function(err, res) {
      console.log("geocode");
      trip.push({ lat: res[0].latitude, long: res[0].longitude });
      geocoder.geocode(address2, function(err, res) {
        trip.push({ lat: res[0].latitude, long: res[0].longitude });
        console.log(trip);
        ubest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
        lfest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
      });
    });
  
    function ubest(slat, slong, elat, elong) {
      uber.estimates
        .getPriceForRouteAsync(slat, slong, elat, elong) 
        .then(function(response) {
          res.json(response);
          console.log(response);
        })
        .error(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  
    function lfest(slat, slong, elat, elong) {
      var regularlyft = {
        start: {
          latitude: slat,
          longitude: slong
        },
        end: {
          latitude: elat,
          longitude: elong
        },
        rideType: "lyft"
      };
      lyft.getRideEstimates(regularlyft).then(response => {
        console.log(response);
      });
    }
  });
  
  app.get("/:user", function(req, res) {
    user.all(function(data) {
      var hbsObject = {
        user: data
      };
      console.log(hbsObject);
      // res.render("login", hbsObject);
    });
  });

  app.post("/api/useraddress", function(req, res) {
    user.create(["wish"], [req.body.address], function(result) {
      // Send back the ID of the new quote
      res.json({ id: result.insertId });
    });
  });

  app.put("/api/useraddress/:id", function(req, res) {
    var condition = "id = " + req.params.id;

    console.log("condition", condition);

    user.update(
      {
        address: req.body.address
      },
      condition,
      function(result) {
        if (result.changedRows === 0) {
          // If no rows were changed, then the ID must not exist, so 404
          return res.status(404).end();
        }
        res.status(200).end();
      }
    );
  });
};
