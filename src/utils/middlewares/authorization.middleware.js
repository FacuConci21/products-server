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

module.exports = authorize;
