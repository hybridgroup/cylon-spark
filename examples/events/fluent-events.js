var Cylon = require('cylon');

Cylon
  .robot()

  .connection('spark', {
    adaptor: 'spark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]'
  })

  .device('spark', { driver: 'spark' })

  .on('ready', function(bot) {
    bot.spark.onEvent('testevent', function(data) {
      console.log("Test Event Received. Data:", data);
    });
  });

Cylon.start();
