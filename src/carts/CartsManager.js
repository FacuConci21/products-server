const fs = require("fs");
const join = require("path").join;

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

    const search = this.#_carts.filter((cart) => cart.id === id);

    if (search.length === 0) {
      throw new Error(`[getCartById] Carrito con id #${id} no encontrado.`);
    }

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