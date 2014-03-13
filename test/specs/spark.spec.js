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
  });

  describe("#commands", function() {
    it("returns an array of all Spark commands", function() {
      var commands = spark.commands();
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
          data: { access_token: "access_token", args: "arg1,arg2,arg3" }
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
    var uri = deviceUrl + "digitalread";

    afterEach(function() {
      rest.get.restore();
    });

    it("requests the value of a digital pin from the Spark Core API", function() {
      stub(rest, 'get').returns({ once: spy() });

      var params = { data: { access_token: "access_token", params: 4 } };

      spark.digitalRead(4, spy());
      expect(rest.get).to.be.calledWith(uri, params);
    });

    it("calls the callback when it has the value", function() {
      var response = { once: stub().callsArgWith(1, 0) }
      var callback = spy();

      stub(rest, 'get').returns(response);

      spark.digitalRead(4, callback);
      expect(callback).to.be.calledWith(0);
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
        data: { access_token: "access_token", params: "4,HIGH" }
      };

      spark.digitalWrite(4, 1);
      expect(rest.post).to.be.calledWith(uri, params);
    });
  });
});
