"use strict";

var Adaptors = {
  spark: require("./lib/adaptors/spark"),
  voodoospark: require("./lib/adaptors/voodoospark")
};

var Driver = require("./lib/driver.js");

module.exports = {
  adaptors: Object.keys(Adaptors),
  drivers: ["spark"],
  dependencies: ["cylon-gpio"],

  adaptor: function(opts) {
    return new Adaptors[opts.adaptor](opts);
  },

  driver: function(args) {
    return new Driver(args);
  }
};
