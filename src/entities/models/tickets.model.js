const mongoose = require("mongoose");

const collectionName = "ticket";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      // Genera un numero entero aleatorio entre 1 y 1000000 como string rellenando con 0.
      default: () =>
        ("" + Math.floor(Math.random() * 1000000 + 1)).padStart(10, "0"),
      unique: true,
      required: true,
    },
    purchaseDatetime: { type: Date, required: true, default: Date.now() },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    purchaser: {
      type: String,
      match: /.+\@.+\..+/,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tickets = mongoose.model(collectionName, schema);

module.exports = Tickets;
