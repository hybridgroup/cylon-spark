# Cylon.js For Particle (nee Spark)

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things (IoT).

This module provides an adaptor for the [Spark Core](https://store.particle.io/?product=spark-core) WiFi microcontroller from [Particle](https://www.particle.io/), the company formerly known as Spark Devices.

It uses the built-in Tinker protocol via the [Spark.js](https://github.com/spark/sparkjs) library thank you! 

As an alternative, you can also use [VoodooSpark](https://github.com/voodootikigod/voodoospark) from [@voodootikigod](https://github.com/voodootikigod). The VoodooSpark implementation uses the [Spark-IO](https://github.com/rwaldron/spark-io) node module from [@rwaldron](https://github.com/rwaldron/). Thank you!

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-spark.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-spark) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-spark/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-spark) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-spark/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-spark)

## How to Install

Install the module with:

    $ npm install cylon cylon-spark

You'll need your `access_token` and `device_id` to push new software to yourSpark, and you can get both of these from Spark's [Build tool](https://spark.io/build).

- **access_token:** In the Build tool, click on the Settings cog in the
  bottom-left corner to find your access token.
- **device_id:** After you have your Spark Core registered to your account
  through the Tinker app, click on the Cores section (just above the Settings
  cog) on the Build tool. Then, click on the arrow next to your core's name to
  get its device ID.

### Installing Firmware On Your Spark Core

You will need to install the appropriate firmware on your Spark Core to use it from Cylon.js.

One option is to use the Tinker software, which has the same API as the "default.cpp" code that is included with the Gort CLI (http://gort.io). This routes all of your calls thru the Spark cloud, with is appropriate for communicating with Spark devices in a remote location.

Another option is to use the VoodooSpark firmware, which has its own binary API. This discovers your device thru the Spark cloud, and then routes all of your calls directly to the Spark Core device. This is appropriate for communicating with Spark devices on the same local subnet as the computer that you wish to control them from.

For more information on how to program your Spark, please see [Spark's examples](http://docs.spark.io/#/examples).

For more information about VoodooSpark, click [here](http://voodoospark.me).

## How to Use

### Spark using Tinker API:
```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connections: {
    spark: { adaptor: 'spark', accessToken: 'XYZPDQ123', deviceId: '123ABC456' }
  },

  devices: {
    led: { driver: 'led', pin: 'D0'}
  },

  work: function(my) {
    every((1).second(), function() {my.led.toggle()});
  }
}).start();
```

### Spark using VoodooSpark API:

```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connections: {
    voodoospark: {
      adaptor: 'voodoospark',
      accessToken: 'XYZPDQ123',
      deviceId: '123ABC456',
      module: 'cylon-spark'
    }
  },

  devices: {
    led: { driver: 'led', pin: 'D0' }
  },

  work: function(my) {
    every((1).second(), function() {my.led.toggle()});
  }
}).start();
```

## How to Connect

The setup process for the Spark core is fully explained by [their docs](http://docs.spark.io/connect/), and requires only an active internet connection with a WiFi access point.

Once your Spark is connected, you can get the `accessToken` and `deviceId` necessary to communicate with it from Cylon.

## Documentation

We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-spark/blob/master/RELEASES.md
](https://github.com/hybridgroup/cylon-spark/blob/master/RELEASES.md
).

## License
Copyright (c) 2013-2015 The Hybrid Group. Licensed under the Apache 2.0 license.
