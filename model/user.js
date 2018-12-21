var orm = require("../config/orm.js");

var rideshare = {
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
  delete: function(condition, cb) {
    orm.delete("addresses", condition, function(res) {
      cb(res);
    });
  },
  selectWhere: function (cols, vals, cb) {
    orm.selectWhere("users", cols, vals, function(err, rows){
      cb(err, rows)
    })
  }
};

module.exports = rideshare;