// jshint expr:true
"use strict";

var Driver = source("spark-driver");

describe("Spark-Driver", function() {
  var driver;

  beforeEach(function() {
    driver = new Driver();
  });

  describe("#commands", function() {
    it("is an object containing AnalogSensor commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.start(callback);
    });

    it("expects to trigger callback once", function(){
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#halt", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(driver, "start").yields();
      driver.halt(callback);
    });

    it("expects to trigger callback once", function(){
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#core", function() {
    it("expects to call connection.coreAttrs once", function(){
      var connection = driver.connection = { coreAttrs: stub() };
      driver.core();
      expect(connection.coreAttrs).to.be.calledOnce;
    });
  });

  describe("#digitalRead", function() {
    var callback, connection;
    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { digitalRead: stub() };
      connection.digitalRead.yields(null, "data");
      driver.digitalRead(1, callback);
    });

    it("expects to call connection.digitalRead with params:", function(){
      expect(connection.digitalRead).to.be.calledOnce;
      expect(connection.digitalRead).to.be.calledWith(1, callback);
    });

    it("expects connection.digitalRead to trigger callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "data");
    });
  });

  describe("#analogRead", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { analogRead: stub() };

      connection.analogRead.yields(null, "data");
      driver.analogRead(1, callback);
    });

    it("expects to call connection.digitalRead with params:", function(){
      expect(connection.analogRead).to.be.calledOnce;
      expect(connection.analogRead).to.be.calledWith(1, callback);
    });

    it("expects connection.digitalRead to trigger callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "data");
    });
  });

  describe("#digitalWrite", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { digitalWrite: stub() };

      connection.digitalWrite.yields(null, "HIGH");
      driver.digitalWrite(1, 1, callback);
    });

    it("expects to call connection.digitalWrite once, with params:", function(){
      expect(connection.digitalWrite).to.be.calledOnce;
      expect(connection.digitalWrite).to.be.calledWith(1, 1);
    });

    it("expects connection.digitalWrite to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "HIGH");
    });
  });

  describe("#analogWrite", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { analogWrite: stub() };

      connection.analogWrite.yields(null, 0.5);
      driver.analogWrite(1, 0.5, callback);
    });

    it("expects to call connection.analogWrite once, with params:", function(){
      expect(connection.analogWrite).to.be.calledOnce;
      expect(connection.analogWrite).to.be.calledWith(1, 0.5, callback);
    });

    it("expects connection.analogWrite to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, 0.5);
    });
  });

  describe("#pwmWrite", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { pwmWrite: stub() };

      connection.pwmWrite.yields(null, 0.5);
      driver.pwmWrite(1, 0.5, callback);
    });

    it("expects to call connection.pwmWrite once, with params:", function(){
      expect(connection.pwmWrite).to.be.calledOnce;
      expect(connection.pwmWrite).to.be.calledWith(1, 0.5, callback);
    });

    it("expects connection.pwmWrite to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, 0.5);
    });
  });

  describe("#servoWrite", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { servoWrite: stub() };

      connection.servoWrite.yields(null, 0.5);
      driver.servoWrite(1, 0.5, callback);
    });

    it("expects to call connection.servoWrite once, with params:", function(){
      expect(connection.servoWrite).to.be.calledOnce;
      expect(connection.servoWrite).to.be.calledWith(1, 0.5, callback);
    });

    it("expects connection.servoWrite to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, 0.5);
    });
  });

  describe("#callFunction", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { callFunction: stub() };

      connection.callFunction.yields(null, 0.5);
      driver.callFunction("funcName", { arg1: 1, arg2: 2 }, callback);
    });

    it("expects to call connection.callFunction once, with params:", function(){
      expect(connection.callFunction).to.be.calledOnce;
      expect(connection.callFunction).to.be.calledWith(
        "funcName",
        { arg1: 1, arg2: 2 },
        callback
      );
    });

    it("expects connection.servoWrite to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, 0.5);
    });
  });

  describe("#getVariable", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { getVariable: stub() };

      connection.getVariable.yields(null, "varName");
      driver.getVariable("varName", callback);
    });

    it("expects to call connection.getVariable once, with params", function(){
      expect(connection.getVariable).to.be.calledOnce;
      expect(connection.getVariable).to.be.calledWith("varName", callback);
    });

    it("expects connection.getVariable to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "varName");
    });
  });

  describe("#variable", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { getVariable: stub() };

      connection.getVariable.yields(null, "varName");
      driver.getVariable("varName", callback);
    });

    it("expects to call connection.getVariable once, with params:", function(){
      expect(connection.getVariable).to.be.calledOnce;
      expect(connection.getVariable).to.be.calledWith("varName", callback);
    });

    it("expects connection.getVariable to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "varName");
    });
  });

  describe("#onEvent", function() {
    var callback, connection;

    beforeEach(function() {
      callback = spy();
      connection = driver.connection = { onEvent: stub() };

      connection.onEvent.yields(null, "eventName");
      driver.onEvent("eventName", callback);
    });

    it("expects to call connection.onEvent once, with params:", function(){
      expect(connection.onEvent).to.be.calledOnce;
      expect(connection.onEvent).to.be.calledWith("eventName", callback);
    });

    it("expects connection.getVariable to trigger the callback", function(){
      expect(callback).to.be.calledOnce;
      expect(callback).to.be.calledWith(null, "eventName");
    });
  });
});
