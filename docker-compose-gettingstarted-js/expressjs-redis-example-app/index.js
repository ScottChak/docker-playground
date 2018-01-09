var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");

//  Process request
var processRequest = function(request, response) {
  var redis = require("redis");

  console.log("Starting");

  var countKey = "count";

  var connected = false;
  var updated = false;
  var readIssue = "Unknown Issue";
  var writeIssue = "Unknown Issue";
  var count = 0;

  var client = redis.createClient(6379, "redis");
  client.on("error", function() {
    readIssue = "Server unreachable";

    response.render("home", {
      connected: connected,
      updated: updated,
      readIssue: readIssue,
      writeIssue: writeIssue,
      count: count
    });
  });

  client.on("connect", function() {
    connected = true;

    client.get(countKey, function(err, reply) {
      console.log(err);
      console.log(reply);

      //   readIssue = err;
      //   if (!readIssue) {
      //     connected = true;

      //     if (reply) {
      //       count = parseInt(reply)++;
      //     }

      //     client.set(countKey, count.toString(), function(err2, reply2) {
      //       console.log(err2);
      //       console.log(reply2);

      //       writeIssue = err2;
      //       updated = !writeIssue;
      //     });
      //   }

      response.render("home", {
        connected: connected,
        updated: updated,
        readIssue: readIssue,
        writeIssue: writeIssue,
        count: count
      });
    });
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
