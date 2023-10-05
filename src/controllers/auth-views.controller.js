const { Router, json } = require("express");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const auth = require("../utils/auth.middleware");
const strategies = require("../utils/constants/strategies");

const router = Router();

router.get("/registration", async (req, res) => {
  try {
    res
      .status(StatusCodes.OK)
      .render("user-register", { pageTitle: "Crear cuenta" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get("/login", (req, res) => {
  try {
    const userSession = {};
    let isLoggedUser = req.user ? true : false;

    if (isLoggedUser) {
      userSession.username = req.user.username;
      userSession.role = req.user.role;
    }

    res
      .status(StatusCodes.OK)
      .render("login", { pageTitle: "Login", isLoggedUser, userSession });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
      pageTitle: "Error",
      status: "error",
      message: error.message,
    });
  }
});

router.get(
  "/login/github",
  passport.authenticate(strategies.githubLogin),
  (req, res) => {
    try {
      const userSession = {};
      let isLoggedUser = req.user ? true : false;

      if (isLoggedUser) {
        userSession.username = req.user.username;
        userSession.role = req.user.role;
      }

      res.redirect("/products?limit=4&page=1");
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
        pageTitle: "Error",
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
