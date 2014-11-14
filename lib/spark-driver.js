/*
 * Cylonjs Spark connection
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Spark = module.exports = function() {
  Spark.__super__.constructor.apply(this, arguments);

  this.commands = {
    core: this.core,
    digitalRead: this.digitalRead,
    digitalWrite: this.digitalWrite,
    analogRead: this.analogRead,
    analogWrite: this.analogWrite,
    pwmWrite: this.pwmWrite,
    servoWrite: this.servoWrite,
    callFunction: this.callFunction,
    command: this.command,
    getVariable: this.getVariable,
    variable: this.variable,
    onEvent: this.onEvent
  };
};

Cylon.Utils.subclass(Spark, Cylon.Driver);

Spark.prototype.start = function(callback) {
  callback();
};

Spark.prototype.halt = function(callback) {
  callback();
};

Spark.prototype.core = function() {
  return this.connection.coreAttrs();
};

Spark.prototype.digitalRead = function(pin, callback) {
  this.connection.digitalRead(pin, callback);
};

Spark.prototype.digitalWrite = function(pin, val, callback) {
  this.connection.digitalWrite(pin, val, callback);
};

Spark.prototype.analogRead = function(pin, callback) {
  this.connection.analogRead(pin, callback);
};

// @param - val (must be from 0 -255);
Spark.prototype.analogWrite = function(pin, val, callback) {
  this.connection.analogWrite(pin, val, callback);
};

// @param - val (must be from 0 -255);
Spark.prototype.pwmWrite = function(pin, val, callback) {
  this.connection.pwmWrite(pin, val, callback);
};

// @param - val (must be from 0 - 180);
Spark.prototype.servoWrite = function(pin, val, callback) {
  this.connection.servoWrite(pin, val, callback);
};

Spark.prototype.callFunction = function(funcName, args, callback) {
  this.connection.callFunction(funcName, args, callback);
};

Spark.prototype.command = Spark.prototype.callFunction;

Spark.prototype.getVariable = function(varName, callback) {
  this.connection.getVariable(varName, callback);
};

Spark.prototype.variable = Spark.prototype.getVariable;

Spark.prototype.onEvent = function(eventName, callback) {
  this.connection.onEvent(eventName, callback);
};
