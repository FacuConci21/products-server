const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/cart.service");

const router = Router();

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
    const { user, products } = req.body;

    const newCart = await service.create(user, products);

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

router.post("/:cid/purchase", async (req, res) => {
  try {
    // const { cid } = req.params;
    // const result = await service.createTicket(cid);
    res
      .status(StatusCodes.NOT_IMPLEMENTED)
      .json({ status: "created", payload: {} });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const result = await service.update(cid, products);

    res.status(StatusCodes.OK).json({ status: "updated", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.query;

    const result = await service.deleteProduct(cid, pid);

    res.status(StatusCodes.OK).json({ status: "updated", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await service.deleteProduct(cid, pid);

    res.status(StatusCodes.OK).json({ status: "deleted", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await service.delete(cid);

    res.status(StatusCodes.OK).json({ status: "deleted", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
