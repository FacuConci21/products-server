const mongoose = require("mongoose");
const appConfig = require("../configs/app.config");
const { logger } = require("../middlewares/logger.middleware");

const URI = `mongodb+srv://${appConfig.mongodbAtlas.user}:${appConfig.mongodbAtlas.pssw}@cluster0.wfjrtaj.mongodb.net/${appConfig.mongodbAtlas.dbname}?retryWrites=true&w=majority`;

const mongoConnect = async () => {
  try {
    await mongoose.connect(URI);
    logger.info("Conectado a mongo atlas");
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { mongoConnect, URI };
