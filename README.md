# Cylon.js For Spark

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor for the Spark core device using the built-in Tinker protocol (https://www.spark.io/).

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-spark.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-spark)

## Getting Started

Install the module with: `npm install cylon-spark`

## Commands

#### Upload

    $ cylon spark upload [access_token] [device_id] new_firmware.cpp

The `cylon spark upload` command can help if you want to upload new source code
to your Spark Core.

For more information on how to program your Spark, please see [Spark's
examples](http://docs.spark.io/#/examples).

You'll need your `access_token` and `device_id` to push new software to your
Spark, and you can get both of these from Spark's [Build
tool](https://spark.io/build).

- **access_token:** In the Build tool, click on the Settings cog in the
  bottom-left corner to find your access token.
- **device_id:** After you have your Spark Core registered to your account
  through the Tinker app, click on the Cores section (just above the Settings
  cog) on the Build tool. Then, click on the arrow next to your core's name to
  get its device ID.

## Examples

### JavaScript:
```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connection: { name: 'spark', adaptor: 'spark', accessToken: 'XYZPDQ123', deviceId: '123ABC456' },
  device: {name: 'led', driver: 'led', pin: 'D0'},

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
    name: 'spark', adaptor: 'spark', accessToken: 'XYZPDQ123', deviceId: '123ABC456'

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

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.6.0 - Release for cylon 0.11.2, Add support for server side events, user defined functions, variables and a firmware upload cli command

Version 0.5.0 - Release for cylon 0.11.0, refactor into pure JavaScript

Version 0.4.0 - Release for cylon 0.10.0

Version 0.3.0 - Release for cylon 0.9.0

Version 0.2.0 - Release for cylon 0.8.0

Version 0.1.0 - Initial release

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
