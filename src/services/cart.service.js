const CartDto = require("../entities/dtos/cart.dto");
const ProductDto = require("../entities/dtos/product.dto");
const CartsRepository = require("../entities/repositories/carts.repository");
const ProductsRepository = require("../entities/repositories/products.repository");

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const service = {};

service.findById = async (cid) => {
  try {
    const cart = await cartsRepository.findById(cid);
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (user, products = []) => {
  try {
    const cartInfo = new CartDto(user, products);
    const newCart = await cartsRepository.create(cartInfo);
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
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products[searchIdx].quantity = newProduct.quantity;
    } else {
      if (product.stock < newProduct.quantity) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products.push(newProduct);
    }

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = await cartsRepository.find({ _id: cid });

    return updatedCart;
  } catch (error) {
    console.error(error);
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
      throw new Error("La lista de productos esta vacia.");
    }

    for (let i = 0; i < cartProducts.length; i++) {
      const currentProduct = cartProducts[i].pid;

      const product = await productsRepository.findById(
        currentProduct._id.toString()
      );

      if (currentProduct.stock >= product.stock) {
        throw new Error(
          `El producto de codigo ${product.code} no tiene stock suficiente.`
        );
      }

      const currentStock = currentProduct.stock;
      const realStock = product.stock;
      const newStock = Math.abs(realStock - currentStock);
    }
    
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
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products[searchIdx].quantity = sum;
    } else {
      if (product.stock < updtProduct.quantity) {
        throw new Error("No hay stock suficiente.");
      }
      currentCart.products.push(updtProduct);
    }

    const updtResult = await cartsRepository.updateOne(cid, currentCart);

    const updatedCart = await cartsRepository.find({ _id: cid });

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
      const prod = await productsRepository.findById(cartProd.pid);

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

    const updtResult = await cartsRepository.updateOne(cid, { products });

    if ((updtResult.matchedCount = 0)) {
      throw new Error("Carrito no encontrado.");
    }

    const updatedCart = (await cartsRepository.find({ _id: cid })).pop();

    return updatedCart;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    throw error;
  }
};

module.exports = service;
