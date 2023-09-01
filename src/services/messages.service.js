const { join } = require("path");
const MessagesDao = require("../daos/messages.dao");
const appConfig = require("../utils/app-config");
const messagesDao = new MessagesDao();

const service = {};

service.find = async () => {
  try {
    const messages = await messagesDao.find();
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
