const { Router } = require("express");
const CartManager = require("./CartsManager");

const router = Router();
const cartManager = new CartManager("files");

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "error", message: error.message });
  }
});

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

router.post("/", (req, res) => {
  res.status(200).json({ message: "Crea un cart" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "Actualiza un cart" });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({ message: "Elimina un cart" });
});

module.exports = router;
