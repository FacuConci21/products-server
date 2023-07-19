const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "App is running." });
});

app.get("/products", (req, res) => {
  const { limit } = req.query;
  res.json({
    message: `This route returns all products (limit=${limit})`,
  });
});

app.get("/products/:pid", (req, res) => {
  const { pid } = req.params;
  res.json({ message: `This route returns the product with id #${pid}` });
});

app.listen(3000, () => console.log("App running."));
