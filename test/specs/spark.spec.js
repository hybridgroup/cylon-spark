"use strict";

var rest = require('restler');

var adaptor = source("spark");

describe("Cylon.Adaptors.Spark", function() {
  var spark = new adaptor({
    extraParams: { deviceId: "device_id", accessToken: "access_token", }
  });

  var deviceUrl = "https://api.spark.io/v1/devices/device_id/";

  describe("constructor", function() {
    it("sets @deviceId to the value passed in extraParams", function() {
      expect(spark.deviceId).to.be.eql("device_id");
    });

    it("sets @accessToken to the value passed in extraParams", function() {
      expect(spark.accessToken).to.be.eql("access_token");
    });

    it("sets @readInterval to 2000 by default", function() {
      expect(spark.readInterval).to.be.eql(2000);
    });
  });

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
    var uri = deviceUrl + "testCommand";
    var response = { once: spy() }

    before(function() {
      stub(rest, 'post').returns(response);
    });

    after(function() {
      rest.post.restore();
    });

    it("makes a request to the Spark api to trigger a command", function() {
      spark.command("testCommand");
      expect(rest.post).to.be.calledWith(uri);
    });

    context("with arguments", function() {
      it("passes the arguments in the request body", function() {
        var params = {
          headers: { "Authorization": "Bearer access_token" },
          data: { args: "arg1,arg2,arg3" }
        };

        spark.command("testCommand", ["arg1", "arg2", "arg3"]);
        expect(rest.post).to.be.calledWith(uri, params);
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

  describe("#variable", function() {
    var uri = deviceUrl + "testVariable";

    it("requests the variable's value from the Spark Core API", function() {
      stub(rest, 'get').returns({ once: spy() });
      spark.variable("testVariable");
      expect(rest.get).to.be.calledWith(uri);
      rest.get.restore();
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
    var clock,
        uri = deviceUrl + "digitalread";

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
      rest.post.restore();
    });

    it("requests the value of a digital pin from the Spark Core API every 2 seconds", function() {
      stub(rest, 'post').returns({ once: spy() });

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: 'd4' }
      };

      spark.digitalRead('d4', spy());

      clock.tick(2050);
      expect(rest.post).to.be.calledWith(uri, params);
      expect(rest.post).to.be.calledOnce;
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
    var uri = deviceUrl + "digitalwrite";

    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a digital pin via the Spark Core API", function() {
      stub(rest, 'post')

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: "4,HIGH" }
      };

      spark.digitalWrite(4, 1);
      expect(rest.post).to.be.calledWith(uri, params);
    });
  });

  describe("#analogRead", function() {
    var clock,
        uri = deviceUrl + "analogread";

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      rest.post.restore();
      clock.restore();
    });

    it("requests the value of a analog pin from the Spark Core API every 2 seconds", function() {
      stub(rest, 'post').returns({ once: spy() });

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: 'a4' }
      };

      spark.analogRead('a4', spy());
      clock.tick(2050);
      expect(rest.post).to.be.calledWith(uri, params);
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
    var uri = deviceUrl + "analogwrite";

    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(rest, 'post')

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: "A4,2.93" }
      };

      spark.analogWrite('A4', 2.93);
      expect(rest.post).to.be.calledWith(uri, params);
    });
  });

  describe("#pwmWrite", function() {
    var uri = deviceUrl + "analogwrite";

    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(rest, 'post')

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: "A4,255" }
      };

      spark.pwmWrite('A4', 2.93);
      expect(rest.post).to.be.calledWith(uri, params);
    });
  });

  describe("#servoWrite", function() {
    var uri = deviceUrl + "analogwrite";

    afterEach(function() {
      rest.post.restore();
    });

    it("sets the value of a analog pin via the Spark Core API", function() {
      stub(rest, 'post')

      var params = {
        headers: { "Authorization": "Bearer access_token" },
        data: { params: "S4,90" }
      };

      spark.servoWrite('A4', 0.5);
      expect(rest.post).to.be.calledWith(uri, params);
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
});
