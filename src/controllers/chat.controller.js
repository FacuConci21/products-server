const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/messages.service");
const { authorize } = require("../utils/middlewares/auth.middleware");
const { role } = require("../utils/constants");

const router = Router();

router.get("/msgs", async (req, res) => {
  try {
    const messages = await service.find();

    res.status(StatusCodes.OK).json({ status: "success", payload: messages });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/msg", authorize([role.usuario]), async (req, res) => {
  try {
    const { user, textContent } = req.body;

    const newMessage = await service.create(user, textContent);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
