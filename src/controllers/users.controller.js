const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const service = require("../services/users.service");
const strategies = require("../utils/constants/strategies");

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
    const session = req.session;

    const result = session.destroy((err) => {
      if (err) throw err;
    });

    if (req.user) {
      req.user = undefined;
    }

    res.status(StatusCodes.OK).json({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/fail-register", async (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Se produjo un error al registrar usuario.",
  });
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

router.post(
  "/",
  passport.authenticate(strategies.register),
  async (req, res) => {
    try {
      res
        .status(StatusCodes.CREATED)
        .json({ status: "created", payload: req.user });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.post(
  "/login",
  passport.authenticate(strategies.localLogin),
  async (req, res) => {
    try {
      if (!req.user) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "error", message: "Invalid credentials" });
      }

      req.session.user = req.user;

      res.status(StatusCodes.OK).json({ status: "success", payload: req.user });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

module.exports = router;
