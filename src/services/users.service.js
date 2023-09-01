const { join } = require("path");
const UsersDao = require("../daos/users.dao");
const appConfig = require("../utils/app-config");
const usersDao = new UsersDao();

const service = {};

service.find = async () => {
  try {
    const messages = await usersDao.find();
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.findById = async (uid) => {
  try {
    const message = await usersDao.findById(uid);
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.findByUsername = async (username) => {
  try {
    const message = (await usersDao.find({ username })).pop();
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (username, firstName, lastName) => {
  try {
    const userInfo = {
      username,
      firstName,
      lastName,
    };

    const createdMessage = await usersDao.create(userInfo);

    return createdMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
