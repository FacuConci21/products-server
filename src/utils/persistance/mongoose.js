const mongoose = require("mongoose");
const appConfig = require("../configs/app-config");

const URI = `mongodb+srv://${appConfig.mongodbAtlas.user}:${appConfig.mongodbAtlas.pssw}@cluster0.wfjrtaj.mongodb.net/${appConfig.mongodbAtlas.dbname}?retryWrites=true&w=majority`;

const mongoConnect = async () => {
  try {
    await mongoose.connect(URI);
    console.log("conectado a mongo atlas");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { mongoConnect, URI };
