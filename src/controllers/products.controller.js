const { Router } = require("express");
const { join } = require("path");
const { StatusCodes } = require("http-status-codes");
const ProductManager = require("../managers/ProductManager");
const uploader = require("../utils/multer");

const router = Router();
const productManager = new ProductManager("public/files");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts(Number.parseInt(limit));

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

    const product = await productManager.getProductById(Number.parseInt(pid));

    res.status(StatusCodes.OK).json({ status: "success", payload: product });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  try {
    const { title, description, price, code, stock, status } = req.body;

    if (!title || !description || !price || !code || !stock) {
      throw new Error("[addProduct] faltan uno o mas campos obligatorios >:(");
    }

    const product = {
      title,
      description,
      price,
      code,
      stock:
        (typeof stock).toLowerCase() === "number"
          ? stock
          : Number.parseInt(stock),
      status: status || true,
      thumbnails: [],
    };

    const thumbnails = req.files;

    if (thumbnails) {
      thumbnails.forEach((imgfile) => {
        product.thumbnails.push(join("src", "public", "img", imgfile.filename));
      });
    }

    const newProduct = await productManager.addProduct(product);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newProduct });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, thumbnails, code, stock, status } =
      req.body;

    const toUpdateProduct = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
    };

    const updtProduct = await productManager.updateProduct(
      Number.parseInt(pid),
      toUpdateProduct
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
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(
      Number.parseInt(pid)
    );
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
