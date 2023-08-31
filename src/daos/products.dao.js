const Products = require("./models/products.model");

class ProductsDao {
  async find(filter = {}) {
    return await Products.find(filter);
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