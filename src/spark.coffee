###
 * Cylonjs Spark adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

restler = require('restler')
namespace = require 'node-namespace'

namespace "Cylon.Adaptors", ->
  class @Spark extends Cylon.Adaptors.Adaptor
    constructor: (opts={}) ->
      super
      extraParams = opts.extraParams or {}
      @deviceId = extraParams.deviceId
      @accessToken = extraParams.accessToken

    commands: ->
      ['digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite']

    digitalRead: (pin, callback) ->
      restler.get "https://api.spark.io/v1/devices/#{@deviceId}/digitalread", data: { access_token: @accessToken, params: pin } .on 'complete', (data) ->
        (callback)(data)

    digitalWrite: (pin, value) ->
      restler.post "https://api.spark.io/v1/devices/#{@deviceId}/digitalwrite", data: { access_token: @accessToken, params: "#{pin},#{this.pinVal(value)}"}

    analogRead: (pin, callback) ->
      restler.get "https://api.spark.io/v1/devices/#{@deviceId}/analogread",
                  data: { access_token: @accessToken, params: pin }
      .on 'complete', (data) ->
        (callback)(data)

    analogWrite: (pin, value) =>
      restler.post "https://api.spark.io/v1/devices/#{@deviceId}/analogwrite",
                   data: { access_token: @accessToken, params: "#{pin},#{value}"}

    pwmWrite: (pin, value) ->
      @analogWrite pin, value

    servoWrite: (pin, value) ->
      @analogWrite pin, value

    pinVal: (value) ->
      if value == 1
        v = "HIGH"
      else
        v = "LOW"
      return v
