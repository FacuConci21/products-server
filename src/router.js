const swaggerUi = require("swagger-ui-express");
const productsController = require("./controllers/products.controller");
const cartsController = require("./controllers/carts.controller");
const chatController = require("./controllers/chat.controller");
const usersController = require("./controllers/users.controller");
const ticketsController = require("./controllers/tickets.controller");
const viewsController = require("./controllers/views.controller");
const authViewsController = require("./controllers/auth-views.controller");
const { spec } = require("./utils/configs/swagger.config");

const router = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.use("/api/ticket", ticketsController);
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/api/chat", chatController);
  app.use("/api/users", usersController);
  app.use("/auth", authViewsController);
  app.use("/", viewsController);
};

module.exports = router;
