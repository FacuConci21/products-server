const productsController = require("../controllers/products.controller");
const cartsController = require("../controllers/carts.controller");
const viewsController = require("../controllers/views.controller");

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/", viewsController);
};

module.exports = router;
