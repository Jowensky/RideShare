// Requiring our models and passport as we've configured it
var move_decimal = require("move-decimal-point");
var user = require("../model/user");
var uber = require("../dashboard/uber");
var lyft = require("../dashboard/lyft");
var geocoder = require("../dashboard/geocode");

module.exports = function(app) {

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      res.redirect("/");
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/price", function(req, res) {
    var trip = [];
    var route = [];

    var address1 = req.body.from;
    var address2 = req.body.to;
    geocoder.geocode(address1, function(err, resp) {
      try {
        if (resp[0].city === "") {
          res.send("not found");
        } else {
          trip.push({ lat: resp[0].latitude, long: resp[0].longitude });
        }
      } catch (err) {
      }
      geocoder.geocode(address2, function(err, resp) {
        try {
          if (resp[0].city === "") {
            res.send("not found");
          } else {
            trip.push({ lat: resp[0].latitude, long: resp[0].longitude });
            ubest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
          }
        } catch (err) {
        }
      });
    });
    
    function ubest(slat, slong, elat, elong) {
      uber.estimates.getPriceForRouteAsync(slat, slong, elat, elong)
      .then(async function(response) {
        await route.push(response.prices[0].estimate);
        lfest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
      })
      .error(function(err) {
        res.send(err.body.message);
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
      lyft.getRideEstimates(regularlyft).then(async respo => {
        try {
          await route.push(
            `$${move_decimal(
              respo[0].estimatedCostCentsMin,
              -2
            )}-${move_decimal(respo[0].estimatedCostCentsMax, -2)}`
          );
          res.send(route);
        } catch (err) {
          res.status(500);
        }
      });
    }
  });

  app.post("/address", function(req, res) {
    user.all(function(data) {
      var hbsObject = {
        address: data
      };
      res.json(hbsObject);
    });
  });

  app.post("/api/useraddress", function(req, res) {
    user.create(
      ["Location", "Destination"],
      [req.body.location, req.body.destination],
      function() {
      }
    );
  });

  app.delete("/api/useraddress/:id", function(req, res) {
    var condition = "id = " + req.params.id;

    user.delete(condition, function(result) {
      if (result.affectedRows == 0) {
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
  });
};