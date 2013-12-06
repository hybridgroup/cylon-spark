# Cylon.js For Spark

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor for the Spark core device using the built-in Tinker protocol (https://www.spark.io/).

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-spark.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-spark)

## Getting Started
Install the module with: `npm install cylon-spark`

## Examples

### JavaScript:
```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connection: { name: 'spark', adaptor: 'spark', accessToken: 'XYZPDQ123' },
  device: {name: 'led', driver: 'led', pin: 'D0'}

  work: function(my) {
    every((1).second(), function() {my.led.toggle()});
  }
}).start();
```

### CoffeeScript:
```
Cylon = require('cylon')

# Initialize the robot
Cylon.robot
  connection:
    name: 'spark', adaptor: 'spark', accessToken: 'XYZPDQ123'

  device:
    name: 'led', driver: 'led', pin: 'D0'

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
```

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

[![NPM](https://nodei.co/npm/cylon-spark.png?compact=true)](https://nodei.co/npm/cylon-spark/)

Version 0.1.0 - Initial release

## License
Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
