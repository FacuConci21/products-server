const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "cart";

const schema = new mongoose.Schema(
  {
    id: ObjectId,
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    products: {
      type: [
        {
          pid: { type: ObjectId, ref: "product" },
          quantity: { type: Number },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Carts = mongoose.model(collectionName, schema);

module.exports = Carts;
