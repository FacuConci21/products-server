const mongoose = require("mongoose");
const appConfig = require("./app-config");

const mongoConnect = async () => {
  try {
    const uri = `mongodb+srv://${appConfig.mongodbAtlas.user}:${appConfig.mongodbAtlas.pssw}@cluster0.wfjrtaj.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log("conectado a mongo atlas");
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoConnect;
