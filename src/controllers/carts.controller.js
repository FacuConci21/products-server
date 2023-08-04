const { Router } = require("express");
const CartManager = require("../managers/CartsManager");

const router = Router();
const cartManager = new CartManager("files");

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(Number.parseInt(cid));

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    const newCart = { products: products || [] };

    const addedCart = await cartManager.addCart(newCart);

    res.status(200).json({ status: "created", payload: addedCart });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.query;

    const newProduct = {
      pid: Number.parseInt(pid),
      quantity: Number.parseInt(quantity),
    };

    const updatedCart = await cartManager.addProductCart(
      Number.parseInt(cid),
      newProduct
    );

    res.status(200).json({ status: "created", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.status(200).json({ status: "updated", payload: {} });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.status(200).json({ status: "deleted", payload: {} });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

module.exports = router;
