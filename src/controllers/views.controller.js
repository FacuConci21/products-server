const { Router } = require("express");
const { join } = require("path");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager("public/files");

router.get("/home", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts(Number.parseInt(limit));

    res.render("home", { haveProducts: products.length > 0, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("*", (req, res) => {
  res
    .status(404)
    .render("error", { status: "error", message: "Page not found" });
});

module.exports = router;
