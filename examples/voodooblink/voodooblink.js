var Cylon = require('cylon');

Cylon.robot({
  connection: {
    name: 'voodoospark',
    adaptor: 'voodoospark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]',
    module: 'cylon-spark'
  },

  device: {
    name: 'led',
    driver: 'led',
    pin: 'D7'
  },

  work: function(my) {
    every((1).second(), function() {my.led.toggle()});
  }
}).start();
