var cylon = require('cylon');

cylon.robot({
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
  }
})

.on('ready', function(my) {
  setInterval(function() {
    my.led.toggle();
  }, 1000);
})

.start();
