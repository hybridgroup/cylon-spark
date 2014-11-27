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
    led: { driver: 'led', pin: 'D7' }
  },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
