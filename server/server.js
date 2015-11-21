var express = require("express");
var app = express();

app.use(express.static("../static"));

app.listen(4000, function(){
	console.log("server running at 4000");
});