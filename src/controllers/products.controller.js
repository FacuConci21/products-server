const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager("files");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts(Number.parseInt(limit));

    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productManager.getProductById(Number.parseInt(pid));

    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnails, code, stock, status } =
      req.body;

    if (!title || !description || !price || !code || !stock) {
      throw new Error("[addProduct] faltan uno o mas campos obligatorios >:(");
    }

    const product = {
      title,
      description,
      price,
      thumbnails: thumbnails || [],
      code,
      stock,
      status: status || true,
    };

    const newProduct = await productManager.addProduct(product);

    res.status(200).json({ status: "created", payload: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
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
    res.status(200).json({ status: "updated", payload: updtProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(Number.parseInt(pid));
    res.status(200).json({ status: "deleted", payload: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
