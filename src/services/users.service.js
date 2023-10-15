const { roles } = require("../utils/constants/roles");
const { hashPassword, comparePasswords } = require("../utils/passwords.js");
const UsersMongoDBDao = require("../daos/mongodb/users-mongodb.dao");
const cartsDaoFactory = require("../daos/factories/carts-dao.factory");
const UsersDto = require("../entities/dtos/user.dto");

const usersDao = new UsersMongoDBDao();
const cartsDao = cartsDaoFactory();
const service = {};

service.find = async (username, customFilter) => {
  try {
    const filter = customFilter || {};

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

service.create = async (
  username,
  email,
  password,
  firstName,
  lastName,
  role
) => {
  try {
    const validateUser = await usersDao.findOne({ username });

    if (validateUser) {
      throw new Error("Este nombre de usuario ya esta en uso.");
    }

    if (!roles().includes(role)) {
      throw new Error("El rol indicado no es valido.");
    }
    
    const createdUser = await usersDao.create(
      new UsersDto(
        username,
        email,
        hashPassword(password),
        firstName,
        lastName,
        (
          await cartsDao.create({ products: [] })
        )._id,
        role
      )
    );

    const updateCart = await cartsDao.updateOne(createdUser.cart.toString(), {
      user: createdUser._id.toString(),
    });

    return createdUser;
  } catch (error) {
    throw error;
  }
};

service.login = async (email, password) => {
  try {
    const currentUser = await usersDao.findOne({ email });

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
