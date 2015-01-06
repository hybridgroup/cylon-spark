// jshint expr:true
"use strict";

var Adaptor = source("voodoospark-adaptor");

describe("VoodooSpark", function() {
  var adaptor,
      board = {
        token: "012345", deviceId: "1234",
        on: stub(),
        MODES: {
          INPUT: 0,
          OUTPUT: 1,
          ANALOG: 2,
          PWM: 3,
          SERVO: 4
        }
      };

  beforeEach(function() {
    adaptor = new Adaptor({
      deviceId: "deviceId",
      accessToken: "accessToken",
      readInterval: 1000
    });
  });

  describe("#constructor", function() {
    var e = "No deviceId and/or accessToken provided for VoodooSpark adaptor. ";
    e += "Cannot proceed";

    it("sets @deviceId to the provided value", function() {
      expect(adaptor.deviceId).to.be.eql("deviceId");
    });

    it("sets @accessToken to the provided value", function() {
      expect(adaptor.accessToken).to.be.eql("accessToken");
    });

    context("if no deviceId is specified", function() {
      it("throws an error", function() {
        var fn = function() { return new Adaptor({ accessToken: "" }); };
        expect(fn).to.throw(e);
      });
    });

    context("if no accessToken is specified", function() {
      it("throws an error", function() {
        var fn = function() { return new Adaptor({ deviceId: "" }); };
        expect(fn).to.throw(e);
      });
    });

    context("if no deviceId or accessToken is specified", function() {
      it("throws an error", function() {
        var fn = function() { return new Adaptor({}); };
        expect(fn).to.throw(e);
      });
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      board.on.yields();
      stub(adaptor, "_sparkio").returns(board);

      adaptor.connect(callback);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
    });

    it("sets attr @board to a new SparkIO instance", function() {
      expect(adaptor.board).to.be.eql(board);
    });

    it("triggers the callback once", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#disconnect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      adaptor.disconnect(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#commands", function() {
    it("is an array of Spark commands", function() {
      expect(adaptor.commands).to.be.an("array");

      adaptor.commands.map(function(cmd) {
        expect(cmd).to.be.a("string");
      });
    });
  });

  describe("#digitalRead", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      board.digitalRead = stub();
      board.digitalRead.yields("data");

      adaptor.connect(callback);
      callback.reset();
      adaptor.digitalRead(1, callback);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      board.pinMode.reset();
    });

    it("calls pinMode with mode INPUT", function() {
      expect(board.pinMode).to.be.calledWith(1, board.MODES.INPUT);
    });

    it("calls board.digitalRead with pin number", function() {
      expect(board.digitalRead).to.be.calledWith(1);
    });

    it("expects board.digitalRead to trigger callback once", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#analogRead", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      board.analogRead = stub();
      board.analogRead.yields("data");

      adaptor.connect(callback);
      callback.reset();
      adaptor.analogRead(1, callback);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      board.pinMode.reset();
    });

    it("calls pinMode with mode ANALOG", function() {
      expect(board.pinMode).to.be.calledWith(1, board.MODES.ANALOG);
    });

    it("calls board.analogRead with pin number", function() {
      expect(board.digitalRead).to.be.calledWith(1);
    });

    it("expects board.analogRead to trigger callback once", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#digitalWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      spy(adaptor, "_write");
      board.digitalWrite = stub();

      adaptor.connect(callback);
      callback.reset();
      adaptor.digitalWrite(1, 1);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      adaptor._write.restore();
    });

    it("calls board.pinMode with mode OUTPUT", function() {
      expect(board.pinMode).to.be.calledOnce;
      expect(board.pinMode).to.be.calledWith(1, board.MODES.OUTPUT);
    });

    it("calls board.digitalWrite with pin number", function() {
      expect(board.digitalWrite).to.be.calledOnce;
      expect(board.digitalWrite).to.be.calledWith(1, 1);
    });

    it("calls adaptor._write with ", function() {
      expect(board.digitalWrite).to.be.calledOnce;
      expect(board.digitalWrite).to.be.calledWith(1, 1);
    });
  });

  describe("#analogWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      spy(adaptor, "_write");
      board.analogWrite = stub();

      adaptor.connect(callback);
      callback.reset();
      adaptor.analogWrite(1, 1);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      adaptor._write.restore();
    });

    it("calls adaptor._write", function() {
      expect(adaptor._write).to.be.calledOnce;
      expect(adaptor._write).to.be.calledWith(board.MODES.PWM, 255, 1, 1);
    });

    it("calls board.pinMode with mode PWM", function() {
      expect(board.pinMode).to.be.calledOnce;
      expect(board.pinMode).to.be.calledWith(1, board.MODES.PWM);
    });

    it("calls board.analogWrite with pin number and scaled value", function() {
      expect(board.analogWrite).to.be.calledOnce;
      expect(board.analogWrite).to.be.calledWith(1, 255);
    });
  });

  describe("#servoWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      spy(adaptor, "_write");
      board.servoWrite = stub();

      adaptor.connect(callback);
      callback.reset();
      adaptor.servoWrite(1, 1);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      adaptor._write.restore();
    });

    it("calls adaptor._write with", function() {
      expect(adaptor._write).to.be.calledOnce;
      expect(adaptor._write).to.be.calledWith(board.MODES.SERVO, 180, 1, 1);
    });

    it("calls board.pinMode with mode PWM", function() {
      expect(board.pinMode).to.be.calledOnce;
      expect(board.pinMode).to.be.calledWith(1, board.MODES.SERVO);
    });

    it("calls board.servoWrite with pin number and scaled value", function() {
      expect(board.servoWrite).to.be.calledOnce;
      expect(board.servoWrite).to.be.calledWith(1, 180);
    });
  });

  describe("#pwmWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_sparkio").returns(board);
      board.pinMode = spy();
      spy(adaptor, "_write");
      board.analogWrite = stub();

      adaptor.connect(callback);
      callback.reset();
      adaptor.pwmWrite(1, 1);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      adaptor._write.restore();
    });

    it("calls adaptor._write", function() {
      expect(adaptor._write).to.be.calledOnce;
      expect(adaptor._write).to.be.calledWith(board.MODES.PWM, 255, 1, 1);
    });

    it("calls board.pinMode with mode PWM", function() {
      expect(board.pinMode).to.be.calledOnce;
      expect(board.pinMode).to.be.calledWith(1, board.MODES.PWM);
    });

    it("calls board.analogWrite with pin number and scaled value", function() {
      expect(board.analogWrite).to.be.calledOnce;
      expect(board.analogWrite).to.be.calledWith(1, 255);
    });
  });

  describe("#pinVal", function() {
    beforeEach(function() {
      spy(adaptor, "pinVal");
    });

    it("returns HIGH with value 1", function() {
      adaptor.pinVal(1);
      expect(adaptor.pinVal).to.returned("HIGH");
    });

    it("returns LOW with value 0", function() {
      adaptor.pinVal(0);
      expect(adaptor.pinVal).to.returned("LOW");
    });
  });
});

