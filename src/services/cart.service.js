const { join } = require("path");
const CartsDao = require("../daos/carts.dao");
const cartsDao = new CartsDao();

const service = {};

service.findById = async (cid) => {
  try {
    const cart = await cartsDao.findById(cid);
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (products = []) => {
  try {
    const cartInfo = { products };
    const newCart = await cartsDao.create(cartInfo);
    return newCart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.addProduct = async (cid, pid, quantity = 0) => {
  try {
    const newProduct = {
      pid,
      quantity,
    };

    const currentCart = await cartsDao.find({ _id: cid });

    currentCart.products.push(newProduct);

    const updtResult = await cartsDao.updateOne(cid, currentCart);

    const updatedCart = await cartsDao.find({ _id: cid });

    return updatedCart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.update = async (pid) => {
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.delete = async (pid) => {
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.permaDelete = async (pid) => {
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
