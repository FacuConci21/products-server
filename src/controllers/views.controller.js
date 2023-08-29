const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("/chat", async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("error", { status: "error", message: error.message });
  }
});

router.get("*", (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .render("error", { status: "error", message: "Page not found" });
});

module.exports = router;
