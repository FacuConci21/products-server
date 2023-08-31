const Products = require("./models/products.model");

class ProductsDao {
  async find(filter = {}, limit = 10, page = 1, sort = {}) {
    return await Products.paginate(filter, { limit, page, sort });
  }

  async findById(pid) {
    return await Products.findById(pid);
  }

  async create(newProductInfo) {
    return await Products.create(newProductInfo);
  }

  async updateOne(_id, updtProductInfo) {
    return await Products.updateOne({ _id }, updtProductInfo);
  }

  async delete(_id) {
    return await Products.deleteOne({ _id });
  }
}

module.exports = ProductsDao;
