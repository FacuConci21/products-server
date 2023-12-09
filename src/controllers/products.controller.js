const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/products.service");
const uploader = require("../utils/middlewares/uploader.middleware");
const { role } = require("../utils/constants");
const authorize = require("../utils/middlewares/authorization.middleware");
const { generateManyProducts } = require("../utils/mocks/products.mock");

const router = Router();

router.get("/mockingproducts", async (req, res) => {
  try {
    const { quantity } = req.query;

    const products = generateManyProducts(quantity || 100);

    res.status(StatusCodes.OK).json({ status: "success", payload: products });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, status } = req.query;

    const query = status ? { status } : {};

    const products = await service.find(
      query,
      Number.parseInt(limit),
      Number.parseInt(page),
      Number.parseInt(sort)
    );

    res.status(StatusCodes.OK).json({ status: "success", payload: products });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await service.findById(pid);

    res.status(StatusCodes.OK).json({ status: "success", payload: product });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post(
  "/",
  // authorize([role.admin]),
  uploader.array("thumbnails"),
  async (req, res) => {
    try {
      const { title, description, price, code, stock, status } = req.body;

      const thumbnails = req.files;

      const newProduct = await service.create(
        title,
        description,
        price,
        code,
        stock,
        status,
        thumbnails
      );

      res
        .status(StatusCodes.CREATED)
        .json({ status: "created", payload: newProduct });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.put(
  "/:pid",
  authorize([role.admin]),
  uploader.array("thumbnails"),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const { title, description, price, code, stock, status } = req.body;

      const thumbnails = req.files;

      const updtProduct = await service.update(
        pid,
        title,
        description,
        price,
        code,
        stock,
        status,
        thumbnails
      );

      res
        .status(StatusCodes.OK)
        .json({ status: "updated", payload: updtProduct });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.delete("/:pid", authorize([role.admin]), async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await service.delete(pid);

    res
      .status(StatusCodes.OK)
      .json({ status: "deleted", payload: deletedProduct });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
