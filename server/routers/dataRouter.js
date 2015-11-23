var express = require("express");

var routes = function(appData) {

    var dataRouter = express.Router();
    dataRouter
        .get("/", function(req, res) {
            res.send(appData);
        })
        .post("/", function(req, res) {
            appData = req.body;
            res.sendStatus(201);
        });

    return dataRouter;

};

module.exports = routes;
