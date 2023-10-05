const { join } = require("path");
const MessagesDao = require("../daos/mongodb/messages-mongodb.dao");
const appConfig = require("../utils/configs/app.config");

const messagesDao = new MessagesDao();
const service = {};

service.find = async () => {
  try {
    const messages = await messagesDao.find(4);
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (user, textContent) => {
  try {
    const messageInfo = { user, textContent };

    const createdMessage = await messagesDao.create(messageInfo);

    return createdMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
