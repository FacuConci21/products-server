const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "message";

const schema = new mongoose.Schema(
  {
    textContent: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model(collectionName, schema);

module.exports = Messages;
