const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const CartManager = require("../daos/CartsManager");
const CartDao = require("../daos/carts.dao");

const router = Router();
// const cartManager = new CartManager("public/files");
const cartsDao = new CartDao();

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // const cart = await cartManager.getCartById(Number.parseInt(cid));
    const cart = await cartsDao.findById(cid);

    res.status(StatusCodes.OK).json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    const newCart = { products: products || [] };

    // const addedCart = await cartManager.addCart(newCart);
    const addedCart = await cartsDao.create(newCart);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: addedCart });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.query;

    const newProduct = {
      pid: pid,
      quantity: Number.parseInt(quantity),
    };

    // const updatedCart = await cartManager.addProductCart(Number.parseInt(cid),newProduct);

    const updtCart = await cartsDao.findById(cid);
    
    updtCart.products.push(newProduct);

    const updatedCart = await cartsDao.updateOne(cid, updtCart);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.status(StatusCodes.ACCEPTED).json({ status: "updated", payload: {} });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.status(StatusCodes.ACCEPTED).json({ status: "deleted", payload: {} });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
