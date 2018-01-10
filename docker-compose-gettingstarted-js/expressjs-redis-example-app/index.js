//  Load dependencies
var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");

//  Set global variables
var countKey = "count";

var GetRedisClient = function(onErrorCallback) {
  //  Load dependencies
  var redis = require("redis");

  var port = process.env.REDIS_PORT || 6379;
  var host = process.env.REDIS_HOST || "localhost";

  console.log("Attempting to connect to Redis");
  console.log("Redis connection configure to " + host + ":" + port);

  //  Create and configure client
  var client = redis.createClient(port, host);

  client.on("connected", function() {
    console.log("Connected to Redis");
  });

  client.on("ready", function() {
    console.log("Client is ready to Redis");
  });

  client.on("end", function() {
    console.log("Client has been closed");
  });

  client.on("error", onErrorCallback);

  return client;
};

//  Process request
var processRequest = function(request, response) {
  console.log("----------");
  console.log("Processing request");

  var client = GetRedisClient(function(err) {
    //  Close client
    client.quit();

    //  Send response
    response.render("home", {
      readError: "",
      readReply: "",
      writeError: "",
      writeReply: "",
      connectionError: err,
      connected: false,
      updated: false,
      count: 0
    });
  });

  client.get(countKey, function(err, reply) {
    readError = err;
    readReply = reply;

    if (!readError) {
      var count = 0;
      if (reply) {
        count = parseInt(reply);
      }

      count++;

      client.set(countKey, count.toString(), function(err2, reply2) {
        writeError = err2;
        writeReply = reply2;

        //  Close client
        client.quit();

        //  Send response
        response.render("home", {
          readError: err,
          readReply: reply,
          writeError: err2,
          writeReply: reply2,
          connectionError: "",
          connected: true,
          updated: true,
          count: count
        });
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
  console.log(err);
  response.status(500).send("Something broke!");
});

app.listen(process.env.PORT || 3000);
