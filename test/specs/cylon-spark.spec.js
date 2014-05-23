"use strict";

var GPIO = require('cylon-gpio');

var Spark = source('spark');
var VoodooSpark = source('voodoospark');

var module = source("cylon-spark");

describe("Cylon.Spark", function() {
  describe("adaptor", function() {
    it("generates a new Spark adaptor with the provided arguments", function() {
      var adaptor = module.adaptor({name: "spark" });
      expect(adaptor).to.be.an.instanceOf(Spark);
    });

    it("generates a new VoodooSpark adaptor with the provided arguments", function() {
      var adaptor = module.adaptor({name: "voodoospark" });
      expect(adaptor).to.be.an.instanceOf(VoodooSpark);
    });    
  });

  describe("driver", function() {
    before(function() {
      stub(GPIO, 'driver').returns({});
    });

    after(function() {
      GPIO.driver.restore();
    });

    it("creates a driver through the GPIO module", function() {
      var params = { name: 'led' };
      module.driver(params);
      expect(GPIO.driver).to.be.calledOnce;
    });
  });

  describe("register", function() {
    var bot = { registerAdaptor: spy() };

    before(function() {
      stub(GPIO, 'register').returns();
      module.register(bot);
    });

    after(function() {
      GPIO.register.restore();
    });

    it("registers the Spark adaptor", function() {
      expect(bot.registerAdaptor).to.be.calledWith("cylon-spark", "spark");
    });

    it("tells GPIO to register itself", function() {
      expect(GPIO.register).to.be.calledWith(bot);
    });
  });
});
