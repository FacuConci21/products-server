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

service.create = async (username, firstName, lastName) => {
  try {
    const userInfo = {
      username,
      password,
      firstName,
      lastName,
    };

    const createdUser = await usersDao.create(userInfo);

    return createdUser;
  } catch (error) {
    throw error;
  }
};

service.login = async (username, password) => {
  try {
    const currentUser = await usersDao.findOne({ username });

    const currentPassword = currentUser.password;

    if (!Object.is(currentUser.password, password)) {
      throw new Error("Contraseña incorrecta.");
    }

    return currentUser;
  } catch (error) {
    throw error;
  }
};

module.exports = service;
