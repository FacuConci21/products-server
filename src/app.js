const express = require("express");
const router = require("./router");

const app = express();
const appPort = 8080;

app.set("port", appPort);

router(app);

/* 
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
}); */

module.exports = app;