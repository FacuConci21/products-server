const MessagesMongoDBDao = require("../daos/mongodb/messages-mongodb.dao");
const MessagesDto = require("../entities/dtos/messages.dto");

const messagesDao = new MessagesMongoDBDao();
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
    const messageInfo = new MessagesDto(textContent, user);

    const createdMessage = await messagesDao.create(messageInfo);

    return createdMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
