var Cylon = require('cylon');

Cylon
  .robot()
  .connection('spark', {
    adaptor: 'spark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]'
  })

  .device('led', { driver: 'led', pin: 'D7' })

  .on('ready', function(my) {
    setInterval(function() {
      my.led.toggle();
    }, 1000);
  });

Cylon.start();
