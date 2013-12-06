/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace, restler,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  restler = require('restler');

  namespace = require('node-namespace');

  namespace("Cylon.Adaptor", function() {
    return this.Spark = (function(_super) {
      __extends(Spark, _super);

      function Spark(opts) {
        this.analogWrite = __bind(this.analogWrite, this);
        Spark.__super__.constructor.apply(this, arguments);
        this.connection = opts.connection;
        this.name = opts.name;
        this.deviceId = opts.extraParams.deviceId;
        this.accessToken = opts.extraParams.accessToken;
        this.myself = this;
      }

      Spark.prototype.commands = function() {
        return ['digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite'];
      };

      Spark.prototype.connect = function(callback) {
        Logger.debug("Connecting to Spark '" + this.name + "'...");
        callback(null);
        return this.connection.emit('connect');
      };

      Spark.prototype.disconnect = function() {
        return Logger.debug("Disconnecting from Spark '" + this.name + "'...");
      };

      Spark.prototype.digitalRead = function(pin, callback) {
        return restler.get("https://api.spark.io/v1/devices/" + this.deviceId + "/digitalread", {
          data: {
            access_token: this.accessToken,
            params: pin
          }.on('complete', function(data) {
            return callback(data);
          })
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
            params: "" + pin + "," + (this.pinVal(value))
          }
        });
      };

      Spark.prototype.pwmWrite = function(pin, value) {
        return analogWrite(pin, value);
      };

      Spark.prototype.servoWrite = function(pin, value) {
        return analogWrite(pin, value);
      };

      Spark.prototype.pinVal = function(value) {
        var v;
        if (value === 1) {
          v = "HIGH";
        } else {
          v = "LOW";
        }
        return v;
      };

      return Spark;

    })(Cylon.Basestar);
  });

}).call(this);
