/*
 * Cylonjs VoodooSpark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var SparkIO = require("spark-io"),
    EventSource = require('eventsource');

var Cylon = require('cylon');

var VoodooSpark = module.exports = function VoodooSpark(opts) {
  if (opts == null) { opts = {}; }
  var extraParams = opts.extraParams || {};

  this.analogWrite = bind(this.analogWrite, this);

  VoodooSpark.__super__.constructor.apply(this, arguments);

  this.deviceId = extraParams.deviceId;
  this.accessToken = extraParams.accessToken;
}

subclass(VoodooSpark, Cylon.Adaptor);

VoodooSpark.prototype.commands = function() {
  return [
    'digitalRead',
    'digitalWrite',
    'analogRead',
    'analogWrite',
    'pwmWrite',
    'servoWrite'
  ];
};

VoodooSpark.prototype.connect = function(callback) {
  this.board = new SparkIO({
    token: this.accessToken,
    deviceId: this.deviceId
  });

  return VoodooSpark.__super__.connect.apply(this, arguments);
};

VoodooSpark.prototype.digitalRead = function(pin, callback) {
  this.board.digitalRead(pin, callback);
};

VoodooSpark.prototype.digitalWrite = function(pin, value) {
  this.board.digitalWrite(pin, value);
};

VoodooSpark.prototype.analogRead = function(pin, callback) {
  this.board.analogRead(pin, callback);
};

VoodooSpark.prototype.analogWrite = function(pin, value) {
  this.board.analogWrite(pin, value);
};

VoodooSpark.prototype.pwmWrite = VoodooSpark.prototype.analogWrite;

VoodooSpark.prototype.servoWrite = VoodooSpark.prototype.analogWrite;

VoodooSpark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};

