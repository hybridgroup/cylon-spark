# Spark Core - Functions

In this example, we're going to tell the Spark Core to run a function, and tell
us what it returns. To do this, we'll need to load some custom firmware onto the
Spark. You can do this via Spark's [Built tool](https://spark.io/build), or
using the `cylon spark upload` command that comes with cylon-spark.

For more info on the `cylon spark upload` command, please see the `cylon-spark`
README: [https://github.com/hybridgroup/cylon-spark#upload]()

Either way, upload [this script][script] to your Spark Core before you get
started.

To begin, let's load up Cylon:

    Cylon = require 'cylon'

With that done, we can begin to setup our robot:

    Cylon.robot

Our robot has one connection, which we'll call `spark`. It uses the Spark
adaptor, and has our Spark access token and the device id from our core:
