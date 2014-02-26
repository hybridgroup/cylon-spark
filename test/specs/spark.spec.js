(function() {
  'use strict';
  source('spark');

  describe('Cylon.Adaptors.Spark', function() {
    var spark;
    spark = new Cylon.Adaptors.Spark;
    it("exposes a 'commands' method listing Spark commands", function() {
      var command, _i, _len, _ref, _results;
      expect(spark.commands()).to.be.a('array');
      _ref = spark.commands();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _results.push(expect(command).to.be.a('string'));
      }
      return _results;
    });
    it("exposes a digitalRead method to read from a digital pin", function() {
      return expect(spark.digitalRead).to.be.a('function');
    });
    it("exposes a digitalWrite method to write to a digital pin", function() {
      return expect(spark.digitalWrite).to.be.a('function');
    });
    it("exposes a analogRead method to read from a analog pin", function() {
      return expect(spark.analogRead).to.be.a('function');
    });
    it("exposes a analogWrite method to write to a analog pin", function() {
      return expect(spark.analogWrite).to.be.a('function');
    });
    it("exposes a pwmWrite method to write to a pwm device", function() {
      return expect(spark.pwmWrite).to.be.a('function');
    });
    it("exposes a servoWrite method to write to a servo", function() {
      return expect(spark.servoWrite).to.be.a('function');
    });
    return describe('#pinVal', function() {
      it("returns 'HIGH' if the value is 1", function() {
        return expect(spark.pinVal(1)).to.be.eql("HIGH");
      });
      it("returns 'LOW' if the value is 0", function() {
        return expect(spark.pinVal(0)).to.be.eql("LOW");
      });
      return it("returns 'LOW' for all other values", function() {
        return expect(spark.pinVal("invalid")).to.be.eql("LOW");
      });
    });
  });

}).call(this);
