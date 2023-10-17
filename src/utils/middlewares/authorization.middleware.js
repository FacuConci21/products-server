const { StatusCodes } = require("http-status-codes");

const authorize = (roles = []) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (roles.includes(role)) {
      next();
    } else {
      console.error("No permitido");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "No tiene permitido esta accion.",
      });
    }
  };
};

module.exports = authorize;
