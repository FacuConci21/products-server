const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/users.service");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await service.find();

    res.status(StatusCodes.OK).json({ status: "success", payload: users });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;

    const newUser = await service.create(username, firstName, lastName);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "created", payload: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
