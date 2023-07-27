const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Retorna todos los carts" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ message: "Retorna un solo cart" });
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
