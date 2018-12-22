// Requiring our models and passport as we've configured it
var passport = require("../config/passport");
var move_decimal = require("move-decimal-point");
var user = require("../model/user");
var uber = require("../dashboard/uber");
var lyft = require("../dashboard/lyft");
var geocoder = require("../dashboard/geocode");

module.exports = function(app) {
  function auth(req, res, next, authMethod) {
    passport.authenticate(authMethod, function(err, user, info) {
      if (err) {
        res.status(500);
        res.json(err);
      }
      if (!user) {
        res.status(401);
      } else {
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          res.status(200);
          res.json("/members");
        });
      }
    })(req, res);
  }

  app.post("/api/login", function(req, res, next) {
    auth(req, res, next, "local-login");
  });

  app.post("/api/signup", function(req, res, next) {
    auth(req, res, next, "local-signup");
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

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
      console.log(resp);
      try {
        if (resp[0].city === "") {
          console.log("not found");
          res.send("not found");
        } else {
          console.log(resp);
          trip.push({ lat: resp[0].latitude, long: resp[0].longitude });
        }
      } catch (err) {
        console.log(err);
      }
      geocoder.geocode(address2, function(err, resp) {
        console.log(resp);
        try {
          if (resp[0].city === "") {
            console.log("not found");
            res.send("not found");
          } else {
            console.log(resp);
            trip.push({ lat: resp[0].latitude, long: resp[0].longitude });
            console.log(trip);
            ubest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
          }
        } catch (err) {
          console.log(err);
        }
      });
    });

    function ubest(slat, slong, elat, elong) {
      uber.estimates.getPriceForRouteAsync(slat, slong, elat, elong)
      .then(async function(response) {
        console.log(response)
        console.log(`Uber: ${response.prices[0].estimate}`);
        await route.push(response.prices[0].estimate);
        lfest(trip[0].lat, trip[0].long, trip[1].lat, trip[1].long);
      })
      .error(function(err) {
        console.log(err.body.message);
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
          console.log(
            `Lyft: $${move_decimal(
              respo[0].estimatedCostCentsMin,
              -2
            )}-${move_decimal(respo[0].estimatedCostCentsMax, -2)}`
          );
          await route.push(
            `$${move_decimal(
              respo[0].estimatedCostCentsMin,
              -2
            )}-${move_decimal(respo[0].estimatedCostCentsMax, -2)}`
          );
          console.log(route);
          res.send(route);
        } catch (err) {
          console.error(err);
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
      console.log(hbsObject);
      res.json(hbsObject);
    });
  });

  app.post("/api/useraddress", function(req, res) {
    user.create(
      ["Location", "Destination"],
      [req.body.location, req.body.destination],
      function(result) {
        console.log(result);
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