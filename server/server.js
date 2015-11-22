var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use("/", express.static("../client"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.text({
    type: "text/html"
}));


var data;


app.get("/", function(req,res){
	res.end();
});

app.get("/data", function(req, res) {
    res.send(data);
    console.log(data);
});


app.post("/data", function(req, res) {

    // console.log(req.url);

    data = req.body;
    console.log(data);
    res.sendStatus(200);
    res.end();
});

var listener = app.listen(4000, "localhost", function() {
    console.log("server running at", listener.address(), listener.address().port);
});
