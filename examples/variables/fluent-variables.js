"use strict";

var Cylon = require("cylon");

Cylon
  .robot()

  .connection("spark", {
    adaptor: "spark",
    accessToken: "[YOUR_ACCESS_TOKEN]",
    deviceId: "[YOUR_DEVICE_ID]"
  })

  .device("spark", { driver: "spark" })

  .on("ready", function(bot) {
    setInterval(function() {
      bot.spark.getVariable("randomNumber", function(err, data) {
        if (err) {
          console.log("An error occured!", err);
        } else {
          console.log("The random number is:", data);
        }
      });
    }, 5000);
  });

Cylon.start();
