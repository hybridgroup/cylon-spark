/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon'),
    sparkApi = require('spark');

var Logger = Cylon.Logger;

var Spark = module.exports = function Spark(opts) {
  Spark.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.deviceId = opts.deviceId;
  this.accessToken = opts.accessToken;

  this.readInterval = opts.readInterval || 2000;

  this.core = null;
  this.loginInfo = null;
};

Cylon.Utils.subclass(Spark, Cylon.Adaptor);

Spark.prototype.connect = function(callback) {
  var loginCallback = function(err, loginInfo) {
    if (!!err) {
      Logger.error('An error occured on login to Spark Cloud: ', err);
      callback(err, null);
      return;
    }

    this.loginInfo = loginInfo;

    sparkApi.getDevice(this.deviceId, function(err, core) {

      if (!!err) {
        Logger.error('An error occured when retrieving core info from Spark Cloud: ', err);
        this.connection.emit('error', err, core);
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
  'connect',
  'digitalRead',
  'digitalWrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
  'servoWrite',
  'command',
  'callFunction',
  'variable',
  'getVariable',
  'onEvent',
  'coreAttrs'
];

var SERVO_PINS = {
  'A0': 'S0',
  'A1': 'S1',
  'A4': 'S4',
  'A5': 'S5',
  'A6': 'S6',
  'A7': 'S7',
  'D0': 'S8',
  'D1': 'S9'
};

// Public: Calls a function on the Spark Core
//
// functionName - name of the function to call on the Spark
// args - array of arguments to pass to the function call
// callback - optional, callback to be triggered with the response_value
//            from Spark's API
//
// Triggers provided callback or returns nothing
Spark.prototype.callFunction = function(functionName, args, callback) {
  args = args || [];

  var params = args.join(',');

  this.core.callFunction(functionName, params, callback);
};

Spark.prototype.command = Spark.prototype.callFunction;

// Public: Requests the value of a variable from the Spark Core
//
// varName - name of the variable to request from the Spark Core
// callback - callback to be triggered with the value from the Spark Core
//
// Triggers provided callback or returns nothing
Spark.prototype.getVariable = function(varName, callback) {
  // Spark's API truncates variable names after the 12th character.
  // So a variable called 'temperature_sensor' would be accessible via
  // 'temperature_'.
  varName = varName.substring(0, 12);

  this.core.getVariable(varName, callback);
};

Spark.prototype.variable = Spark.prototype.getVariable;

// Public: Adds an event listener to an specified event
// emits the same event.
//
// eventName - event to add the listener for.
// callback - function to be executed when event triggers.
//
// Returns nothing.
Spark.prototype.onEvent = function(eventName, callback) {
  this.core.onEvent(eventName, function(err, event) {
    this.connection.emit(eventName, event);
    if ('function' === typeof(callback)) { callback(err, event); }
  }.bind(this));
};

Spark.prototype.digitalRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(err, data) {
    var value = null;
    requestInProgress = false;

    if (!err && (data != null) && (data.return_value != null)) {
      value = data.return_value;
    }
    if ('function' === typeof(callback)) {
      callback(err, value);
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      this.core.callFunction('digitalread', pin, complete);
    }
  }.bind(this));
};

Spark.prototype.digitalWrite = function(pin, value, callback) {
  var params = pin + "," + this.pinVal(value);

  this.core.callFunction('digitalwrite', params, callback);
};

Spark.prototype.analogRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(err, data) {
    var value = null;
    requestInProgress = false;

    if (!err && (data != null) && (data.return_value != null)) {
      value = data.return_value;
    }
    if ('function' === typeof(callback)) {
      callback(err, value);
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      this.core.callFunction('analogread', pin, complete);
    }
  }.bind(this));
};

Spark.prototype.analogWrite = function(pin, value, callback) {
  var params = pin + "," + value;

  this.core.callFunction('analogwrite', params, callback);
};

Spark.prototype.pwmWrite = function(pin, value, callback) {
  value = (value).toScale(0, 255);
  this.analogWrite(pin, value, callback);
};

Spark.prototype.servoWrite = function(pin, value, callback) {
  value = (value).toScale(0, 180);
  pin = SERVO_PINS[pin];

  this.analogWrite(pin, value, callback);
};

Spark.prototype.coreAttrs = function() {
  return this.core.attributes;
};

Spark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};
