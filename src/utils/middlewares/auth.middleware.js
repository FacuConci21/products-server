const { StatusCodes } = require("http-status-codes");

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error("Authentication required.");
      }

      const { role } = req.user;

      if (roles.includes(role)) {
        next();
      } else {
        throw new Error("No tiene permitido esta accion.");
      }
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: error.message,
      });
    }
  };
};

const authenticate = (req, res, next) => {
  let isLoggedUser = req.user ? true : false;
  if (!isLoggedUser) {
    return res.redirect("/auth/login");
  }

  next();
};

module.exports = { authorize, authenticate };
