/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');
var sparkApi = require('spark');

var Spark = module.exports = function Spark(opts) {

  if (opts == null) { opts = {}; }
  var extraParams = opts.extraParams || {};

  Spark.__super__.constructor.apply(this, arguments);

  this.deviceId = extraParams.deviceId;
  this.accessToken = extraParams.accessToken;
  this.core = null;
  this.loginInfo = null;
  this.readInterval = extraParams.readInterval || 2000;

};

Cylon.Utils.subclass(Spark, Cylon.Adaptor);

Spark.prototype.connect = function(callback) {
  var loginCallback = function(err, loginInfo) {
    if (!err) {
      this.loginInfo = loginInfo;
      sparkApi.getDevice(this.deviceId, function(coreErr, core) {
        callback(coreErr, core);
        if (!coreErr) {
          this.core = core;
        } else {
          console.log('An error ocurred when retrieving core info from Spark Cloud: ', err);
        }
      }.bind(this));
    }else{
      console.log('An error ocurred on login to Spark Cloud: ', err);
      callback(err, null);
    }
  }.bind(this);

  sparkApi.login({ accessToken: this.accessToken }, loginCallback);
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
  'connect'
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
// commandName - name of the function to call on the Spark
// args - array of arguments to pass to the function call
// callback - optional, callback to be triggered with the response_value
//            from Spark's API, function(err, callback)
//
// Triggers provided callback or returns nothing
Spark.prototype.command = function(commandName, args, callback) {
  this.callFunction(commandName, args, callback);
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
  if (args == null) { args = []; }

  var params = args.join(',');

  this.core.callFunction(functionName, params, callback);
};

// Public: Requests the value of a variable from the Spark Core
//
// variableName - name of the variable to request from the Spark Core
// callback - callback to be triggered with the value from the Spark Core
//
// Triggers provided callback or returns nothing
Spark.prototype.variable = function(varName, callback) {
  this.getVariable(varName, callback);
};

// Public: Requests the value of a variable from the Spark Core
//
// varName - name of the variable to request from the Spark Core
// callback - callback to be triggered with the value from the Spark Core
//
// Triggers provided callback or returns nothing
Spark.prototype.getVariable = function(varName, callback) {
  // Spark's API truncates variable names Cylon.Utils.after the 12th character.
  // So a variable called 'temperature_sensor' would be accessible via
  // 'temperature_'.
  varName = varName.substring(0, 12);

  this.core.getVariable(varName, callback);
};

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
    requestInProgress = false;
    if (typeof(data) === 'object' && data.return_value != null) {
      var value = data.return_value;
      if ('function' === typeof(callback)) {
        callback(err, value);
      }
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      this.core.callFunction('digitalread', pin, complete);
    }
  }.bind(this));
};

Spark.prototype.digitalWrite = function(pin, value) {
  var params = pin + "," + this.pinVal(value);

  this.core.callFunction('digitalwrite', params);
};

Spark.prototype.analogRead = function(pin, callback) {
  var requestInProgress = false,
      value = null;


  var complete = function(err, data) {
    requestInProgress = false;

    if (typeof(data) === 'object' && data.return_value) {
      if (data.return_value === value) {
        return;
      }

      value = data.return_value;
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

Spark.prototype.pwmWrite = function(pin, value) {
  value = (value).toScale(0, 255);
  this.analogWrite(pin, value);
};

Spark.prototype.servoWrite = function(pin, value) {
  value = (value).toScale(0, 180);
  pin = SERVO_PINS[pin];

  this.analogWrite(pin, value);
};

Spark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};
