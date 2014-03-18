# Spark Core - Functions

In this example, we're going to tell the Spark Core to run a function, and tell
us what it returns. To do this, we'll need to load some custom firmware onto the
Spark. You can do this via Spark's [Built tool](https://spark.io/build), or
using the `cylon spark upload` command that comes with cylon-spark.

For more info on the `cylon spark upload` command, please see the `cylon-spark`
README: [https://github.com/hybridgroup/cylon-spark#upload]()

Either way, upload [this script][script] to your Spark Core before you get
started.

[script]: https://github.com/hybridgroup/cylon-spark/blob/master/examples/functions/functions.cpp

To begin, let's load up Cylon:

    Cylon = require 'cylon'

With that done, we can begin to setup our robot:

    Cylon.robot

Our robot has one connection, which we'll call `spark`. It uses the Spark
adaptor, and has our Spark access token and the device id from our core:

      connection:
        name: 'spark'
        adaptor: 'spark'
        accessToken: '[YOUR_ACCESS_TOKEN]'
        deviceId: '[YOUR_DEVICE_ID]'

For our robot's work, we're going to tell it to execute the `fortyTwo` function
on our Spark every five seconds, and print the return value the function returns.

      work: (my) ->
        every 5.seconds(), ->
          my.spark.command 'fortyTwo', [], (err, data) ->
            if err
              console.log "An error occured!", err
            else
              console.log "The magic number is:", data

With our connection to the Spark and work defined, all that's left is to tell
the robot to start:

    .start()
