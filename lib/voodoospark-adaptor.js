/*
 * Cylonjs VoodooSpark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var SparkIO = require("spark-io");

var Cylon = require('cylon');

var VoodooSpark = module.exports = function VoodooSpark(opts) {
  if (opts == null) { opts = {}; }
  var extraParams = opts.extraParams || {};

  this.analogWrite = this.analogWrite.bind(this);

  VoodooSpark.__super__.constructor.apply(this, arguments);

  this.deviceId = extraParams.deviceId;
  this.accessToken = extraParams.accessToken;
};

Cylon.Utils.subclass(VoodooSpark, Cylon.Adaptor);

VoodooSpark.prototype.commands = [
  'digitalRead',
  'digitalWrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
  'servoWrite'
];

VoodooSpark.prototype.connect = function(callback) {
  this.board = new SparkIO({
    token: this.accessToken,
    deviceId: this.deviceId
  });

  this.board.on("ready", function() {
    callback();
  });
};

VoodooSpark.prototype.disconnect = function(callback) {
  callback();
};

VoodooSpark.prototype.digitalRead = function(pin, callback) {
  this.board.pinMode(pin, this.board.MODES.INPUT);
  this.board.digitalRead(pin, callback);
};

VoodooSpark.prototype.digitalWrite = function(pin, value) {
  this.board.pinMode(pin, this.board.MODES.OUTPUT);
  this.board.digitalWrite(pin, value);
};

VoodooSpark.prototype.analogRead = function(pin, callback) {
  this.board.pinMode(pin, this.board.MODES.ANALOG);
  this.board.analogRead(pin, callback);
};

VoodooSpark.prototype.analogWrite = function(pin, value) {
  value = (value).toScale(0, 255);
  this.board.pinMode(pin, this.board.MODES.ANALOG);
  this.board.analogWrite(pin, value);
};

VoodooSpark.prototype.pwmWrite = function(pin, value) {
  value = (value).toScale(0, 255);
  this.board.pinMode(pin, this.board.MODES.PWM);
  this.board.analogWrite(pin, value);
};

VoodooSpark.prototype.servoWrite = function(pin, value) {
  value = (value).toScale(0, 180);
  this.board.pinMode(pin, this.board.MODES.SERVO);
  this.board.servoWrite(pin, value);
};

VoodooSpark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};

