/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventSource = require('eventsource');

var Cylon = require('cylon');

var Spark = module.exports = function Spark(opts) {

  if (opts == null) { opts = {}; }
  var extraParams = opts.extraParams || {};

  this.sparkApi = require('spark');
  this.deviceId = extraParams.deviceId;

  this.sparkApi.on('login', function(err) {
    if (!err) {
      this.sparkApi.getDevice(this.deviceId, function(coreErr, core) {
        if (!coreErr) {
          this.core = core;
        } else {
          console.log('An error ocurred when retrieving core info from Spark Cloud: ', err);
        }
        Spark.__super__.constructor.apply(this, arguments);
      }.bind(this));
    }else{
      console.log('An error ocurred on login to Spark Cloud: ', err);
      Spark.__super__.constructor.apply(this, arguments);
    }
  }.bind(this));

  this.sparkApi.login({ accessToken: extraParams.accessToken });

  this.readInterval = extraParams.readInterval || 2000;

};

Cylon.Utils.subclass(Spark, Cylon.Adaptor);

Spark.prototype.commands = [
  'digitalRead',
  'digitalWrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
  'servoWrite',
  'command',
  'variable',
  'listenForEvents'
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
//            from Spark's API
//
// Triggers provided callback or returns nothing
Spark.prototype.command = function(commandName, args, callback) {
  if (args == null) { args = []; }

  var params = this.params({
    data: { args: args.join(',') }
  });

  console.log('args ->', args);
  console.log('params ->', params);
  //rest.post(uri, params).once('complete', complete);
  this.core.callFunction(commandName, args, callback);
};

// Public: Requests the value of a variable from the Spark Core
//
// variableName - name of the variable to request from the Spark Core
// callback - callback to be triggered with the value from the Spark Core
//
// Triggers provided callback or returns nothing
Spark.prototype.variable = function(varName, callback) {
  // Spark's API truncates variable names Cylon.Utils.after the 12th character.
  // So a variable called 'temperature_sensor' would be accessible via
  // 'temperature_'.
  varName = varName.substring(0, 12);

  this.core.getVariable(varName, callback);
};

// Public: Listens to Server-Sent Events coming from the Spark Core, and
// emits the same events.
//
// events - array of events to add listeners for
//
// Returns nothing.
Spark.prototype.listenForEvents = function(events) {
  events = [].concat(events);

  var base = "https://api.spark.io/v1/devices/" + this.deviceId,
      opts = { headers: { "Authorization": "Bearer " + this.accessToken} },
      es = new EventSource(base + "/events", opts);

  events.forEach(function(eventName) {
    es.addEventListener(eventName, function(event) {
      this.connection.emit(eventName, event.data);
    }.bind(this));
  }.bind(this));
};

Spark.prototype.digitalRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(data) {
    requestInProgress = false;
    if (typeof(data) === 'object' && data.return_value) {
      var value = data.return_value;
      if ('function' === typeof(callback)) { callback(value); }
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    var params = this.params({ data: { params: pin } });
    if (requestInProgress) { return; }

    requestInProgress = true;
    this.sparkApi.callFunction('digitalread', params, complete);
  }.bind(this));
};

Spark.prototype.digitalWrite = function(pin, value) {
  var params = pin + "," + this.pinVal(value);

  this.sparkApi.callFunction('digitalwrite', params);
};

Spark.prototype.analogRead = function(pin, callback) {
  var uri = this.base + "analogread",
      requestInProgress = false,
      value;


  var complete = function(data) {
    requestInProgress = false;

    if (typeof(data) === 'object' && data.return_value) {
      if (data.return_value === value) {
        return;
      }

      value = data.return_value;
      callback(data.return_value);
    }
  };

  Cylon.Utils.every(this.readInterval, function() {
    var params = this.params({ data: { params: pin } });

    if (requestInProgress) {
      return;
    }

    requestInProgress = true;
    rest.post(uri, params).once('complete', complete);
  }.bind(this));
};

Spark.prototype.analogWrite = function(pin, value) {
  var uri = this.base + "analogwrite",
      params = this.params({ data: { params: pin + "," + value } });

  rest.post(uri, params);
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

Spark.prototype.params = function(opts) {
  if (opts == null) { opts = {}; }

  var params = {
    headers: { "Authorization": "Bearer " + this.accessToken }
  };

  for (var opt in opts) { params[opt] = opts[opt]; }

  return params;
};
