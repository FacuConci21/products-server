const productsController = require("./controllers/products.controller");
const cartsController = require("./controllers/carts.controller");
const chatController = require("./controllers/chat.controller");
const usersController = require("./controllers/users.controller");
const viewsController = require("./controllers/views.controller");
const ticketsController = require("./controllers/tickets.controller");
const authViewsController = require("./controllers/auth-views.controller");

const router = (app) => {
  app.use("/api/ticket", ticketsController);
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/api/chat", chatController);
  app.use("/api/users", usersController);
  app.use("/auth", authViewsController);
  app.use("/", viewsController);
};

module.exports = router;
