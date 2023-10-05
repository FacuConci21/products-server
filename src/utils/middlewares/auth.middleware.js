
const auth = (req, res, next) => {
  let isLoggedUser = req.user ? true : false;
  if (!isLoggedUser) {
    return res.redirect("/auth/login");
  }

  next();
};

module.exports = auth;
