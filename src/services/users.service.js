const { roles } = require("../utils/constants/roles");
const { hashPassword, comparePasswords } = require("../utils/passwords.js");
const UsersMongoDBDao = require("../daos/mongodb/users-mongodb.dao");
const cartsDaoFactory = require("../daos/factories/carts-dao.factory");
const UsersDto = require("../entities/dtos/user.dto");
const CustomError = require("../utils/handlers/custom-error");
const ErrorCodes = require("../utils/constants/ErrorCodes");
const ErrorMsgs = require("../utils/constants/ErrorMsgs");
const ErrorTypes = require("../utils/constants/ErrorTypes");

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
    CustomError.create({name: ErrorTypes.UNEXPECTED_EXCEPTION, message: error.message});
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
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        cause: "Este nombre de usuario ya esta en uso",
        code: ErrorCodes.RESOURSE_ALREADY_EXISTS,
        message: ErrorMsgs.RESOURSE_ALREADY_EXISTS,
      });
    }

    if (!roles().includes(role)) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        code: ErrorCodes.INVALID_ROLE,
        message: ErrorMsgs.INVALID_ROLE,
      });
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
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        message: ErrorMsgs.INVALID_CREDENTIALS,
        code: ErrorCodes.INVALID_CREDENTIALS,
        cause: 'Email no encontrado',
      });
    }

    const result = comparePasswords(password, currentUser.password);

    if (!result) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        message: ErrorMsgs.INVALID_CREDENTIALS,
        code: ErrorCodes.INVALID_CREDENTIALS,
        cause: 'password incorrecta',
      });
    }

    return currentUser;
  } catch (error) {
    throw error;
  }
};

module.exports = service;
