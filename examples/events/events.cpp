/**
  * Spark Core source to go along with the 'Events' example. To upload this
  * to your Spark Core, you can use the Build tool at https://spark.io/build
  */

// need this to use the Spark variable
#include "application.h"

void loop()
{
    // Emit the 'testevent' event privately, with data, and a TTL of 60 seconds
    Spark.publish("testevent", "Additional Data", 60, PRIVATE);
    delay(2000);
}
