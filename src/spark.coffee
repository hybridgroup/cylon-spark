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

namespace "Cylon.Adaptor", ->
  class @Spark extends Cylon.Basestar
    constructor: (opts) ->
      super
      @connection = opts.connection
      @name = opts.name
      @deviceId = opts.extraParams.deviceId
      @accessToken = opts.extraParams.accessToken
      @myself = this

    commands: ->
      ['digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite']

    connect: (callback) ->
      Logger.debug "Connecting to Spark '#{@name}'..."
      restler.get "https://api.spark.io/v1/devices/#{@deviceId}",
                  data: { access_token: @accessToken }
      .on 'complete', ->
        (callback)(null)
        @connection.emit 'connect'

    disconnect: ->
      Logger.debug "Disconnecting from Spark '#{@name}'..."

    digitalRead: (pin, callback) ->
      restler.get "https://api.spark.io/v1/devices/#{@deviceId}/digitalread",
                  data: { access_token: @accessToken, params: pin }
      .on 'complete', (data) ->
        (callback)(data)

    digitalWrite: (pin, value) ->
      restler.post "https://api.spark.io/v1/devices/#{@deviceId}/digitalwrite",
                   data: { access_token: @accessToken, params: "#{pin},#{value}"}

    analogRead: (pin, callback) ->
      restler.get "https://api.spark.io/v1/devices/#{@deviceId}/analogread",
                  data: { access_token: @accessToken, params: pin }
      .on 'complete', (data) ->
        (callback)(data)

    analogWrite: (pin, value) ->
      restler.post "https://api.spark.io/v1/devices/#{@deviceId}/analogwrite",
                   data: { access_token: @accessToken, params: "#{pin},#{value}"}

    pwmWrite: (pin, value) ->
      analogWrite pin, value

    servoWrite: (pin, value) ->
      analogWrite pin, value
