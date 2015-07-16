"use strict";

var Cylon = require("cylon");

/**
 * A Spark driver
 *
 * @constructor spark
 */
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

/**
 * Returns attributes of the Spark Core
 *
 * @return {Object} attributes
 * @publish
 */
Spark.prototype.core = function() {
  return this.connection.coreAttrs();
};

/**
 * Reads a value from a digital pin
 *
 * @param {Number} pin pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
Spark.prototype.digitalRead = function(pin, callback) {
  this.connection.digitalRead(pin, callback);
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pin pin to write to
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Spark.prototype.digitalWrite = function(pin, value, callback) {
  this.connection.digitalWrite(pin, value, callback);
};

/**
 * Reads a value from an analog pin
 *
 * @param {Number} pin pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
Spark.prototype.analogRead = function(pin, callback) {
  this.connection.analogRead(pin, callback);
};

/**
 * Writes a value to an analog pin
 *
 * @param {Number} pin pin to write to
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Spark.prototype.analogWrite = function(pin, value, callback) {
  this.connection.analogWrite(pin, value, callback);
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pin pin to write to
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Spark.prototype.pwmWrite = function(pin, value, callback) {
  this.connection.pwmWrite(pin, value, callback);
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pin pin to write to
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Spark.prototype.servoWrite = function(pin, value, callback) {
  this.connection.servoWrite(pin, value, callback);
};

/**
 * Calls a function on the Spark Core
 *
 * @param {String} funcName name of the function to call
 * @param {String[]} args arguments to pass to the function call
 * @param {Function} callback optional callback to be triggered with the
 * response_value from the API
 * @return {void}
 * @publish
 */
Spark.prototype.callFunction = function(funcName, args, callback) {
  this.connection.callFunction(funcName, args, callback);
};

/**
 * Alias to `#callFunction`
 *
 * @see callFunction
 */
Spark.prototype.command = Spark.prototype.callFunction;

/**
 * Requests the value of a variable from the Spark Core.
 *
 * @param {String} varName name of the variable to request
 * @param {Function} callback function to be triggered with the value
 * @return {void}
 * @publish
 */
Spark.prototype.getVariable = function(varName, callback) {
  this.connection.getVariable(varName, callback);
};

/**
 * Alias to `#getVariable`
 *
 * @see getVariable
 */
Spark.prototype.variable = Spark.prototype.getVariable;

/**
 * Adds an event listener to a specified event on the Spark Core.
 *
 * Emits the same event from the adaptor.
 *
 * @param {String} eventName name of the event to listen for
 * @param {Function} callback function to be triggered when the event is emitted
 * @return {void}
 * @publish
 */
Spark.prototype.onEvent = function(eventName, callback) {
  this.connection.onEvent(eventName, callback);
};
