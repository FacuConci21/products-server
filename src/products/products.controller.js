const { Router } = require("express");
const ProductManager = require("./ProductManager");

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
    const { title, description, price, thumbnails, code, stock } = req.body;

    if (!title || !description || !price || !thumbnails || !code || !stock) {
      throw new Error("[addProduct] faltan uno o mas campos obligatorios >:(");
    }

    const product = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
    };

    const newProduct = await productManager.addProduct(product);
    
    res.status(200).json({ status: "created", payload: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "Actualiza un product" });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({ message: "Elimina un product" });
});

module.exports = router;
