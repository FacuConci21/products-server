const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "cart";

const schema = new mongoose.Schema({
  id: ObjectId,
  products: {
    type: [
      {
        pid: { type: ObjectId, require: true },
        quantity: { type: Number, require: true },
      },
    ],
  },
});

const Carts = mongoose.model(collectionName, schema);

module.exports = Carts;
