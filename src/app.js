const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const productManager = new ProductManager("files");

app.get("/", (req, res) => {
  res.json({ message: "App is running." });
});

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts();

    res.json({
      products,
    });
  } catch (error) {
    res.json({
      error: JSON.stringify(error),
    });
  }
});

app.get("/products/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    res.json({ message: `This route returns the product with id #${pid}` });
  } catch (error) {
    res.json({
      error: JSON.stringify(error),
    });
  }
});

app.listen(3000, () => console.log("App running."));
