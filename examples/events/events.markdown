# Spark Core - Events

In this example, we're going to tell the Spark Core to emit events using the
Spark API's Server-Sent-Events support, and listen for those events. To do this,
we'll need to load some custom firmware onto the Spark. You can do this via
Spark's [Built tool](https://spark.io/build), or using the `cylon spark upload`
command that comes with cylon-spark.

For more info on the `cylon spark upload` command, please see the `cylon-spark`
README: [https://github.com/hybridgroup/cylon-spark#upload]()

Either way, upload [this script][script] to your Spark Core before you get
started.

[script]: https://github.com/hybridgroup/cylon-spark/blob/master/examples/events/events.cpp

To begin, let's load up Cylon:

    var Cylon = require('cylon');

With that done, we can begin to setup our robot:

    Cylon.robot({

Our robot has one connection, which we'll call `spark`. It uses the Spark
adaptor, and has our Spark access token and the device id from our core:

      connections: {
        spark: {
          adaptor: 'spark',
          accessToken: '[YOUR_ACCESS_TOKEN]',
          deviceId: '[YOUR_DEVICE_ID]'
        }
      },

For our robot's work, we're going to tell it to listen for the 'testevent'
event, and print data it receives from the Spark.

      work: function(my) {
        my.spark.listenForEvents(["testevent"]);

        my.spark.on('testevent', function(data) {
          console.log("Test Event Received. Data:", data);
        });
      }

With our connection to the Spark and work defined, all that's left is to tell
the robot to start:

    }).start();
