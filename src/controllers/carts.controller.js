const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const CartDao = require("../daos/carts.dao");
const service = require("../services/cart.service");

const router = Router();
const cartsDao = new CartDao();

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await service.findById(cid);

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

    const newCart = await service.create(products);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newCart });
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

    const result = await service.addProduct(
      cid,
      pid,
      Number.parseInt(quantity)
    );

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: result });
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
