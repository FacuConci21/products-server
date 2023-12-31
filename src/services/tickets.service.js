const TicketDto = require("../entities/dtos/ticket.dto");
const TicketsRepository = require("../entities/repositories/tickets.repository");
const productsService = require("../services/products.service.js");
const cartsService = require("../services/cart.service.js");
const usersService = require("../services/users.service.js");
const { logger } = require("../utils/middlewares/logger.middleware.js");

const ticketRepository = new TicketsRepository();
const service = {};

service.find = async () => {
  try {
    return await ticketRepository.find();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.findByCode = async (code) => {
  try {
    return await ticketRepository.find({ code });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.create = async (cid) => {
  try {
    const products = [];
    const productsOk = [];

    logger.info(`Validando carrito ${cid}`);
    const userCart = (await cartsService.findById(cid)).toJSON();

    if (!userCart) {
      return;
    }

    const user = userCart.user;

    if (!user.email) {
      throw new Error("El usuario no posee email cargado");
    }

    logger.info("Iniciando compra para el usuario: " + user.username);

    logger.info(`Validando productos del carrito, user: ${user.username}`);
    if (userCart.products.length <= 0) {
      throw new Error("La lista de productos esta vacia.");
    }

    logger.info(`Procesando productos del carrito, user: ${user.username}`);
    for (let i = 0; i < userCart.products.length; i++) {
      const product = userCart.products[i].pid;
      const quantity = userCart.products[i].quantity;

      if (product.stock < quantity) {
        products.push({
          product,
          quantity: userCart.products[i].quantity,
          message: "No hay suficiente stock.",
        });
      } else {
        productsOk.push({ quantity, ...product });
      }
    }

    const prices = productsOk.map((product) => product.price * product.quantity);
    const amount = prices.reduce((a, b) => a + b, 0);

    logger.info("Creando ticket de compra para el usuario: " + user.username);
    const newTicketInfo = new TicketDto(
      new Date(),
      amount,
      user.email,
      productsOk.map((product) => {
        return {
          title: product.title,
          price: product.price,
          code: product.code,
          quantity: product.quantity,
        };
      })
    );
    const newTicket = await ticketRepository.create(newTicketInfo);

    logger.info("Actualizando carrito del usuario: " + user.username);
    const updtCart = await cartsService.update(cid, products);
    logger.info(JSON.stringify(updtCart));

    const updatedCart = await cartsService.findById(cid);

    logger.info(
      `Agregando ticket ${newTicket.code} al usuario: ${user.username}`
    );
    user.tickets.push(newTicket.code);
    const updtUser = await usersService.updateUser(user._id, user);
    logger.info(JSON.stringify(updtUser));

    logger.info(`Actualizando stock de los productos`);
    for (let i = 0; i < productsOk.length; i++) {
      const product = productsOk[i];
      const newStock = product.stock - product.quantity;
      const result = await productsService.updateStock(product._id, newStock);
      logger.info(JSON.stringify(result));
    }

    const response = {
      ticket: newTicket,
      errorProducts: products,
      updatedCart,
    };

    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.updateOne = async (tid, updtTicketInfo) => {
  try {
    return await ticketRepository.updateOne(tid, updtTicketInfo);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.delete = async (tid) => {
  try {
    return await ticketRepository.deleteOne(tid);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = service;
