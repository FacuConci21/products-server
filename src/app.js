const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const appPort = 8080;
const productManager = new ProductManager("files");

app.set("port", appPort);

app.get("/", (req, res) => {
  res.json({ message: "App is running." });
});

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts(Number.parseInt(limit));

    res.json({
      products,
    });
  } catch (error) {
    res.json({
      error: JSON.stringify(error),
    });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productManager.getProductById(Number.parseInt(pid));

    res.json({ product });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

app.listen(app.get("port"), (error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(`La aplicacion se ejecuto en el puerto ${app.get('port')}`);
});
