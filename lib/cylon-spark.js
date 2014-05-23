/*
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Spark = require("./spark"),
    VoodooSpark = require("./voodoospark");

var Cylon = require("cylon"),
    GPIO = require("cylon-gpio"),
    fs = require('fs');

module.exports = {
  adaptor: function(args) {
    if (args.name === 'spark') {
      return new Spark(args);
    } else if (args.name === 'voodoospark') {
      return new VoodooSpark(args);
    }
  },

  driver: function(args) {
    return(GPIO.driver.apply(GPIO, args));
  },

  register: function(robot) {
    Cylon.Logger.debug("Registering Spark adaptor for " + robot.name);
    robot.registerAdaptor('cylon-spark', 'spark');
    robot.registerAdaptor('cylon-spark', 'voodoospark');

    GPIO.register(robot);
  }
};
