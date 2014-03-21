var Cylon = require('cylon');

Cylon.robot({
  connection: {
    name: 'spark',
    adaptor: 'spark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]'
  },

  device: {
    name: 'led',
    driver: 'led',
    pin: 'D7'
  },

  work: function(my) {
    every(1..second(), function() { my.led.toggle(); });
  }
}).start();
