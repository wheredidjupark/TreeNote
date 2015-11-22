var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use("/", express.static(__dirname + "/../client"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


var appData;

app.get("/", function(req,res){
	res.end();
});

app.get("/data", function(req, res) {
    res.send(appData);

});


app.post("/data", function(req, res) {
    appData = req.body;
    res.sendStatus(201);
});

var listener = app.listen(4000, "localhost", function() {
    console.log("server running at", listener.address());
});