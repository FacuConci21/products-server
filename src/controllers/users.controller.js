const { Router } = require("express");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const passport = require("passport");
const service = require("../services/users.service");
const { strategies, role } = require("../utils/constants");
const { logger } = require("../utils/middlewares/logger.middleware");
const uploader = require("../utils/middlewares/uploader.middleware");
const { authorize } = require("../utils/middlewares/auth.middleware");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const users = await service.find(username);

    res.status(StatusCodes.OK).json({ status: "success", payload: users });
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.get("/fail-register", async (req, res) => {
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: "error",
    message: "Error al registrar usuario.",
  });
});

router.get("/fail-login", async (req, res) => {
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: "error",
    message: "Error logueando usuario.",
  });
});

router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await service.findById(uid);

    res.status(StatusCodes.OK).json({ status: "success", payload: user });
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
});

router.post(
  "/",
  passport.authenticate(strategies.register, {
    failureRedirect: "/fail-register",
  }),
  async (req, res) => {
    try {
      res
        .status(StatusCodes.CREATED)
        .json({ status: "created", payload: req.user });
    } catch (error) {
      logger.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.post(
  "/login",
  passport.authenticate(strategies.localLogin, {
    failureRedirect: "/fail-login",
  }),
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
      logger.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.post(
  "/:uid/documents",
  passport.authenticate(strategies.localLogin),
  authorize([role.usuario, role.admin]),
  uploader.fields([
    { name: "profiles", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "accountProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { uid } = req.params;

      const documents = req.files;

      const user = await service.addDocuments(uid, documents);

      return res
        .status(StatusCodes.OK)
        .json({ status: "success", payload: user });
    } catch (error) {
      logger.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

router.patch(
  "/premium/:uid",
  passport.authenticate(strategies.localLogin),
  authorize(["usuario", "admin"]),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await service.updateToPremium(uid);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: "error", message: ReasonPhrases.NOT_FOUND });
      }
      return res
        .status(StatusCodes.OK)
        .json({ status: "success", payload: user });
    } catch (error) {
      logger.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: error.message });
    }
  }
);

module.exports = router;
