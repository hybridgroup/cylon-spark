/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon-spark');

var restler = require('restler');
var namespace = require('node-namespace');
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }

namespace("Cylon.Adaptors", function() {
  this.Spark = (function(klass) {
    subclass(Spark, klass);

    function Spark(opts) {
      var extraParams;
      if (opts == null) { opts = {}; }
      this.analogWrite = __bind(this.analogWrite, this);
      Spark.__super__.constructor.apply(this, arguments);
      extraParams = opts.extraParams || {};
      this.deviceId = extraParams.deviceId;
      this.accessToken = extraParams.accessToken;
    }

    Spark.prototype.commands = function() {
      return [
        'digitalRead',
        'digitalWrite',
        'analogRead',
        'analogWrite',
        'pwmWrite',
        'servoWrite',

        'command',
        'variable'
      ];
    };

    // Public: Calls a function on the Spark Core
    //
    // commandName - name of the function to call on the Spark
    // args - array of arguments to pass to the function call
    // callback - optional, callback to be triggered with the response_value
    //            from Spark's API
    //
    // Triggers provided callback or returns nothing
    Spark.prototype.command = function(commandName, args, callback) {
      if (args == null) { args = []; }

      var base = "https://api.spark.io/v1/devices/" + this.deviceId + "/";

      restler.post(base + commandName, {
        data: {
          access_token: this.accessToken,
          args: args.join(",")
        }
      }).on('complete', function(data) {
        if (callback) {
          if ((data.ok !== undefined) && !data.ok) {
            return callback(data.error, null)
          } else {
            return callback(null, data.return_value);
          }
        }
      });
    };

    // Public: Requests the value of a variable from the Spark Core
    //
    // variableName - name of the variable to request from the Spark Core
    // callback - callback to be triggered with the value from the Spark Core
    //
    // Triggers provided callback or returns nothing
    Spark.prototype.variable = function(variableName, callback) {
      var base = "https://api.spark.io/v1/devices/" + this.deviceId + "/";

      // Spark's API truncates variable names after the 12th character.
      // So a variable called 'temperature_sensor' would be accessible via
      // 'temperature_'.
      var variableName = variableName.substring(0, 12);

      restler.get(base + variableName, {
        headers: { "Authorization": "Bearer " + this.accessToken },
      }).on('complete', function(data) {
        if ((data.ok !== undefined) && !data.ok) {
          return callback(data.error, null)
        } else {
          return callback(null, data.result);
        }
      });
    };

    Spark.prototype.digitalRead = function(pin, callback) {
      return restler.get("https://api.spark.io/v1/devices/" + this.deviceId + "/digitalread", {
        data: {
          access_token: this.accessToken,
          params: pin
        }
      }).on('complete', function(data) {
        return callback(data);
      });
    };

    Spark.prototype.digitalWrite = function(pin, value) {
      return restler.post("https://api.spark.io/v1/devices/" + this.deviceId + "/digitalwrite", {
        data: {
          access_token: this.accessToken,
          params: "" + pin + "," + (this.pinVal(value))
        }
      });
    };

    Spark.prototype.analogRead = function(pin, callback) {
      return restler.get("https://api.spark.io/v1/devices/" + this.deviceId + "/analogread", {
        data: {
          access_token: this.accessToken,
          params: pin
        }
      }).on('complete', function(data) {
        return callback(data);
      });
    };

    Spark.prototype.analogWrite = function(pin, value) {
      return restler.post("https://api.spark.io/v1/devices/" + this.deviceId + "/analogwrite", {
        data: {
          access_token: this.accessToken,
          params: "" + pin + "," + value
        }
      });
    };

    Spark.prototype.pwmWrite = function(pin, value) {
      return this.analogWrite(pin, value);
    };

    Spark.prototype.servoWrite = function(pin, value) {
      return this.analogWrite(pin, value);
    };

    Spark.prototype.pinVal = function(value) {
      if (value === 1) {
        return 'HIGH';
      } else {
        return 'LOW';
      }
    };

    return Spark;

  })(Cylon.Adaptor);
});