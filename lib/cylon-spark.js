/*
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require("cylon");
require("./spark");

var GPIO = require("cylon-gpio"),
    Commands = require('./cli/commands'),
    fs = require('fs');

module.exports = {
  adaptor: function(args) {
    return new Cylon.Adaptors.Spark(args);
  },

  driver: function(args) {
    return(GPIO.driver.apply(GPIO, args));
  },

  register: function(robot) {
    Logger.debug("Registering Spark adaptor for " + robot.name);
    robot.registerAdaptor('cylon-spark', 'spark');

    GPIO.register(robot);
  },

  registerCommands: function() {
    return {
      spark: {
        description: "Upload apps to the Spark Core",
        command: function(args) {
          var subcommand = args.shift();

          var printUsage = function() {
            console.log("Usage:");
            console.log("  cylon spark upload [access_token] [device_id] [filename] # upload app to Spark Core");
          };

          if (subcommand in Commands) {
            Commands[subcommand](args);
          } else {
            printUsage();
          }
        }
      }
    }
  }
};
