var express = require("express");
// var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
// var db = mongoose.connect('mongodb://localhost/worktree');


var port = process.env.PORT || 4000;


//use body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//serving static files at root
app.use("/", express.static(__dirname + "/../client"));


//our database (for now it's an object)
var appData = {};

app.get("/", function(req, res) {
    res.end();
});

var dataRouter = require("./routers/dataRouter")(appData);
app.use("/data", dataRouter);

var listener = app.listen(port, "localhost", function() {
    console.log("server running at", listener.address());
});
