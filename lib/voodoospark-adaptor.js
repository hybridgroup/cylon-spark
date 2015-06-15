/*
 * Cylonjs VoodooSpark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var SparkIO = require("spark-io");

var Cylon = require("cylon");

/**
 * A VoodooSpark adaptor
 *
 * @constructor VoodooSpark
 *
 * @param {Object} opts options object
 * @param {String} opts.deviceId spark device ID
 * @param {String} opts.accessToken spark access token
 */
var VoodooSpark = module.exports = function VoodooSpark(opts) {
  VoodooSpark.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.analogWrite = this.analogWrite.bind(this);

  this.deviceId = opts.deviceId;
  this.accessToken = opts.accessToken;

  if (this.deviceId == null || this.accessToken == null) {
    var e = "No deviceId and/or accessToken provided for VoodooSpark adaptor. ";
    e += "Cannot proceed";

    throw new Error(e);
  }
};

Cylon.Utils.subclass(VoodooSpark, Cylon.Adaptor);

VoodooSpark.prototype.commands = [
  "digitalRead",
  "digitalWrite",
  "analogRead",
  "analogWrite",
  "pwmWrite",
  "servoWrite"
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

VoodooSpark.prototype._read = function(type, mode, pin, drCallback) {
  var callback = function(data) {
    this.respond(type + "Read", drCallback, null, data, pin);
  }.bind(this);

  this.board.pinMode(pin, mode);

  if (type === "digital") {
    this.board.digitalRead(pin, callback);
  } else if (type === "analog") {
    this.board.analogRead(pin, callback);
  }
};

/**
 * Reads a value from a digital pin
 *
 * @param {Number} pin which pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.digitalRead = function(pin, callback) {
  this._read("digital", this.board.MODES.INPUT, pin, callback);
};

/**
 * Reads a value from an analog pin
 *
 * @param {Number} pin which pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.analogRead = function(pin, callback) {
  this._read("analog", this.board.MODES.ANALOG, pin, callback);
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pin which pin to read from
 * @param {Number} value the value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.digitalWrite = function(pin, value, callback) {
  this.board.pinMode(pin, this.board.MODES.OUTPUT);
  this.board.digitalWrite(pin, value);
  this.respond("digitalWrite", callback, null, pin, value);
};

/**
 * Writes a value to an analog pin
 *
 * @param {Number} pin which pin to read from
 * @param {Number} value the value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.analogWrite = function(pin, value, callback) {
  this._write("analog", this.board.MODES.PWM, 255, pin, value, callback);
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pin which pin to read from
 * @param {Number} value the value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.pwmWrite = function(pin, value, callback) {
  this._write("pwm", this.board.MODES.PWM, 255, pin, value, callback);
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pin which pin to read from
 * @param {Number} value the value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
VoodooSpark.prototype.servoWrite = function(pin, value, callback) {
  this._write("servo", this.board.MODES.SERVO, 180, pin, value, callback);
};

VoodooSpark.prototype._write = function(type, mode, scale, pin, value, cb) {
  value = (value).toScale(0, scale);

  this.board.pinMode(pin, mode);

  switch (mode) {
    case this.board.MODES.SERVO:
      this.board.servoWrite(pin, value);
      break;
    case this.board.MODES.PWM:
      this.board.analogWrite(pin, value);
      break;
  }

  this.respond(mode + "Write", cb, null, pin, value);
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


