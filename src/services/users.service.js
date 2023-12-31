const { join } = require("node:path");
const UsersMongoDBDao = require("../daos/mongodb/users-mongodb.dao");
const cartsDaoFactory = require("../daos/factories/carts-dao.factory");
const UsersDto = require("../entities/dtos/user.dto");
const { hashPassword, comparePasswords } = require("../utils/passwords.js");
const { roles, role } = require("../utils/constants");
const { logger } = require("../utils/middlewares/logger.middleware.js");
const {
  CustomError,
  ErrorCodes,
  ErrorMsgs,
  ErrorTypes,
} = require("../utils/handlers/custom-error");
const MailAdapter = require("../utils/mail.adapter.js");
const CartDto = require("../entities/dtos/cart.dto.js");

const usersDao = new UsersMongoDBDao();
const cartsDao = cartsDaoFactory();
const mailAdapter = new MailAdapter();
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
    logger.error(error);
    throw error;
  }
};

service.findById = async (uid) => {
  try {
    const user = await usersDao.findById(uid);
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.findOne = async (username) => {
  try {
    const user = await usersDao.findOne({ username });
    return user;
  } catch (error) {
    logger.error(error);
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
    logger.info(`Creando ${username}`);

    logger.info(`Validando que ${username} no exista.`);
    const validateUser = await usersDao.findOne({ username });

    if (validateUser) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        cause: "Este nombre de usuario ya esta en uso",
        code: ErrorCodes.RESOURSE_ALREADY_EXISTS,
        message: ErrorMsgs.RESOURSE_ALREADY_EXISTS,
      });
    }

    logger.info(`Validando el rol de ${username}`);
    if (!roles().includes(role)) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        code: ErrorCodes.INVALID_ROLE,
        message: ErrorMsgs.INVALID_ROLE,
      });
    }

    logger.info(`Se registra usuario ${username} en la base de datos`);
    const newUserInfo = new UsersDto(
      username,
      email,
      hashPassword(password),
      firstName,
      lastName,
      null,
      [],
      role
    );

    const createdUser = await usersDao.create(newUserInfo);

    logger.info(`Se crea carrito de compras para ${username}`);
    const newCartInfo = new CartDto(createdUser._id);
    const newUserCart = await cartsDao.create(newCartInfo);

    logger.info(`Se actualiza carrito para ${username}`);
    newUserInfo.cart = newUserCart._id;
    const updtUser = await usersDao.updateOne(createdUser._id, newUserInfo);
    logger.info(`Se actualizo carrito para ${username} exitosamente`);
    logger.info(`${JSON.stringify(updtUser)}`);

    const updatedUser = await usersDao.findById(createdUser._id);

    /*     if (createdUser) {
      await mailAdapter.sendMail({
        userEmail: createdUser.email,
        subjectMail: `Te damos la bienvenida ${createdUser.firstName}!!!`,
        bodyMail: `
        Nos da gusto tenerte en nuestro equipo...

        Ya tenes tu cuenta activada para que difrutes de los mejores precios!!.

        Ante cualquier consulta estamos a disposición desde nuestro equipo de soporte!.
        Contactate al siguiente numero: +51 9 011 123-4567.
        `,
      });
    } */

    logger.info(`Usuario ${username} creado con exito.`);
    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.login = async (email, password) => {
  try {
    logger.info(`Login user con email ${email}`);

    const currentUser = await usersDao.findOne({ email });

    if (!currentUser) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        message: ErrorMsgs.INVALID_CREDENTIALS,
        code: ErrorCodes.INVALID_CREDENTIALS,
        cause: "Email no encontrado",
      });
    }

    const result = comparePasswords(password, currentUser.password);

    if (!result) {
      CustomError.create({
        name: ErrorTypes.CREATE_USER_VALIDATION,
        message: ErrorMsgs.INVALID_CREDENTIALS,
        code: ErrorCodes.INVALID_CREDENTIALS,
        cause: "password incorrecta",
      });
    }

    const updtUserInfo = new UsersDto(
      currentUser.username,
      currentUser.email,
      currentUser.password,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.cart,
      currentUser.documents,
      currentUser.role,
      new Date()
    );

    logger.info("Registrando login de usuario");
    const updtUser = await usersDao.updateOne(currentUser._id, updtUserInfo);

    const updatedUser = await usersDao.findById(currentUser._id);

    logger.info(`Usuario ${updatedUser.username} logueado`);
    logger.info(JSON.stringify(updtUser));

    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.addDocuments = async (uid, documents) => {
  try {
    const currentUser = (await usersDao.findById(uid)).toJSON();

    if (!currentUser) return;

    logger.info(`Agregando documento/s al usuario ${currentUser.username}`);

    const { profiles, addressProof, accountProof } = documents;
    const newDocuments = [];
    const currentDocument = currentUser.documents;

    if (profiles) {
      newDocuments.push({
        name: document.filename,
        reference: document.path,
        docType: "profile",
      });
    }
    if (accountProof) {
      newDocuments.push({
        name: document.filename,
        reference: document.path,
        docType: "account",
      });
    }
    if (addressProof) {
      newDocuments.push({
        name: document.filename,
        reference: document.path,
        docType: "address",
      });
    }

    const updtUserInfo = new UsersDto(
      currentUser.username,
      currentUser.email,
      currentUser.password,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.cart,
      currentDocument.concat(newDocuments),
      currentUser.role,
      currentUser.lastConnection
    );

    const updtUser = await usersDao.updateOne(currentUser._id, updtUserInfo);

    const updatedUser = await usersDao.findById(currentUser._id);

    logger.info(`Documento/s agregados a ${updatedUser.username}`);
    logger.info("result: ", JSON.stringify(updtUser));

    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.updateUser = async (uid, userInfo) => {
  try {
    logger.info(`Validando usuario para actualizar ${uid}`);
    const currentUser = await usersDao.findOne({ _id: uid });

    if (!currentUser) {
      logger.error("Not found");
      return;
    }

    logger.info(`Actualizando usuario ${currentUser.username}`);
    const updtUserInfo = new UsersDto();

    updtUserInfo.username = userInfo.username || currentUser.username;
    updtUserInfo.email = userInfo.email || currentUser.email;
    updtUserInfo.password = currentUser.password;
    updtUserInfo.firstName = userInfo.firstName || currentUser.firstName;
    updtUserInfo.lastName = userInfo.lastName || currentUser.lastName;
    updtUserInfo.cart = userInfo.cart || currentUser.cart._id;
    updtUserInfo.documents = currentUser.documents;
    updtUserInfo.role = userInfo.role || currentUser.role;
    updtUserInfo.lastConnection = currentUser.lastConnection;

    const result = await usersDao.updateOne(currentUser._id, updtUserInfo);

    logger.info(`Usuario ${currentUser.username} actualizado`);
    logger.info(`${JSON.stringify(result)}`);

    const updatedUser = await usersDao.findById(currentUser._id);

    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.updateToPremium = async (uid) => {
  try {
    const currentUser = await usersDao.findById(uid);

    if (!currentUser) {
      return;
    }

    logger.info(
      `Actualizando cuenta del usuario ${currentUser.username} to premium`
    );

    const currentRole = currentUser.role;

    if (currentRole === role.premiumUsr) {
      throw new Error("El usuario ya es premium");
    }

    // Aca deberia procesar el pago
    logger.info(`Procesando el pago para subir a categoria premium`);

    // Aca debo verificar que se proceso el pago
    logger.info(`Pago procesado con exito`);

    logger.info(`Actualizando estado de la cuenta`);
    const userInfo = new UsersDto(
      currentUser.username,
      currentUser.email,
      currentUser.password,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.cart,
      role.premiumUsr,
      currentUser.lastConnection
    );

    const updtUser = await usersDao.updateOne(currentUser._id, userInfo);

    const updatedUser = await usersDao.findById(currentUser._id);

    logger.info(
      `Usuario ${updatedUser.username} actualizado a premium con exito`
    );
    logger.info(JSON.stringify(updtUser));

    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.getSessions = async () => {
  try {
    logger.info(
      `Consultando los usuarios que no se conectaron los ultimos 2 dias.`
    );

    const lastDays = new Date();
    lastDays.setDate(lastDays.getDate() - 2);

    const users = await usersDao.find({ lastConnection: { $lt: lastDays } });

    return users;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.deleteInactiveUsers = async () => {
  try {
    const batchErrors = [];
    let rowsAffected = 0;

    const lastDays = new Date();
    lastDays.setDate(lastDays.getDate() - 2);

    const users = await usersDao.find({ lastConnection: { $lt: lastDays } });

    logger.info(`Eliminando los usuarios inactivos, total: ${users.length}`);
    for (let i = 0; i < users.length; i++) {
      const user = users[i].toJSON();

      try {
        logger.info(`Eliminando usuario ${user.username}`);
        const result = await usersDao.delete(user._id);
        rowsAffected++;

        logger.info(`Usuario ${user.username} borrado permanentemente`);
        logger.info(JSON.stringify(result));

        logger.info(`Enviando mail al usuario ${user.username}`);
        await mailAdapter.sendMail({
          userEmail: user.email,
          subjectMail: `COMUNICADO IMPORTANTE ${user.firstName}!!!`,
          bodyMail: `
        Lamentamos que esto deba ser asi.

        Tu cuenta fue eliminada debido a inactividad!!.

        Pero no te preocupes, podes volver a registrarte en cualquier momento que desees.
        Si crees que esto fue un error, contactate al siguiente numero: +51 9 011 123-4567.

        QEPD: ${user.username}

        Adios vaquero...
        `,
        });
      } catch (error) {
        logger.error(`Error eliminando ${user.username}`);
        batchErrors.push({ user: user.username, error: error.message });
      }
    }

    logger.info(`Usuarios procesados: ${users.length}`);

    const response = {
      rowsAffected,
      batchErrors,
    };

    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = service;
