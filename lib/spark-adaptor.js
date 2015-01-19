/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon"),
    sparkApi = require("spark");

var Logger = Cylon.Logger;

/**
 * A Spark adaptor
 *
 * @constructor spark
 *
 * @param {Object} opts
 * @param {String} opts.deviceId
 * @param {String} opts.accessToken
 * @param {Number=} opts.readInterval
 */
var Spark = module.exports = function Spark(opts) {
  Spark.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.deviceId = opts.deviceId;
  this.accessToken = opts.accessToken;

  if (this.deviceId == null || this.accessToken == null) {
    var err = "No deviceId and/or accessToken provided for Spark adaptor. ";
    err += "Cannot proceed";

    throw new Error(err);
  }

  this.readInterval = opts.readInterval || 2000;

  this.core = null;
  this.loginInfo = null;
};

Cylon.Utils.subclass(Spark, Cylon.Adaptor);

Spark.prototype.connect = function(callback) {
  var loginCallback = function(err, loginInfo) {
    if (!!err) {
      Logger.error("An error occured on login to Spark Cloud: ", err);
      callback(err, null);
      return;
    }

    this.loginInfo = loginInfo;

    sparkApi.getDevice(this.deviceId, function(err, core) {

      if (!!err) {
        Logger.error(
          "An error occured when retrieving core info from Spark Cloud: ",
          err
        );

        this.emit("error", err, core);
        callback(err, null);
        return;
      }

      this.core = core;

      callback(err, core);
    }.bind(this));
  }.bind(this);

  sparkApi.login({ accessToken: this.accessToken }, loginCallback);
};

Spark.prototype.disconnect = function(callback) {
  callback();
};

Spark.prototype.commands = [
  "connect",
  "digitalRead",
  "digitalWrite",
  "analogRead",
  "analogWrite",
  "pwmWrite",
  "servoWrite",
  "command",
  "callFunction",
  "variable",
  "getVariable",
  "onEvent",
  "coreAttrs"
];

var SERVO_PINS = {
  "A0": "S0",
  "A1": "S1",
  "A4": "S4",
  "A5": "S5",
  "A6": "S6",
  "A7": "S7",
  "D0": "S8",
  "D1": "S9"
};

/**
 * Calls a function on the Spark Core
 *
 * @param {String} functionName name of the function to call
 * @param {String[]} args arguments to pass to the function call
 * @param {Function} callback optional callback to be triggered with the
 * response_value from the API
 * @return {null}
 * @publish
 */
Spark.prototype.callFunction = function(functionName, args, callback) {
  args = args || [];

  var params = args.join(",");

  this.core.callFunction(functionName, params, callback);
};

/**
 * Alias to `#callFunction`
 *
 * @see callFunction
 */
Spark.prototype.command = Spark.prototype.callFunction;

/**
 * Requests the value of a variable from the Spark Core.
 *
 * @param {String} varName name of the variable to request
 * @param {Function} callback function to be triggered with the value
 * @return {null}
 * @publish
 */
Spark.prototype.getVariable = function(varName, callback) {
  // Spark's API truncates variable names after the 12th character.
  // So a variable called 'temperature_sensor' would be accessible via
  // 'temperature_'.
  varName = varName.substring(0, 12);

  this.core.getVariable(varName, callback);
};

Spark.prototype.variable = Spark.prototype.getVariable;

/**
 * Adds an event listener to a specified event on the Spark Core.
 *
 * Emits the same event from the adaptor.
 *
 * @param {String} varName name of the event to listen for
 * @param {Function} callback function to be triggered when the event is emitted
 * @return {null}
 * @publish
 */
Spark.prototype.onEvent = function(eventName, callback) {
  this.core.onEvent(eventName, function(err, event) {
    this.emit(eventName, event);
    if ("function" === typeof(callback)) { callback(err, event); }
  }.bind(this));
};

/**
 * Reads a value from a digital pin
 *
 * @param {Number} pin
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {null}
 * @publish
 */
Spark.prototype.digitalRead = function(pin, callback) {
  this._read("digitalread", pin, callback);
};

/**
 * Reads a value from an analog pin
 *
 * @param {Number} pin
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {null}
 * @publish
 */
Spark.prototype.analogRead = function(pin, callback) {
  this._read("analogread", pin, callback);
};

Spark.prototype._read = function(type, pin, callback) {
  var requestInProgress = false;

  var complete = function(err, data) {
    var value = null;
    requestInProgress = false;

    if (!err && (data != null) && (data.return_value != null)) {
      value = data.return_value;
    }
    if ("function" === typeof(callback)) {
      callback(err, value);
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      this.core.callFunction(type, pin, complete);
    }
  }.bind(this));
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @param {Function} callback
 * @return {null}
 * @publish
 */
Spark.prototype.digitalWrite = function(pin, value, callback) {
  var params = pin + "," + this.pinVal(value);

  this.core.callFunction("digitalwrite", params, callback);
};

/**
 * Writes a value to an analog pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @param {Function} callback
 * @return {null}
 * @publish
 */
Spark.prototype.analogWrite = function(pin, value, callback) {
  var params = pin + "," + value;

  this.core.callFunction("analogwrite", params, callback);
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @param {Function} callback
 * @return {null}
 * @publish
 */
Spark.prototype.pwmWrite = function(pin, value, callback) {
  value = (value).toScale(0, 255);
  this.analogWrite(pin, value, callback);
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @param {Function} callback
 * @return {null}
 * @publish
 */
Spark.prototype.servoWrite = function(pin, value, callback) {
  value = (value).toScale(0, 180);
  pin = SERVO_PINS[pin];

  this.analogWrite(pin, value, callback);
};

/**
 * Returns attributes of the Spark Core
 *
 * @return {Object} attributes
 * @publish
 */
Spark.prototype.coreAttrs = function() {
  return this.core.attributes;
};

/**
 * Checks if a value is HIGH or LOW
 *
 * @param {Number} value 1 or 0 value to check
 * @return {String} 'LOW' or 'HIGH'
 * @publish
 */
Spark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};
