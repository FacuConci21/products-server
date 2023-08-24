const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const collectionName = "product";

const schema = new mongoose.Schema({
  _id: ObjectId,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnails: {
    type: [
      {
        thumbnail: String,
      },
    ],
  },
});

const Products = mongoose.model(collectionName, schema);

module.exports = Products;
