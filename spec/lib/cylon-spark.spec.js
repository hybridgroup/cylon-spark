"use strict";

var Adaptor = lib("adaptors/spark"),
    Driver = lib("driver"),
    VoodooSpark = lib("adaptors/voodoospark");

var spark = lib("../");

describe("Cylon.Spark", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(spark.adaptors).to.be.eql(["spark", "voodoospark"]);
    });
  });

  describe("#drivers", function() {
    it("is an array of supplied drivers", function() {
      expect(spark.drivers).to.be.eql(["spark"]);
    });
  });

  describe("#dependencies", function() {
    it("is an array of supplied dependencies", function() {
      expect(spark.dependencies).to.be.eql(["cylon-gpio"]);
    });
  });

  describe("adaptor", function() {
    it("generates a new Spark adaptor", function() {
      var adaptor = spark.adaptor({
        adaptor: "spark",
        deviceId: "",
        accessToken: ""
      });

      expect(adaptor).to.be.an.instanceOf(Adaptor);
    });

    it("generates a new VoodooSpark adaptor", function() {
      var adaptor = spark.adaptor({
        adaptor: "voodoospark",
        deviceId: "",
        accessToken: ""
      });

      expect(adaptor).to.be.an.instanceOf(VoodooSpark);
    });
  });

  describe("driver", function() {
    it("generates a new Spark driver", function() {
      var driver = spark.driver({ driver: "spark", adaptor: {} });
      expect(driver).to.be.an.instanceOf(Driver);
    });
  });
});
