const { join } = require("path");
require("dotenv").config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const appConfig = {
  host: process.env.APP_HOST || "localhost",
  port: process.env.APP_PORT || 8080,
  sessionSecret: process.env.SESSION_SECRET,
  mongodbAtlas: {
    dbname: process.env.MONGO_ATLAS_DATABASE,
    user: process.env.MONGO_ATLAS_USER,
    pssw: process.env.MONGO_ATLAS_PASSWORD,
  },
};

module.exports = appConfig;
