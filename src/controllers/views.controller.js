const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const productsService = require("../services/products.service");
const cartsService = require("../services/cart.service");
const {authenticate} = require("../utils/middlewares/auth.middleware");

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("home", { pageTitle: "Home" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/products", authenticate, async (req, res) => {
  try {
    const { limit, page, sort, status } = req.query;
    const userSession = {};
    let isLoggedUser = req.user ? true : false;

    userSession.username = req.user.username;
    userSession.role = req.user.role;

    const query = status ? { status } : {};

    const productsPage = await productsService.find(
      query,
      Number.parseInt(limit),
      Number.parseInt(page)
    );

    const productsList = productsPage.docs.map((doc) => doc.toJSON());

    res.status(StatusCodes.OK).render("products", {
      pageTitle: "Products Page",
      isLoggedUser,
      userSession,
      products: productsList,
      hasProducts: productsList.length > 0,
      currentPage: productsPage.page,
      hasPrevPage: productsPage.hasPrevPage,
      hasNextPage: productsPage.hasNextPage,
      prevPage: productsPage.prevLink,
      nextPage: productsPage.nextLink,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/products/:pid", authenticate, async (req, res) => {
  try {
    const { pid } = req.params;
    const userSession = {};
    let isLoggedUser = req.user ? true : false;

    userSession.username = req.user.username;
    userSession.role = req.user.role;

    const product = await productsService.findById(pid);

    res.status(StatusCodes.OK).render("product-detail", {
      pageTitle: "Detalle de producto",
      isLoggedUser,
      userSession,
      product: product.toJSON(),
      productStatus: product.status && product.stock > 0,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/realtimeproducts", authenticate, async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("realtimeproducts", {
      pageTitle: "Productos en tiempo real",
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/chat", authenticate, async (req, res) => {
  try {
    const userSession = {};
    let isLoggedUser = req.user ? true : false;

    userSession.username = req.user.username;
    userSession.role = req.user.role;

    res.status(StatusCodes.OK).render("chat", {
      pageTitle: "Foro del chat",
      isLoggedUser,
      userSession,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsService.findById(cid);

    res.render("cart", {
      pageTitle: "Detalle del carrito",
      cartId: cart._id,
      username: cart.user?.firstName,
      hasProducts: cart.products.length > 0,
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).render("error", {
    pageTitle: "Error",
    status: "error",
    message: "Page not found",
  });
});

module.exports = router;
