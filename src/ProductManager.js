const fs = require("fs");
const join = require("path").join;

class ProductManager {
  #_filename = "Products.json";

  constructor(path, products = []) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    this._path = join(__dirname, path);
    this._products = products;
    this._lastId =
      products.sort((a, b) => a.id - b.id)[products.length - 1]?.id || 0;
  }

  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("[addProduct] faltan uno o mas campos obligatorios >:(");
      return;
    }

    const search = this._products.find((product) => product.code === code);

    if (search) {
      console.error(
        `[addProduct] Ya existe un producto con el codigo #${code} ingresado :/`
      );
      return;
    }

    this._lastId++;
    const newProduct = {
      id: this._lastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this._products.push(newProduct);

    await this.#save();

    console.log(`[addProduct] Nuevo producto agregado! #${this._lastId} :D`);
  }

  async getProducts(limit) {
    const fd = join(this._path, this.#_filename);

    if (!fs.existsSync(fd)) {
      await this.#save();
    }

    const data = await fs.promises.readFile(fd, "utf-8");
    this._products = JSON.parse(data);
    this._lastId =
      this._products.sort((a, b) => a.id - b.id)[this._products.length - 1]
        ?.id || 0;

    // Si limit es undefined, slice se extiende hasta el final.
    return this._products.slice(0, Math.abs(limit));
  }

  async getProductById(id) {
    if (id < 0) {
      throw new Error(`[getProductById] El id indicado no puede ser negativo.`)
    }
    await this.getProducts();

    const search = this._products.find((product) => product.id === id);

    if (!search) {
      throw new Error(`[getProductById] Id #${id} not found :(`);
    }

    return search;
  }

  async updateProduct(id, updtProduct) {
    const { title, description, price, thumbnail, code, stock } = updtProduct;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("[updateProduct] faltan uno o mas campos obligatorios >:(");
      return;
    }

    await this.getProducts();

    const productIndx = this._products.findIndex(
      (product) => product.id === id
    );

    if (productIndx < 0) {
      console.error(`[updateProduct] Id #${id} not found :(`);
      return;
    }

    const search = this._products.find(
      (product) => product.code === updtProduct.code && product.id !== id
    );

    if (search) {
      console.error(
        `[updateProduct] Ya existe un producto con el codigo #${code} ingresado :/`
      );
      return;
    }

    this._products[productIndx].title = title;
    this._products[productIndx].description = description;
    this._products[productIndx].price = price;
    this._products[productIndx].thumbnail = thumbnail;
    this._products[productIndx].code = code;
    this._products[productIndx].stock = stock;

    await this.#save();

    console.log(`[updateProduct] Producto con id #${id} fue actualizado :)`);
    return this._products[productIndx];
  }

  async deleteProduct(id) {
    await this.getProducts();

    const productIndx = this._products.findIndex(
      (product) => product.id === id
    );

    if (productIndx < 0) {
      console.error(`[deleteProduct] Id #${id} not found :(`);
      return;
    }

    const filteredProducts = this._products.filter(
      (product) => product.id !== id
    );
    this._products = filteredProducts;

    await this.#save();

    console.log(`[deleteProduct] Id #${id} fue eliminado >:)`);
  }

  async #save() {
    try {
      await fs.promises.writeFile(
        join(this._path, this.#_filename),
        JSON.stringify(this._products || [])
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ProductManager;
