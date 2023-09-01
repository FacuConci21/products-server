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
    firstName: {
      type: String,
      require: true,
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
