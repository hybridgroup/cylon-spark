/*
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Spark = require("./spark-adaptor"),
    Driver = require("./spark-driver.js"),
    VoodooSpark = require("./voodoospark-adaptor");

module.exports = {
  adaptors: ["spark", "voodoospark"],
  drivers: ["spark"],
  dependencies: ["cylon-gpio"],

  adaptor: function(args) {
    if (args.adaptor === "spark") {
      return new Spark(args);
    } else if (args.adaptor === "voodoospark") {
      return new VoodooSpark(args);
    }
  },

  driver: function(args) {
    if (args.driver === "spark") {
      return new Driver(args);
    }
  }
};
