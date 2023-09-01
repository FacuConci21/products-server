const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;
const Products = require("./products.model");

const collectionName = "cart";

const schema = new mongoose.Schema(
  {
    id: ObjectId,
    user: {
      type: ObjectId,
      ref: "user",
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
