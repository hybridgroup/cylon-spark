"use strict";

var Cylon = require('cylon');

var Adaptor = source("spark");

var Spark = require('spark');

describe("Spark", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor({
      extraParams: {
        deviceId: 'deviceId',
        accessToken: 'accessToken',
        readInterval: 1000,
      }
    });
  });

  describe("#constructor", function() {
    it('sets @deviceId to the provided value', function() {
      expect(adaptor.deviceId).to.be.eql('deviceId');
    });

    it('sets @accessToken to the provided value', function() {
      expect(adaptor.accessToken).to.be.eql('accessToken');
    });

    it('sets @readInterval to the provided value', function() {
      expect(adaptor.readInterval).to.be.eql(1000);
    });

    it('sets @readInterval to 2s by default', function() {
      adaptor = new Adaptor();
      expect(adaptor.readInterval).to.be.eql(2000);
    });

    it("sets @core to null by default", function() {
      expect(adaptor.core).to.be.eql(null);
    });

    it("sets @loginInfo to null by default", function() {
      expect(adaptor.loginInfo).to.be.eql(null);
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(Spark, 'login');
      stub(Spark, 'getDevice');

      stub(Cylon.Logger, 'error');
      adaptor.connect(callback);
    });

    afterEach(function() {
      Spark.login.restore();
      Spark.getDevice.restore();
      Cylon.Logger.error.restore();
    });

    it("attempts to log into the Spark API with the access token", function() {
      expect(Spark.login).to.be.calledWith({ accessToken: 'accessToken' });
    });

    describe("if an error occurs while connecting to the API", function() {
      beforeEach(function() {
        Spark.login.yields("loginError");
        adaptor.connect(callback);
      });

      it("triggers the callback with the error", function() {
        expect(callback).to.be.calledWith("loginError");
      });

      it("logs that a login error occured", function() {
        var msg = "An error occured on login to Spark Cloud: ";
        expect(Cylon.Logger.error).to.be.calledWith(msg, "loginError");
      });
    });

    describe("after the API connects", function() {
      beforeEach(function() {
        Spark.login.yields(null, "loginInfo");
        adaptor.connect(callback);
      });

      it("tries to get the device", function() {
        expect(Spark.getDevice).to.be.calledWith("deviceId");
      });

      it("sets @loginInfo to the values returned from Spark", function() {
        expect(adaptor.loginInfo).to.be.eql("loginInfo");
      });

      context("if an error occurs while getting the device", function() {
        beforeEach(function() {
          Spark.getDevice.yields("getDeviceError");
          adaptor.connect(callback);
        });

        it("triggers the callback with the error", function() {
          expect(callback).to.be.calledWith("getDeviceError");
        });

        it("logs that a login error occured", function() {
          var msg = "An error occured when retrieving core info from Spark Cloud: ";
          expect(Cylon.Logger.error).to.be.calledWith(msg, "getDeviceError");
        });
      });

      describe("after getting the device details", function() {
        beforeEach(function() {
          Spark.getDevice.yields(null, "core");
          adaptor.connect(callback);
        });

        it("triggers the callback with the core", function() {
          expect(callback).to.be.calledWith(null, "core");
        });

        it("sets @core to the core", function() {
          expect(adaptor.core).to.be.eql("core");
        });
      });
    });
  });

  describe("#commands", function() {
    it("is an array of Spark commands", function() {
      expect(adaptor.commands).to.be.an('array');

      adaptor.commands.map(function(cmd) {
        expect(cmd).to.be.a('string');
      });
    })
  });

  describe("#callFunction", function() {
    var callFunction;

    beforeEach(function() {
      adaptor.core = { callFunction: spy() };
      callFunction = adaptor.core.callFunction;
    });

    it("triggers the core's #callFunction", function() {
      var callback = function() {};
      adaptor.callFunction("fn", ["1", 3, "testing"], callback);
      expect(callFunction).to.be.calledWith("fn", "1,3,testing", callback)
    });

    context("if no arguments are passed", function() {
      it("defaults to an empty set", function() {
        var callback = function() {};
        adaptor.callFunction("fn", null, callback);
        expect(callFunction).to.be.calledWith("fn", "", callback);
      });
    });
  });

  describe("#command", function() {
    it("is a proxy to callFunction", function() {
      expect(adaptor.command).to.be.eql(adaptor.callFunction);
    })
  });

  describe("#getVariable", function() {
    var getVariable, callback;

    beforeEach(function() {
      adaptor.core = {};
      getVariable = adaptor.core.getVariable = spy();
      callback = spy();
    });

    it("requests the variable name from the Spark API", function() {
      adaptor.getVariable("hi", callback);
      expect(getVariable).to.be.calledWith("hi", callback);
    });

    it("truncates after the 12th char", function() {
      adaptor.getVariable("temperature_sensor", callback);
      expect(getVariable).to.be.calledWith("temperature_", callback);
    })
  });

  describe("#variable", function() {
    it("is an alias to #getVariable", function() {
      expect(adaptor.variable).to.be.eql(adaptor.getVariable);
    });
  });

  describe("#onEvent", function() {
    var onEvent, callback;

    beforeEach(function() {
      adaptor.core = {};
      onEvent = adaptor.core.onEvent = stub();
      callback = spy();
      adaptor.onEvent("hello", callback)
    });

    it("subscribes to an event on the Spark Core", function() {
      expect(onEvent).to.be.calledWith("hello");
    });

    context("when the event is triggered", function() {
      beforeEach(function() {
        onEvent.yields(null, "data");
        adaptor.connection = { emit: spy() };
        adaptor.onEvent("hello", callback);
      });

      it("emits the event data through the connection", function() {
        expect(adaptor.connection.emit).to.be.calledWith("hello", "data");
      });

      it("triggers the callback if it was provided", function() {
        expect(callback).to.be.calledWith(null, "data");
      });
    });
  });

  describe("#digitalRead", function() {
    var callFunction, callback;

    beforeEach(function() {
      adaptor.core = {};
      callFunction = adaptor.core.callFunction = stub();
      callback = spy();

      stub(Cylon.Utils, 'every').yields();
      adaptor.digitalRead("pin", callback);
    });

    afterEach(function() {
      Cylon.Utils.every.restore();
    });

    it("reads on @readInterval", function() {
      expect(Cylon.Utils.every).to.be.calledWith(adaptor.readInterval);
    });

    it("doesn't make new requests if the current one hasn't finished", function() {
      Cylon.Utils.every.yield();
      expect(callFunction).to.be.calledOnce;
    });
  });
});
