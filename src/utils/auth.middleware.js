const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
  let isLoggedUser = req.session.user ? true : false;
  if (!isLoggedUser) {
    return res.redirect("/login");
  }

  next();
};

module.exports = auth;