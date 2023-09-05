const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "user";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      require: true,
      default: `user${Date.now()}`,
    },
    lastName: {
      type: String,
      require: false,
    },
    cart: {
      type: ObjectId,
      ref: "cart",
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model(collectionName, schema);

module.exports = Users;
