var Cylon = require('cylon');

Cylon.robot({
  connection: {
    name: 'spark',
    adaptor: 'spark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]'
  },

  device: { name: 'spark', driver: 'spark' },

  work: function(my) {
    my.spark.onEvent('testevent', function(data) {
      console.log("Test Event Received. Data:", data);
    });
  }
}).start();
