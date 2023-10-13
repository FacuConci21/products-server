const { join } = require("path");
const CartsMongoDBDao = require("../daos/mongodb/carts-mongodb.dao");
const ProductsMongoDBDao = require("../daos/mongodb/products-mongodb.dao");

const cartsDao = new CartsMongoDBDao();
const productsDao = new ProductsMongoDBDao();
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
      if (product.stock < newProduct.quantity) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products[searchIdx].quantity = newProduct.quantity;
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

service.updateProduct = async (cid, pid, quantity = 0) => {
  try {
    const updtProduct = {
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
      const sum =
        currentCart.products[searchIdx].quantity + updtProduct.quantity;
      if (product.stock < sum) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products[searchIdx].quantity = sum;
    } else {
      if (product.stock < updtProduct.quantity) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products.push(updtProduct);
    }

    const updtResult = await cartsDao.updateOne(cid, currentCart);

    const updatedCart = await cartsDao.find({ _id: cid });

    return updatedCart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.update = async (cid, products) => {
  try {
    if (!products) {
      throw new Error("No se recibio la lista de productos.");
    }

    for (let index = 0; index < products.length; index++) {
      const cartProd = products[index];
      const prod = await productsDao.findById(cartProd.pid);

      if (!prod) {
        throw new Error(`El producto con id ${cartProd.pid} no existe.`);
      }

      if (prod.status === false) {
        throw new Error(
          `El producto con id ${cartProd.pid} no se encuentra disponible.`
        );
      }

      if (prod.stock < cartProd.quantity) {
        throw new Error(
          `El producto con id ${cartProd.pid} no cuenta con stock suficiente.`
        );
      }
    }

    const updtResult = await cartsDao.updateOne(cid, { products });

    if ((updtResult.matchedCount = 0)) {
      throw new Error("Carrito no encontrado.");
    }

    const updatedCart = (await cartsDao.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.delete = async (cid) => {
  try {
    const currentCart = (await cartsDao.find({ _id: cid })).pop();

    if (!currentCart) {
      throw new Error("El carrito no existe.");
    }

    currentCart.products = [];

    const updtResult = await cartsDao.updateOne(cid, currentCart);

    const updatedCart = (await cartsDao.find({ _id: cid })).pop();

    return updatedCart;
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
