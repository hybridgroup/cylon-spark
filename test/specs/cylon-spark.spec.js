"use strict";

var Adaptor = source('spark-adaptor'),
    Driver = source('spark-driver'),
    VoodooSpark = source('voodoospark-adaptor');

var module = source("cylon-spark");

describe("Cylon.Spark", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(['spark', 'voodoospark']);
    });
  });

  describe("#drivers", function() {
    it('is an array of supplied drivers', function() {
      expect(module.drivers).to.be.eql(['spark']);
    });
  });

  describe("#dependencies", function() {
    it('is an array of supplied dependencies', function() {
      expect(module.dependencies).to.be.eql(['cylon-gpio']);
    });
  });

  describe("adaptor", function() {
    it("generates a new Spark adaptor with the provided arguments", function() {
      var adaptor = module.adaptor({adaptor: "spark" });
      expect(adaptor).to.be.an.instanceOf(Adaptor);
    });

    it("generates a new VoodooSpark adaptor with the provided arguments", function() {
      var adaptor = module.adaptor({adaptor: "voodoospark" });
      expect(adaptor).to.be.an.instanceOf(VoodooSpark);
    });
  });

  describe("driver", function() {
    it("generates a new Spark driver with the provided arguments", function() {
      var driver = module.driver({driver: "spark", device: { connection: {} }});
      expect(driver).to.be.an.instanceOf(Driver);
    });
  });
});
