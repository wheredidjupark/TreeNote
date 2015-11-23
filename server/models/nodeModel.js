var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AppModel = new Schema({
    data: {
        type: String
    }
}, {
    collection: 'node'
});


module.exports = mongoose.model("App", AppModel);