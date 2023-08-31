require('dotenv').config();

const appConfig = {
    host: process.env.APP_HOST || 'localhost',
    port: process.env.APP_PORT || 8080,
    mongodbAtlas: {
        dbname: process.env.MONGO_ATLAS_DATABASE,
        user: process.env.MONGO_ATLAS_USER,
        pssw: process.env.MONGO_ATLAS_PASSWORD,
    }
}

module.exports = appConfig;