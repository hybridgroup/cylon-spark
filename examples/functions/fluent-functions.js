var Cylon = require('cylon');

Cylon
  .robot()

  .connection({
    name: 'spark',
    adaptor: 'spark',
    accessToken: '[YOUR_ACCESS_TOKEN]',
    deviceId: '[YOUR_DEVICE_ID]'
  })

  .device({ name: 'spark', driver: 'spark' })

  .on('ready', function(bot) {
    setInterval(function() {
      bot.spark.callFunction("fortyTwo", [], function(err, data) {
        if (err) {
          console.log("An error occured!", err);
        } else {
          console.log("The magic number is:", data);
        }
      });
    }, 5000);
  });

Cylon.start();
