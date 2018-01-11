//  Load dependencies
var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");

//  Set global variables
var countKey = "count";

var Log = function(message, logs) {
  console.log(message);

  if (typeof logs === "undefined") {
    logs = [];
  }

  logs.push(message);
};

var getRedisClient = function(logs, onErrorCallback) {
  //  Load dependencies
  var redis = require("redis");

  var port = process.env.REDIS_PORT || 6379;
  var host = process.env.REDIS_HOST || "localhost";

  Log("Attempting to connect to Redis", logs);
  Log("Redis connection configure to " + host + ":" + port, logs);

  //  Create and configure client
  var client = redis.createClient(port, host);

  client.on("connected", function() {
    Log("Connected to Redis", logs);
  });

  client.on("ready", function() {
    Log("Client is ready", logs);
  });

  client.on("end", function() {
    Log("Client has been closed", logs);
  });

  client.on("error", onErrorCallback);

  return client;
};

var createResponse = function(
  response,
  logs,
  ok,
  count,
  responseHasBeenSet,
  cleanUpResources
) {
  Log("Response has been set: " + responseHasBeenSet, logs);
  var created = false;

  if (!responseHasBeenSet) {
    Log("Cleaning up resources", logs);

    cleanUpResources();

    //  Send response
    Log("Creating response", logs);
    response.render("home", {
      logs: logs,
      ok: ok,
      count: count
    });

    created = true;
  }

  return responseHasBeenSet || created;
};

//  Process request
var processRequest = function(request, response) {
  var responseHasBeenSet = false;
  var logs = [];

  Log("----------", logs);
  Log("Processing request", logs);

  var client = getRedisClient(logs, function(err) {
    Log(err, logs);

    responseHasBeenSet = createResponse(
      response,
      logs,
      false,
      -1,
      responseHasBeenSet,
      function() {
        //  Close client
        client.quit();
      }
    );
  });

  client.get(countKey, function(err, reply) {
    if (err) {
      Log("Read Error: " + err, logs);

      responseHasBeenSet = createResponse(
        response,
        logs,
        false,
        -1,
        responseHasBeenSet,
        function() {
          //  Close client
          client.quit();
        }
      );
    } else {
      Log("Read Reply: " + reply, logs);

      var count = 0;
      if (reply) {
        count = parseInt(reply);
      }

      count++;

      client.set(countKey, count.toString(), function(err2, reply2) {
        responseHasBeenSet = createResponse(
          response,
          logs,
          true,
          count,
          responseHasBeenSet,
          function() {
            //  Close client
            client.quit();
          }
        );
      });
    }
  });
};

var app = express();

var viewsDir = "views/";
var layoutsDir = path.join(viewsDir, "layouts/");
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: layoutsDir
  })
);

app.set("view engine", ".hbs");
app.set("views", viewsDir);

//  Routing
app.get("/", processRequest);

//  Error handling
app.use((err, request, response, next) => {
  Log(err, []);
  response.status(500).send("Something broke!");
});

app.listen(process.env.PORT || 3000);
