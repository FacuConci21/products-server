const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager("public/files");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts(Number.parseInt(limit));

    res.render("home", { haveProducts: products.length > 0, products });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("*", (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .render("error", { status: "error", message: "Page not found" });
});

module.exports = router;
