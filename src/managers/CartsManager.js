const fs = require("fs");
const join = require("path").join;
const ProductsManager = require("./ProductManager");

const productsManager = new ProductsManager("files");

class CartManager {
  #_filename = "Carts.json";
  #_carts = [];
  #_lastId = 0;

  constructor(path) {
    this._path = join(process.cwd(), "src", path);
    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path);
    }
  }

  async addCart(cart) {
    await this.getCarts();

    if (!cart.products || cart.products.length === 0) {
      throw new Error(
        `[addCart] No se recibio lista de productos o esta vacia`
      );
    }

    this.#_lastId++;
    const newCart = {
      id: this.#_lastId,
      ...cart,
    };

    this.#_carts.push(newCart);

    await this.#save();

    console.log(`[addCart] Nuevo carrito agregado! #${this.#_lastId} :D`);

    return newCart;
  }

  async addProductCart(cid, product) {
    await this.getCarts();

    const cartIdx = this.#_carts.findIndex((_cart) => _cart.id === cid);

    if (cartIdx < 0) {
      throw new Error(`[addProductCart] Carrito con id #${cid} no encontrado.`);
    }

    const inStock = await productsManager.inStock(product.pid, product.quantity);
    
    if (!inStock) {
      throw new Error(`[addProductCart] El producto #${product.pid} no cuenta con el stock sufiente.`);
    }

    const productIdx = this.#_carts[cartIdx].products.findIndex(
      (_prod) => _prod.pid === product.pid
    );

    if (productIdx >= 0) {
      this.#_carts[cartIdx].products[productIdx].quantity = product.quantity;
      console.log(
        `[addProductCart] Se actualizo la cantidad del producto #${product.pid} al carrito #${cid}`
      );
    } else {
      this.#_carts[cartIdx].products.push(product);
      console.log(
        `[addProductCart] Nuevo producto #${product.pid} agregado al carrito #${cid}`
      );
    }

    await this.#save();

    return this.#_carts[cartIdx];
  }

  async getCarts() {
    const fd = join(this._path, this.#_filename);

    if (!fs.existsSync(fd)) {
      await this.#save();
    }

    const data = await fs.promises.readFile(fd, "utf-8");
    this.#_carts = JSON.parse(data);
    this.#_lastId =
      this.#_carts.sort((a, b) => a.id - b.id)[this.#_carts.length - 1]?.id ||
      0;

    return this.#_carts;
  }

  async getCartById(id) {
    if (id < 0) {
      throw new Error(`[getCartById] El id indicado no puede ser negativo.`);
    }

    await this.getCarts();

    const search = this.#_carts.find((cart) => cart.id === id);

    if (!search) {
      throw new Error(`[getCartById] Carrito con id #${id} no encontrado.`);
    }

    const productIds = [];

    search.products.forEach((prodCart) => {
      productIds.push(prodCart.pid);
    });

    search.products = await productsManager.getProductsById(productIds);

    return search;
  }

  async #save() {
    try {
      await fs.promises.writeFile(
        join(this._path, this.#_filename),
        JSON.stringify(this.#_carts || [])
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CartManager;
