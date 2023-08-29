const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const MessgesDao = require("../daos/messages.dao");

const router = Router();
const messageDao = new MessgesDao();

router.get("/msgs", async (req, res) => {
  try {
    const messages = await messageDao.find();
    
    res.status(StatusCodes.OK).json({ status: "success", payload: messages });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/msg", async (req, res) => {
  try {
    const { user, textContent } = req.body;

    const messageInfo = { user, textContent };

    const newMessage = await messageDao.create(messageInfo);

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
