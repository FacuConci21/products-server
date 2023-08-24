const Carts = require("./models/cart.model");

class CartsDao {
  async find() {
    return await Carts.find();
  }
  
  async findById(cid) {
    return await Carts.findById(cid).populate('products.pid');
  }

  async create(newCartInfo) {
    return await Carts.create(newCartInfo);
  }

  async updateOne(_id, updtCartInfo) {
    return await Carts.updateOne({ _id }, updtCartInfo);
  }

  async delete(_id) {
    return await Carts.deleteOne({ _id });
  }
}

module.exports = CartsDao;
