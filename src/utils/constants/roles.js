const role = {
  usuario: "usuario",
  premiumUsr: "usuario-premium",
  admin: "admin",
};

module.exports = {
  role,
  roles: () => Object.values(role),
};
