const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const service = require("../services/users.service");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const users = await service.find(username);

    res.status(StatusCodes.OK).json({ status: "success", payload: users });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const { user } = req.session;
    const session = req.session;
    const sessionID = req.sessionID;

    const result = session.destroy((err) => {
      if (err) throw new Error("error al proposito");
    });

    res.status(StatusCodes.OK).json({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await service.findById(uid);

    res.status(StatusCodes.OK).json({ status: "success", payload: user });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    const newUser = await service.create(
      username,
      password,
      firstName,
      lastName
    );

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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await service.login(username, password);

    if (user) {
      req.session.user = { username: user.username, role: "usuario" };

      res.status(StatusCodes.OK).json({ status: "success", payload: user });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

module.exports = router;
