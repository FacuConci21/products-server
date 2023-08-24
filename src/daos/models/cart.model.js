const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;
const Products = require("./products.model");

const collectionName = "cart";

const schema = new mongoose.Schema({
  id: ObjectId,
  products: {
    type: [
      {
        pid: { type: ObjectId, ref: "product" },
        quantity: { type: Number },
      },
    ],
  },
});

const Carts = mongoose.model(collectionName, schema);

module.exports = Carts;
