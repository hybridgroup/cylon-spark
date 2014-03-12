/**
  * Spark Core source to go along with the 'Variables' example. To upload this
  * to your Spark Core, you can use the Build tool at https://spark.io/build, or
  * the Cylon command included with cylon-spark:
  *
  * $ cylon spark upload [access_token] [device_id] ./path/to/functions.cpp
  */

// need this to use the Spark variable
#include "application.h"

int randomNumber = 4;

void setup()
{
    Spark.variable("randomNumber", &randomNumber, INT);
}
