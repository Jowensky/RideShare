require("dotenv").config();
var user = require("../model/user");
var uber = require("../dashboard/uber");
var lyft = require("../dashboard/lyft");
var geocoder = require("../dashboard/geocode");
var path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  })
  
  app.post("/price", function(req, res) {
    var trip = [];
 
    var address1 = req.body.from;
    var address2 = req.body.to;
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
      var route = [];
      uber.estimates
        .getPriceForRouteAsync(slat, slong, elat, elong) 
        .then(function(response) {
          console.log(response.prices[0].estimate);
          route.push({uber: response.prices[0].estimate})
          res.json(route[0])
        })
        .error(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    }
  
    function lfest(slat, slong, elat, elong) {
      var route = [];
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
      lyft.getRideEstimates(regularlyft).then(resp => {
        console.log(resp[0].estimatedCostCentsMin)
        console.log(resp[0].estimatedCostCentsMax)
        route.push({lyft: `${resp[0].estimatedCostCentsMin}-${resp[0].estimatedCostCentsMax}`})
        res.json(route[0])
      });
    }
  });
  
  app.get("/:user", function(req, res) {
    user.all(function(data) {
      var hbsObject = {
        user: data
      };
      console.log(hbsObject);
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