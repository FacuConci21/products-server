const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "user";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model(collectionName, schema);

module.exports = Users;
