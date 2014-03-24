var rest = require('restler'),
    fs = require('fs');

module.exports = {
  upload: function(args) {
    if (args.length < 3) {
      console.log("Invalid number of arguments.");
      console.log("Necessary arguments:");
      console.log("  - [access_token] # your Spark access token");
      console.log("  - [device_id]    # your Spark Core's device ID");
      console.log("  - [filename]     # filename of app you'd like to upload");
    }

    var access_token = args.shift(),
        device_id = args.shift(),
        filename = args.shift(),
        url = "https://api.spark.io/v1/devices/",
        length;

    fs.exists(filename, function(exists) {
      if (exists) {
        fs.stat(filename, function(err, stats) {
          if (err) {
            console.log("Error occured while trying to get length of file.");
            return;
          }

          length = stats.size;

          rest.put(url + device_id, {
            multipart: true,
            headers: { "Authorization": "Bearer " + access_token },
            data: {
              file: rest.file(filename, null, length, null, 'text/plain')
            }
          }).on('complete', function(data) {
            if (data.error) {
              console.log("Failed! Message from Spark's API:");
              console.log(data.error_description);
            } else if ((data.ok !== undefined) && !data.ok) {
              console.log("Failed! Backtrace from Spark's API:");
              console.log(data.errors);
            } else {
              console.log("Uploaded successfully, your Spark Core should be updating now.");
            }
          });
        });
      } else {
        console.log("Supplied filename does not exist.");
        return;
      }
    });
  }
};
