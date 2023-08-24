require('dotenv').config();

const appConfig = {
    mongodbAtlas: {
        dbname: process.env.MONGO_ATLAS_DATABASE,
        user: process.env.MONGO_ATLAS_USER,
        pssw: process.env.MONGO_ATLAS_PASSWORD,
    }
}

module.exports = appConfig;