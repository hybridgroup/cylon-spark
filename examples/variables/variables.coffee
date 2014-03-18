Cylon = require 'cylon'

Cylon.robot
  connection:
    name: 'spark'
    adaptor: 'spark'
    accessToken: '[YOUR_ACCESS_TOKEN]'
    deviceId: '[YOUR_DEVICE_ID]'

  work: (my) ->
    every 5.seconds(), ->
      my.spark.variable 'randomNumber', (err, data) ->
        if err
          console.log "An error occured!", err
        else
          console.log "The random number is:", data

.start()
