/*
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var GPIO,
    __slice = [].slice;

  require("./spark");

  GPIO = require("cylon-gpio");

  module.exports = {
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Adaptor.Spark, args, function(){});
    },
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return GPIO.driver.apply(GPIO, args);
    },
    register: function(robot) {
      Logger.debug("Registering Spark adaptor for " + robot.name);
      robot.registerAdaptor('cylon-spark', 'spark');
      return GPIO.register(robot);
    }
  };

}).call(this);
