const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/tickets.service");

const router = Router();

router.get("/", async (req, res) => {
  res
    .status(StatusCodes.NOT_IMPLEMENTED)
    .json({ status: "error", message: {} });
});

router.get("/:tid", async (req, res) => {
  try {
    const { tid } = req.params;
    const ticket = await service.findById(tid);

    res.status(StatusCodes.OK).json({ status: "success", payload: ticket });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { code, purchaseDatetime, amount, purchaser } = req.body;

    const newTicket = await service.create(
      code,
      purchaseDatetime,
      amount,
      purchaser
    );

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newTicket });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
