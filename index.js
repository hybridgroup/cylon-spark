"use strict";

var Adaptors = {
  spark: require("./lib/spark-adaptor"),
  voodoospark: require("./lib/voodoospark-adaptor")
};

var Driver = require("./lib/spark-driver.js");

module.exports = {
  adaptors: ["spark", "voodoospark"],
  drivers: ["spark"],
  dependencies: ["cylon-gpio"],

  adaptor: function(opts) {
    return new Adaptors[opts.adaptor](opts);
  },

  driver: function(args) {
    return new Driver(args);
  }
};
