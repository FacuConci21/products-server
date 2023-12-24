const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;
const mongoosePaginate = require("mongoose-paginate-v2");

const collectionName = "product";

const schema = new mongoose.Schema(
  {
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
      type: [String],
    },
    user: {
      type: ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

const Products = mongoose.model(collectionName, schema);

module.exports = Products;
