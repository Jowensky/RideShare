var orm = require("../config/orm.js");

var address = {
  all: function(cb) {
    orm.all("addresses", function(res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("addresses", cols, vals, function(res) {
      cb(res);
    });
  },
  update: function(objColVals, condition, cb) {
    orm.update("addresses", objColVals, condition, function(res) {
      cb(res);
    });
  }
};

module.exports = address;
