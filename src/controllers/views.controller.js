const { Router, json } = require("express");
const { StatusCodes } = require("http-status-codes");
const productsService = require("../services/products.service");
const cartsService = require("../services/cart.service");

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

router.get("/registration", async (req, res) => {
  try {
    res
      .status(StatusCodes.OK)
      .render("user-register", { pageTitle: "Crear cuenta" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
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

    const productsList = productsPage.docs.map((doc) => doc.toJSON());

    res.status(StatusCodes.OK).render("products", {
      pageTitle: "Products Page",
      products: productsList,
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

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productsService.findById(pid);

    res.status(StatusCodes.OK).render("product-detail", {
      pageTitle: "Detalle de producto",
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

router.get("/realtimeproducts", async (req, res) => {
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

router.get("/chat", async (req, res) => {
  try {
    res.status(StatusCodes.OK).render("chat", { pageTitle: "Foro del chat" });
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
