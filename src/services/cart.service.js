const { join } = require("path");
const ProductsDao = require("../daos/products.dao");
const CartsDao = require("../daos/carts.dao");
const cartsDao = new CartsDao();
const productsDao = new ProductsDao();

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

    const product = await productsDao.findById(pid);

    if (!product) {
      throw new Error("El producto no existe.");
    }

    const currentCart = (await cartsDao.find({ _id: cid })).pop();

    if (!currentCart) {
      throw new Error("El carrito no existe.");
    }

    const searchIdx = currentCart.products.findIndex((cartProd) =>
      Object.is(cartProd.pid.toString(), pid)
    );

    if (searchIdx >= 0) {
      const quantitySum =
        currentCart.products[searchIdx].quantity + newProduct.quantity;
      if (product.stock < quantitySum) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products[searchIdx].quantity = quantitySum;
    } else {
      if (product.stock < newProduct.quantity) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products.push(newProduct);
    }

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

service.deleteProduct = async (cid, pid) => {
  try {
    const currentCart = (await cartsDao.find({ _id: cid })).pop();

    const productsFiltered = currentCart.products.filter(
      (cartProd) => !Object.is(cartProd.pid.toString(), pid)
    );

    currentCart.products = productsFiltered;

    const updtResult = await cartsDao.updateOne(cid, currentCart);

    const updatedCart = (await cartsDao.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
