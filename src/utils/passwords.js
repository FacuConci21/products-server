const bcrypt = require("bcrypt");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePasswords(normalPassword, hashedPassword) {
  return bcrypt.compareSync(normalPassword, hashedPassword);
}
module.exports = { hashPassword, comparePasswords };
