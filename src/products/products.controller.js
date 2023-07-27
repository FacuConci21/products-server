const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Retorna todos los products" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ message: "Retorna un solo product" });
});

router.post("/", (req, res) => {
  res.status(200).json({ message: "Crea un product" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "Actualiza un product" });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({ message: "Elimina un product" });
});

module.exports = router;
