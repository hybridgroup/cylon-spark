'use strict'

source 'spark'

describe 'Cylon.Adaptors.Spark', ->
  spark = new Cylon.Adaptors.Spark

  it "exposes a 'commands' method listing Spark commands", ->
    expect(spark.commands()).to.be.a 'array'
    for command in spark.commands()
      expect(command).to.be.a 'string'

  it "exposes a digitalRead method to read from a digital pin", ->
    expect(spark.digitalRead).to.be.a 'function'

  it "exposes a digitalWrite method to write to a digital pin", ->
    expect(spark.digitalWrite).to.be.a 'function'

  it "exposes a analogRead method to read from a analog pin", ->
    expect(spark.analogRead).to.be.a 'function'

  it "exposes a analogWrite method to write to a analog pin", ->
    expect(spark.analogWrite).to.be.a 'function'

  it "exposes a pwmWrite method to write to a pwm device", ->
    expect(spark.pwmWrite).to.be.a 'function'

  it "exposes a servoWrite method to write to a servo", ->
    expect(spark.servoWrite).to.be.a 'function'

  describe '#pinVal', ->
    it "returns 'HIGH' if the value is 1", ->
      expect(spark.pinVal(1)).to.be.eql "HIGH"

    it "returns 'LOW' if the value is 0", ->
      expect(spark.pinVal(0)).to.be.eql "LOW"

    it "returns 'LOW' for all other values", ->
      expect(spark.pinVal("invalid")).to.be.eql "LOW"
