const role = {
  usuario: "usuario",
  premiumUsr: "usuario-premium",
  admin: "admin",
};

const EVENTS = {
  CONNECTION: "connection",
  ERROR: "error",
  PRODUCT_CREATED: "product-created",
  GET_PRODUCTS: "get-products",
  NEW_PRODUCT: "new-product",
  CHAT_CONNECT: "chat-connect",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  NEW_USER: "new-user",
};

const strategies = {
  register: "registrar",
  localLogin: "login",
  githubLogin: "github-login",
};

module.exports = {
  role,
  roles: () => Object.values(role),
  EVENTS,
  strategies,
};
