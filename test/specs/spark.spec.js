"use strict";

var rest = require('restler');

var adaptor = source("spark");

var sparkApi = require('spark');

describe("Cylon.Adaptors.Spark", function() {
  var spark, mockSparkApi;

  before(function() {
    spark = new adaptor({
      extraParams: { deviceId: "device_id", accessToken: "access_token", }
    });
    mockSparkApi = sinon.mock(sparkApi);

    sinon.sparkApi = mockSparkApi;
  });

  describe("constructor", function() {
    it("sets @deviceId to the value passed in extraParams", function() {
      expect(spark.deviceId).to.be.eql("device_id");
    });

    it("sets @accessToken to the value passed in extraParams", function() {
      expect(spark.accessToken).to.be.eql("access_token");
    });

    it("sets @sparkApi to a new instance of spark lib", function() {
      expect(spark.sparkApi).to.be.eql(mockSparkApi);
    });

    it("sets @readInterval to 2000 by default", function() {
      expect(spark.readInterval).to.be.eql(2000);
    });

  });
/*
  describe("#commands", function() {
    it("returns an array of all Spark commands", function() {
      var commands = spark.commands;
      expect(commands).to.be.an('array');

      for (var i = 0; i < commands.length; i++) {
        expect(commands[i]).to.be.a('string');
      }
    });
  });

  describe("#command", function() {
    beforeEach(function() {
      var mockCore;
      stub(spark.core, 'callFunction').returns(mockCore);
    });

    it("makes a request to the Spark api to trigger a function call", function() {
      spark.command("testFunction");
      expect(spark.core.callFunction).to.be.calledWith('testFunction');
    });

    context("with arguments", function() {
      it("passes the arguments in the request body", function() {
        spark.command("testFunction", ["arg1", "arg2", "arg3"]);
        expect(spark.core.callFunction).to.be.calledWith('testFunction', params.join(','));
      });
    });

    context("with a callback", function() {
      context("if the API returns an error", function() {
        var data = { ok: false, error: "Invalid command" }
        var response = { once: stub().callsArgWith(1, data) }

        before(function() {
          rest.post.returns(response);
        });

        it("triggers the callback with the error message", function() {
          var callback = spy();
          spark.command("testCommand", [], callback);
          expect(callback).to.be.calledWith("Invalid command", null);
        })
      });

      context("if the command ran successfully", function() {
        var data = { return_value: 42 }
        var response = { once: stub().callsArgWith(1, data) }

        before(function() {
          rest.post.returns(response);
        });

        it("triggers the callback with the return value", function() {
          var callback = spy();
          spark.command("testCommand", [], callback);
          expect(callback).to.be.calledWith(null, 42);
        });
      });
    });
  });

  describe("#getVariable", function() {
    it("requests the variable's value from the Spark Core API", function() {
      stub(spark.core, 'getVariable');
      spark.variable("testVariable");
      expect(spark.core.getVariable).to.be.calledWith('testVariable');
    });

    context("when successful", function() {
      var data = { result: 42 };
      var response = { once: stub().callsArgWith(1, data) };

      before(function() {
        stub(rest, 'get').returns(response);
      });

      after(function() {
        rest.get.restore();
      });

      it("triggers the callback with the value", function() {
        var callback = spy();
        spark.variable("testVariable", callback);
        expect(callback).to.be.calledWith(null, 42);
      });
    });

    context("when an error occurs", function() {
      var data = { ok: false, error: "Invalid variable" };
      var response = { once: stub().callsArgWith(1, data) };

      before(function() {
        stub(rest, 'get').returns(response);
      });

      after(function() {
        rest.get.restore();
      });

      it("triggers the callback with the error message", function() {
        var callback = spy();
        spark.variable("testVariable", callback);
        expect(callback).to.be.calledWith("Invalid variable", null);
      });
    });
  });

  describe("#listenForEvents", function() {
    // TODO, could not figure out satisfactory way to stub out EventSource
    // constructor for testing.
  });

  describe("#digitalRead", function() {
    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
      spark.callFunction.restore();
    });

    it("requests the value of a digital pin from the Spark Core API every 2 seconds", function() {
      stub(spark.core, 'callFunction').returns();

      spark.digitalRead('d4', spy());

      clock.tick(2050);
      expect(spark.core.callFunction).to.be.calledWith('digitalread', 'd4');
      expect(spark.core.callFunction).to.be.calledOnce;
    });

    it("calls the callback when it has the value", function() {
      var value = { return_value: 1 };
      var response = { once: stub().callsArgWith(1, value) };
      var callback = spy();

      stub(rest, 'post').returns(response);

      spark.digitalRead('d4', callback);
      clock.tick(2050);
      expect(callback).to.be.calledWith(1);
    });
  });

  describe("#digitalWrite", function() {
    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a digital pin via the Spark Core API", function() {
      stub(spark.sparkApi, 'callFunction');

      spark.digitalWrite(4, 1);
      expect(spark.sparkApi.callFunction).to.be.calledWith('digitalwrite', '4,HIGH');
    });
  });

  describe("#analogRead", function() {
    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      spark.sparkApi.callFunction.restore();
      clock.restore();
    });

    it("requests the value of a analog pin from the Spark Core API every 2 seconds", function() {
      stub(spark.sparkApi, 'callFunction');

      spark.analogRead('a4', spy());
      clock.tick(2050);
      expect(spark.sparkApi.callFunction).to.be.calledWith('digitalread', 'a4');
    });

    it("calls the callback when it has the value", function() {
      var value = { return_value: 1027 };
      var response = { once: stub().callsArgWith(1, value) };
      var callback = spy();

      stub(rest, 'post').returns(response);

      spark.analogRead(4, callback);
      clock.tick(2050);
      expect(callback).to.be.calledWith(1027);
    });
  });

  describe("#analogWrite", function() {
    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(spark.sparkApi, 'callFunction');

      spark.analogWrite('A4', 1);
      expect(spark.sparkApi.callFunction).to.be.calledWith('analogwrite', 'A4,255');
    });
  });

  describe("#pwmWrite", function() {
    afterEach(function() {
      spark.sparkApi.callFunction.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(spark.sparkApi, 'callFunction');

      spark.pwmWrite('A4', 1);
      expect(spark.sparkApi.callFunction).to.be.calledWith('analogWrite', 'A4,255');
    });
  });

  describe("#servoWrite", function() {
    afterEach(function() {
      spark.sparkApi.callFunction.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(spark.sparkApi, 'callFunction');

      spark.servoWrite('A4', 0.5);
      expect(spark.sparkApi.callFunction).to.be.calledWith('pwmwrite', 'S4,90');
    });
  });

  describe("#pinVal", function() {
    context("when the pin value is 1", function() {
      it("returns 'HIGH'", function() {
        expect(spark.pinVal(1)).to.be.eql("HIGH");
      });
    });
    context("when the pin value is 0", function() {
      it("returns 'LOW'", function() {
        expect(spark.pinVal(1)).to.be.eql("HIGH");
      });
    });
  });
 */
});
