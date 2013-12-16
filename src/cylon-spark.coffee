###
 * cylon-spark
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require "cylon"
require "./spark"
GPIO = require "cylon-gpio"

module.exports =
  adaptor: (args...) ->
    new Cylon.Adaptors.Spark(args...)

  driver: (args...) ->
    GPIO.driver(args...)

  register: (robot) ->
    Logger.debug "Registering Spark adaptor for #{robot.name}"
    robot.registerAdaptor 'cylon-spark', 'spark'

    GPIO.register robot
