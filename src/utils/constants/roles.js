const role = {
  usuario: "usuario",
  admin: "admin",
};

module.exports = {
  role,
  roles: () => Object.values(role),
};
