"use strict";

var Cylon = require('cylon');

var Adaptor = source("voodoospark-adaptor");

var SparkIO = require('spark-io');

describe("VoodooSpark", function() {
  var adaptor,
      board = {
        token: '012345', deviceId: '1234',
        on: stub(),
        MODES: {
          INPUT: 1
        },
        pinMode: spy(),
        digitalRead: stub()
      };

  beforeEach(function() {
    adaptor = new Adaptor({
      deviceId: 'deviceId',
      accessToken: 'accessToken',
      readInterval: 1000
    });
  });

  describe('#constructor', function() {
    var error = "No deviceId and/or accessToken provided for VoodooSpark adaptor. Cannot proceed";

    it('sets @deviceId to the provided value', function() {
      expect(adaptor.deviceId).to.be.eql('deviceId');
    });

    it('sets @accessToken to the provided value', function() {
      expect(adaptor.accessToken).to.be.eql('accessToken');
    });

    context("if no deviceId is specified", function() {
      it("throws an error", function() {
        var fn = function() { new Adaptor({ accessToken: '' }); };
        expect(fn).to.throw(error);
      });
    });

    context("if no accessToken is specified", function() {
      it("throws an error", function() {
        var fn = function() { new Adaptor({ deviceId: '' }); };
        expect(fn).to.throw(error);
      });
    });

    context("if no deviceId or accessToken is specified", function() {
      it("throws an error", function() {
        var fn = function() { new Adaptor({}); };
        expect(fn).to.throw(error);
      });
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      board.on.yields();
      stub(adaptor, '_sparkio').returns(board);

      adaptor.connect(callback);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      board.digitalRead = null;
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
      expect(adaptor.commands).to.be.an('array');

      adaptor.commands.map(function(cmd) {
        expect(cmd).to.be.a('string');
      });
    })
  });

  describe("#digitalRead", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, '_sparkio').returns(board);
      board.digitalRead = stub();
      board.digitalRead.yields('data');

      adaptor.connect(callback);
      adaptor.digitalRead(1, callback);
    });

    afterEach(function() {
      adaptor._sparkio.restore();
      board.digitalRead = null;
    });

    it("calls board.digitalRead with mode INPUT", function() {
      expect(board.pinMode).to.be.calledWith(1, 1);
      expect(board.digitalRead).to.be.calledOnce;
      expect(callback).to.be.calledTwice;
    });
  });
});
