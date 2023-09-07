const { join } = require("path");
const UsersDao = require("../daos/users.dao");
const CartsDao = require("../daos/carts.dao");
const appConfig = require("../utils/app-config");
const { hashPassword, comparePasswords } = require("../utils/passwords.js");
const usersDao = new UsersDao();
const cartsDao = new CartsDao();

const service = {};

service.find = async (username) => {
  try {
    const filter = {};

    if (username) {
      filter.username = username;
    }

    const users = await usersDao.find(filter);

    return users;
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

service.findOne = async (username) => {
  try {
    const user = await usersDao.findOne({ username });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (username, password, firstName, lastName) => {
  try {
    const validateUser = await usersDao.findOne({ username });

    if (validateUser) {
      throw new Error("Este nombre de usuario ya esta en uso.");
    }

    const userInfo = {
      username,
      password: hashPassword(password),
      firstName,
      lastName,
      cart: (await cartsDao.create({ products: [] }))._id,
    };

    const createdUser = await usersDao.create(userInfo);

    const updateCart = await cartsDao.updateOne(createdUser.cart.toString(), {
      user: createdUser._id.toString(),
    });

    return createdUser;
  } catch (error) {
    throw error;
  }
};

service.login = async (username, password) => {
  try {
    const currentUser = await usersDao.findOne({ username });

    if (!currentUser) {
      throw new Error("Usuario o contraseña incorrecta.");
    }

    const result = comparePasswords(password, currentUser.password);

    if (!result) {
      throw new Error("Usuario o contraseña incorrecta.");
    }

    return currentUser;
  } catch (error) {
    throw error;
  }
};

module.exports = service;
