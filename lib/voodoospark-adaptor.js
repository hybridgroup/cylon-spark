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
  VoodooSpark.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.analogWrite = this.analogWrite.bind(this);

  this.deviceId = opts.deviceId;
  this.accessToken = opts.accessToken;

  if (this.deviceId == null || this.accessToken == null) {
    throw new Error("No deviceId and/or accessToken provided for Spark adaptor '" + this.name + "'. Cannot proceed");
  }
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
  //callback();
};

VoodooSpark.prototype.digitalRead = function(pin, callback) {
  this._read(this.board.MODES.INPUT, pin, callback);
};

VoodooSpark.prototype.analogRead = function(pin, callback) {
 this._read(this.board.MODES.ANALOG, pin, callback);
};

VoodooSpark.prototype._read = function(type, pin, callback) {
  this.board.pinMode(pin, type);
  this.board.analogRead(pin, function(data) {
    callback(null, data);
  });
};

VoodooSpark.prototype.digitalWrite = function(pin, value) {
  this.board.pinMode(pin, this.board.MODES.OUTPUT);
  this.board.digitalWrite(pin, value);
};

VoodooSpark.prototype.analogWrite = function(pin, value) {
  this._write(this.board.MODES.ANALOG, 255, pin, value);
};

VoodooSpark.prototype.pwmWrite = function(pin, value) {
  this._write(this.board.MODES.PWM, 255, pin, value);
};

VoodooSpark.prototype.servoWrite = function(pin, value) {
 this._write(this.board.MODES.SERVO, 180, pin, value);
};

VoodooSpark.prototype._write = function(type, scale, pin, value) {
  value = (value).toScale(0, scale);
  this.board.pinMode(pin, type);
  this.board.servoWrite(pin, value);
};

VoodooSpark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};

