var Cylon = require('cylon');

Cylon.robot({
  connections: {
    voodoospark: {
      adaptor: 'voodoospark',
      accessToken: '[YOUR_ACCESS_TOKEN]',
      deviceId: '[YOUR_DEVICE_ID]',
      module: 'cylon-spark'
    }
  },

  devices: {
    led: { driver: 'led', pin: 'D7' }
  },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
