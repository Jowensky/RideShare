
var orm = require("../config/orm.js");

module.exports = {
    all: function(cb) {
      orm.all("wishes", function(res) {
        cb(res);
      });
    },
    // The variables cols and vals are arrays.
    create: function(cols, vals, cb) {
      orm.create("wishes", cols, vals, function(res) {
        cb(res);
      });
    },
    update: function(objColVals, condition, cb) {
      orm.update("wishes", objColVals, condition, function(res) {
        cb(res);
      });
    }
  };