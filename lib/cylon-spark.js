/*
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Spark = require("./adaptor"),
    VoodooSpark = require("./voodoospark");

var Cylon = require("cylon"),
    GPIO = require("cylon-gpio"),
    SparkDr = require("./driver.js");

module.exports = {
  adaptor: function(args) {
    if (args.name === 'spark') {
      return new Spark(args);
    } else if (args.name === 'voodoospark') {
      return new VoodooSpark(args);
    }
  },

  driver: function(args) {
    var driver = GPIO.driver.call(GPIO, args);
    driver = (args.name === 'spark') ? new SparkDr(args) : null;
    return(driver);
  },

  register: function(robot) {
    Cylon.Logger.debug("Registering Spark adaptor for " + robot.name);
    robot.registerAdaptor('cylon-spark', 'spark');
    robot.registerAdaptor('cylon-spark', 'voodoospark');
    robot.registerDriver('cylon-spark', 'spark');

    GPIO.register(robot);
  }
};
