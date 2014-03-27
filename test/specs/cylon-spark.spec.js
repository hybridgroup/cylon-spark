"use strict";

var GPIO = require('cylon-gpio');

var module = source("cylon-spark");

describe("Cylon.Spark", function() {
  describe("adaptor", function() {
    it("generates a new Spark adaptor with the provided arguments", function() {
      var adaptor = module.adaptor({name: "New Adaptor" });
      expect(adaptor.name).to.be.eql("New Adaptor");
      expect(adaptor.commands).to.be.a('function');
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
