const appConfig = require("../../utils/configs/app.config");

function productsDaoFactory() {
  switch (appConfig.env) {
    case "production": {
      const ProductsMongoDBDao = require("../mongodb/products-mongodb.dao");
      return new ProductsMongoDBDao();
    }
    case "development": {
      const ProductsMongoDBDao = require("../mongodb/products-mongodb.dao");
      return new ProductsMongoDBDao();
    }
    case "local": {
      const ProductFsDao = require("../filesystem/products-filesystem.dao");
      return new ProductFsDao();
    }
    default: {
      throw new Error("No valid environment.");
    }
  }
}

module.exports = productsDaoFactory;
