const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "message";

const schema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    }
});

const Messages = mongoose.model(collectionName, schema);

module.exports = Messages;
