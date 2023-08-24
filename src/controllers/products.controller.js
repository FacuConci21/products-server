const { Router } = require("express");
const { join } = require("path");
const { StatusCodes } = require("http-status-codes");
const ProductManager = require("../daos/ProductManager");
const ProductsDao = require("../daos/products.dao");
const uploader = require("../utils/multer");

const router = Router();
const productManager = new ProductManager("public/files");
const productsDao = new ProductsDao();

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    // const products = await productManager.getProducts(Number.parseInt(limit));
    const products = await productsDao.find();

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

    // const product = await productManager.getProductById(Number.parseInt(pid));
    const product = await productsDao.findById(pid);

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

    const productInfo = {
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
        productInfo.thumbnails.push(
          join("src", "public", "img", imgfile.filename)
        );
      });
    }

    // const newProduct = await productManager.addProduct(product);
    const newProduct = await productsDao.create(productInfo);

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

router.put("/:pid", uploader.array("thumbnails"), async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, code, stock, status } =
      req.body;

    const productInfo = {
      title,
      description,
      price,
      thumbnails : [],
      code,
      stock,
      status: status || true,
    };
    const thumbnails = req.files;

    if (thumbnails) {
      thumbnails.forEach((imgfile) => {
        productInfo.thumbnails.push(
          join("src", "public", "img", imgfile.filename)
        );
      });
    }

    // const updtProduct = await productManager.updateProduct(Number.parseInt(pid),toUpdateProduct);
    const updtProduct = await productsDao.updateOne(pid,productInfo);

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
    // const deletedProduct = await productManager.deleteProduct(Number.parseInt(pid));
    const deletedProduct = await productsDao.delete(pid);

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
