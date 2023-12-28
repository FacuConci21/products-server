const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/tickets.service");

const router = Router();

router.get("/", async (req, res) => {
  res
    .status(StatusCodes.NOT_IMPLEMENTED)
    .json({ status: "error", message: {} });
});

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const ticket = await service.findByCode(code);

    if (ticket.length <= 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Not found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ status: "success", payload: ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const newTicket = await service.create(cid);

    if (!newTicket) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "not found" });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newTicket });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
