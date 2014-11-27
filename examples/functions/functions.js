var Cylon = require('cylon');

Cylon.robot({
  connections: {
    spark: {
      adaptor: 'spark',
      accessToken: '[YOUR_ACCESS_TOKEN]',
      deviceId: '[YOUR_DEVICE_ID]'
    }
  },

  devices: {
    spark: { driver: 'spark' }
  },

  work: function(my) {
    every((5).seconds(), function() {
      my.spark.callFunction("fortyTwo", [], function(err, data) {
        if (err) {
          console.log("An error occured!", err);
        } else {
          console.log("The magic number is:", data);
        }
      });
    });
  }
}).start();
