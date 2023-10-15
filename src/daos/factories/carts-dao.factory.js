const appConfig = require("../../utils/configs/app.config");

function cartsDaoFactory() {
  switch (appConfig.env) {
    case "production": {
      const CartsMongoDBDao = require("../mongodb/carts-mongodb.dao");
      return new CartsMongoDBDao();
    }
    case "development": {
      const CartsMongoDBDao = require("../mongodb/carts-mongodb.dao");
      return new CartsMongoDBDao();
    }
    case "local": {
      const CartFsDao = require("../filesystem/carts-filesystem.dao");
      return new CartFsDao();
    }
    default: {
      throw new Error("No valid environment.");
    }
  }
}

module.exports = cartsDaoFactory;
