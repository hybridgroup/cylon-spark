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
    my.spark.onEvent('testevent', function(data) {
      console.log("Test Event Received. Data:", data);
    });
  }
}).start();
