const CartDto = require("../entities/dtos/cart.dto");
const CartsRepository = require("../entities/repositories/carts.repository");
const ProductsRepository = require("../entities/repositories/products.repository");
const { logger } = require("../utils/middlewares/logger.middleware.js");

const {
  CustomError,
  ErrorCodes,
  ErrorMsgs,
  ErrorTypes,
} = require("../utils/handlers/custom-error");

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const service = {};

service.findById = async (cid) => {
  try {
    const cart = await cartsRepository.findById(cid);
    return cart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.create = async (user, products = []) => {
  try {
    const cartInfo = new CartDto(user, products);
    const newCart = await cartsRepository.create(cartInfo);
    return newCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.addProduct = async (cid, pid, quantity = 0) => {
  try {
    const newProduct = {
      pid,
      quantity,
    };

    const product = await productsRepository.findById(pid);

    if (!product) {
      throw new Error("El producto no existe.");
    }

    const currentCart = (await cartsRepository.find({ _id: cid })).pop();

    if (!currentCart) {
      throw new Error("El carrito no existe.");
    }

    const searchIdx = currentCart.products.findIndex((cartProd) =>
      Object.is(cartProd.pid.toString(), pid)
    );

    if (searchIdx >= 0) {
      if (product.stock < newProduct.quantity) {
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
        });
      }
      currentCart.products[searchIdx].quantity = newProduct.quantity;
    } else {
      if (product.stock < newProduct.quantity) {
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
        });
      }
      currentCart.products.push(newProduct);
    }

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = await cartsRepository.find({ _id: cid });

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.createTicket = async (cid) => {
  try {
    const cart = await cartsRepository.findById(cid);
    const cartProducts = cart.products;

    if (!cart) {
      throw new Error("No se encontro el carrito.");
    }

    if (cart.products.length === 0) {
      CustomError.create({
        name: ErrorTypes.CREATE_CART_VALIDATION,
        message: ErrorMsgs.EMPTY_FIELD,
        code: ErrorCodes.EMPTY_FIELD,
        cause: "La lista de productos esta vacia",
      });
    }

    for (let i = 0; i < cartProducts.length; i++) {
      const currentProduct = cartProducts[i].pid;

      const product = await productsRepository.findById(
        currentProduct._id.toString()
      );

      if (currentProduct.stock >= product.stock) {
        CustomError.create({
          name: ErrorTypes.CREATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
          cause: `El producto de codigo ${product.code} no tiene stock suficiente.`,
        });
      }

      const currentStock = currentProduct.stock;
      const realStock = product.stock;
      const newStock = Math.abs(realStock - currentStock);
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.updateProduct = async (cid, pid, quantity = 0) => {
  try {
    const updtProduct = {
      pid,
      quantity,
    };

    const product = await productsRepository.findById(pid);

    if (!product) {
      throw new Error("El producto no existe.");
    }

    const currentCart = (await cartsRepository.find({ _id: cid })).pop();

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
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
        });
      }
      currentCart.products[searchIdx].quantity = sum;
    } else {
      if (product.stock < updtProduct.quantity) {
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
        });
      }
      currentCart.products.push(updtProduct);
    }

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = await cartsRepository.find({ _id: cid });

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.update = async (cid, products) => {
  try {
    if (!products) {
      CustomError.create({
        name: ErrorTypes.UPDATE_CART_VALIDATION,
        message: ErrorMsgs.EMPTY_FIELD,
        code: ErrorCodes.EMPTY_FIELD,
        cause: "No se recibio la lista de productos.",
      });
    }

    for (let index = 0; index < products.length; index++) {
      const cartProd = products[index];
      const prod = await productsRepository.findById(cartProd.pid);

      if (!prod) {
        throw new Error(`El producto con id ${cartProd.pid} no existe.`);
      }

      if (prod.status === false) {
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.RESOURSE_NOT_AVAILABLE,
          code: ErrorCodes.RESOURSE_NOT_AVAILABLE,
          cause: `El producto con id ${cartProd.pid} no se encuentra disponible.`,
        });
      }

      if (prod.stock < cartProd.quantity) {
        CustomError.create({
          name: ErrorTypes.UPDATE_CART_VALIDATION,
          message: ErrorMsgs.STOCK_NOT_AVAILABLE,
          code: ErrorCodes.STOCK_NOT_AVAILABLE,
          cause: `El producto con id ${cartProd.pid} no cuenta con stock suficiente.`,
        });
      }
    }

    const updtResult = await cartsRepository.updateOne(cid, { products });

    if ((updtResult.matchedCount = 0)) {
      throw new Error("Carrito no encontrado.");
    }

    const updatedCart = (await cartsRepository.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.delete = async (cid) => {
  try {
    const currentCart = (await cartsRepository.find({ _id: cid })).pop();

    if (!currentCart) {
      throw new Error("El carrito no existe.");
    }

    currentCart.products = [];

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = (await cartsRepository.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.deleteProduct = async (cid, pid) => {
  try {
    const currentCart = (await cartsRepository.find({ _id: cid })).pop();

    const productsFiltered = currentCart.products.filter(
      (cartProd) => !Object.is(cartProd.pid.toString(), pid)
    );

    currentCart.products = productsFiltered;

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = (await cartsRepository.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = service;
