const { Router, json } = require("express");
const { StatusCodes } = require("http-status-codes");
const productsService = require("../services/products.service");
const cartsService = require("../services/cart.service");

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("home");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, status } = req.query;

    const query = status ? { status } : {};

    const productsPage = await productsService.find(
      query,
      Number.parseInt(limit),
      Number.parseInt(page)
    );

    res.status(StatusCodes.OK).render("products", { productsPage });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("realtimeproducts");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/chat", async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("chat");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsService.findById(cid);

    res.status(StatusCodes.OK).render("cart", {
      cartId: cart._id,
      username: cart.user.firstName,
      hasProducts: cart.products.length > 0,
      cart: cart.toJSON(),
    });
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
