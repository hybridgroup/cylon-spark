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
    throw new Error("No deviceId and/or accessToken provided for VoodooSpark adaptor. Cannot proceed");
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
  this.board = this._sparkio();

  this.board.on("ready", function() {
    callback();
  });
};

VoodooSpark.prototype.disconnect = function(callback) {
  callback();
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
VoodooSpark.prototype.digitalRead = function(pin, callback) {
  this.board.pinMode(pin, this.board.MODES.INPUT);
  this.board.digitalRead(pin, function(data) {
    callback(null, data);
  });
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
VoodooSpark.prototype.analogRead = function(pin, callback) {
  this.board.pinMode(pin, this.board.MODES.ANALOG);
  this.board.analogRead(pin, function(data) {
    callback(null, data);
  });
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @return {null}
 * @publish
 */
VoodooSpark.prototype.digitalWrite = function(pin, value) {
  this.board.pinMode(pin, this.board.MODES.OUTPUT);
  this.board.digitalWrite(pin, value);
};

/**
 * Writes a value to an analog pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @return {null}
 * @publish
 */
VoodooSpark.prototype.analogWrite = function(pin, value) {
  this._write(this.board.MODES.PWM, 255, pin, value);
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @return {null}
 * @publish
 */
VoodooSpark.prototype.pwmWrite = function(pin, value) {
  this._write(this.board.MODES.PWM, 255, pin, value);
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pin
 * @param {Number} value
 * @return {null}
 * @publish
 */
VoodooSpark.prototype.servoWrite = function(pin, value) {
 this._write(this.board.MODES.SERVO, 180, pin, value);
};

VoodooSpark.prototype._write = function(type, scale, pin, value) {
  value = (value).toScale(0, scale);
  this.board.pinMode(pin, type);

  switch(type){
    case this.board.MODES.SERVO:
      this.board.servoWrite(pin, value);
      break;
    case this.board.MODES.PWM:
      this.board.analogWrite(pin, value);
      break;
  }
};

/**
 * Checks if a value is HIGH or LOW
 *
 * @param {Number} value 1 or 0 value to check
 * @return {String} 'LOW' or 'HIGH'
 * @publish
 */
VoodooSpark.prototype.pinVal = function(value) {
  return (value === 1) ? "HIGH" : "LOW";
};

VoodooSpark.prototype._sparkio = function() {
  return new SparkIO({
    token: this.accessToken,
    deviceId: this.deviceId
  });
};


