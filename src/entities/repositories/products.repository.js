class ProductsRepository {
  constructor(daoInstance) {
    this.dao = daoInstance;
  }

  async find(filter = {}, limit = 10, page = 1, sort = {}) {
    return await this.dao.find(filter, limit, page, sort);
  }

  async findById(pid) {
    return await this.dao.findById(pid);
  }

  async create(newProductInfo) {
    return await this.dao.create(newProductInfo);
  }

  async updateOne(_id, updtProductInfo) {
    return await this.dao.updateOne(_id, updtProductInfo);
  }

  async delete(_id) {
    return await this.dao.deleteOne(_id);
  }
}

module.exports = ProductsRepository;
