const cartsDaoFactory = require("../../daos/factories/carts-dao.factory");

class CartsRepository {
  constructor() {
    this.dao = cartsDaoFactory();
  }

  async find(filter) {
    return await this.dao.find(filter);
  }

  async findById(cid) {
    return await this.dao.findById(cid);
  }

  async create(newCartInfo) {
    return await this.dao.create(newCartInfo);
  }

  async updateOne(_id, updtCartInfo) {
    return await this.dao.updateOne(_id, updtCartInfo);
  }

  async delete(_id) {
    return await this.dao.deleteOne(_id);
  }
}

module.exports = CartsRepository;