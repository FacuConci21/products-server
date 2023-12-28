const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;
const { role } = require("../../utils/constants");

const collectionName = "user";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: `user${Date.now()}`,
    },
    lastName: {
      type: String,
      require: false,
    },
    age: Number,
    cart: {
      type: ObjectId,
      ref: "cart",
    },
    role: {
      type: String,
      require: true,
      default: role.usuario,
    },
    documents: {
      type: [
        {
          name: String,
          reference: String,
          docType: {
            type: String,
            enum: ["profile", "address", "account"],
          },
        },
      ],
    },
    tickets: {
      type: [
        {
          tid: { type: ObjectId, ref: "ticket" },
        },
      ],
    },
    lastConnection: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model(collectionName, schema);

module.exports = Users;
