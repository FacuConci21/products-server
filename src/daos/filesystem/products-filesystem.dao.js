const fs = require("fs");
const join = require("path").join;

class ProductFsDao {
  #_filename = "Products.json";
  #_products = [];
  #_lastId = 0;

  constructor(path) {
    this._path = join(process.cwd(), "src", path);
    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path);
    }
    this.getProducts();
  }

  async addProduct(pProduct) {
    const search = this.#_products.find(
      (_product) => _product.code === pProduct.code
    );

    if (search) {
      throw new Error(
        `[addProduct] Ya existe un producto con el codigo #${search.code} ingresado :/`
      );
    }

    this.#_lastId++;
    const newProduct = {
      id: this.#_lastId,
      ...pProduct,
    };

    this.#_products.push(newProduct);

    await this.#save();

    console.log(`[addProduct] Nuevo producto agregado! #${this.#_lastId} :D`);

    return newProduct;
  }

  async getProducts(limit = NaN) {
    const fd = join(this._path, this.#_filename);

    if (!fs.existsSync(fd)) {
      await this.#save();
    }

    const data = await fs.promises.readFile(fd, "utf-8");
    this.#_products = JSON.parse(data);
    this.#_lastId =
      this.#_products.sort((a, b) => a.id - b.id)[this.#_products.length - 1]
        ?.id || 0;

    limit = Object.is(limit, NaN) ? undefined : Math.abs(limit);
    const prodSlice = this.#_products.slice(0, limit);

    return prodSlice;
  }

  async getProductById(id) {
    if (id < 0) {
      throw new Error(`[getProductById] El id indicado no puede ser negativo.`);
    }
    await this.getProducts();

    const search = this.#_products.find((product) => product.id === id);

    if (!search) {
      throw new Error(`[getProductById] Id #${id} not found :(`);
    }

    return search;
  }

  async getProductsById(ids = []) {
    await this.getProducts();

    const productsResult = [];

    ids.forEach((productId) => {
      const search = this.#_products.find(
        (product) => product.id === productId
      );
      if (search) {
        productsResult.push(search);
      }
    });

    return productsResult;
  }

  async updateProduct(id, updtProduct) {
    await this.getProducts();

    const productIndx = this.#_products.findIndex(
      (product) => product.id === id
    );

    if (productIndx < 0) {
      throw new Error(`[updateProduct] Id #${id} not found :(`);
    }

    const search = this.#_products.find(
      (product) => product.code === updtProduct.code && product.id !== id
    );

    if (search) {
      throw new Error(
        `[updateProduct] Ya existe un producto con el codigo #${updtProduct.code} ingresado :/`
      );
    }

    // En esta linea limpio el objeto updtProduct de propiedades undefined
    // y asi hacer funcionar correctamente Object.assign().
    updtProduct = JSON.parse(JSON.stringify(updtProduct));

    this.#_products[productIndx] = Object.assign(
      this.#_products[productIndx],
      updtProduct
    );

    // Valor por defecto del campo status
    if (!this.#_products[productIndx].status) {
      this.#_products[productIndx].status = true;
    }

    await this.#save();

    console.log(`[updateProduct] Producto con id #${id} fue actualizado :)`);
    return this.#_products[productIndx];
  }

  async deleteProduct(id) {
    await this.getProducts();

    const deleteProduct = this.#_products.find((product) => product.id === id);

    if (!deleteProduct) {
      throw new Error(`[deleteProduct] Id #${id} not found :(`);
    }

    const filteredProducts = this.#_products.filter(
      (product) => product.id !== id
    );
    this.#_products = filteredProducts;

    await this.#save();

    console.log(`[deleteProduct] Id #${id} fue eliminado >:)`);
    return deleteProduct;
  }

  async inStock(id, stock = 1) {
    await this.getProducts();

    const product = await this.getProductById(id);

    const inStock = product.stock >= stock;

    return inStock;
  }

  async #save() {
    try {
      await fs.promises.writeFile(
        join(this._path, this.#_filename),
        JSON.stringify(this.#_products || [])
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ProductFsDao;
