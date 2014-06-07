/*
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var rest = require('restler'),
    EventSource = require('eventsource');

var Cylon = require('cylon');

var Spark = module.exports = function Spark(opts) {
  if (opts == null) { opts = {}; }
  var extraParams = opts.extraParams || {};

  this.analogWrite = bind(this.analogWrite, this);

  Spark.__super__.constructor.apply(this, arguments);

  this.deviceId = extraParams.deviceId;
  this.accessToken = extraParams.accessToken;
  this.base = "https://api.spark.io/v1/devices/" + this.deviceId + "/";
}

subclass(Spark, Cylon.Adaptor);

Spark.prototype.commands = function() {
  return [
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

  var uri = this.base + commandName;

  var params = this.params({
    data: { args: args.join(',') }
  });

  var complete = function(data) {
    if (callback) {
      if ((data.ok !== undefined) && !data.ok) {
        return callback(data.error, null)
      } else {
        return callback(null, data.return_value);
      }
    }
  };

  rest.post(uri, params).once('complete', complete);
};

// Public: Requests the value of a variable from the Spark Core
//
// variableName - name of the variable to request from the Spark Core
// callback - callback to be triggered with the value from the Spark Core
//
// Triggers provided callback or returns nothing
Spark.prototype.variable = function(variableName, callback) {
  // Spark's API truncates variable names after the 12th character.
  // So a variable called 'temperature_sensor' would be accessible via
  // 'temperature_'.
  var variableName = variableName.substring(0, 12);

  var uri = this.base + variableName;
  var params = this.params();

  var complete = function(data) {
    if ((data.ok !== undefined) && !data.ok) {
      return callback(data.error, null)
    } else {
      return callback(null, data.result);
    }
  };

  rest.get(uri, params).once('complete', complete);
};

// Public: Listens to Server-Sent Events coming from the Spark Core, and
// emits the same events.
//
// events - array of events to add listeners for
//
// Returns nothing.
Spark.prototype.listenForEvents = function(events) {
  var self = this,
      events = [].concat(events),
      base = "https://api.spark.io/v1/devices/" + this.deviceId,
      opts = { headers: { "Authorization": "Bearer " + this.accessToken} },
      es = new EventSource(base + "/events", opts);

  events.forEach(function(eventName) {
    es.addEventListener(eventName, function(event) {
      self.connection.emit(eventName, event.data);
    });
  });
};

Spark.prototype.digitalRead = function(pin, callback) {
  var self = this,
      uri = this.base + "digitalread",
      requestInProgress = false;

  var complete = function(data) {
    requestInProgress = false;
    callback(data);
  };

  setInterval(function() {
    var params = self.params({ data: { params: pin } });

    if (requestInProgress) {
      return;
    }

    requestInProgress = true;
    rest.post(uri, params).once('complete', complete);
  }, 2000);
};

Spark.prototype.digitalWrite = function(pin, value) {
  var uri = this.base + "digitalwrite";
  var params = this.params({
    data: { params: pin + "," + this.pinVal(value) }
  });

  rest.post(uri, params);
};

Spark.prototype.analogRead = function(pin, callback) {
  var self = this,
      uri = this.base + "analogread",
      requestInProgress = false;

  var complete = function(data) {
    requestInProgress = false;
    callback(data);
  };

  setInterval(function() {
    var params = self.params({ data: { params: pin } });

    if (requestInProgress) {
      return;
    }

    requestInProgress = true;
    rest.post(uri, params).once('complete', complete);
  }, 2000);
};

Spark.prototype.analogWrite = function(pin, value) {
  var uri = this.base + "analogwrite";
  var params = this.params({ data: { params: pin + "," + value } });

  rest.post(uri, params);
};

Spark.prototype.pwmWrite = Spark.prototype.analogWrite;

Spark.prototype.servoWrite = Spark.prototype.analogWrite;

Spark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};

Spark.prototype.params = function(opts) {
  if (opts == null) { opts = {} }

  var params = {
    headers: { "Authorization": "Bearer " + this.accessToken }
  };

  for (var opt in opts) { params[opt] = opts[opt]; }

  return params;
}
