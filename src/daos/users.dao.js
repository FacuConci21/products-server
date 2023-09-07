const Users = require("./models/users.model");

class UsersDao {
  async find(filter) {
    return await Users.find(filter);
  }

  async findOne(filter) {
    return await Users.findOne(filter).populate('cart');
  }

  async findById(uid) {
    return await Users.findById(uid).populate('cart');
  }

  async create(newUserInfo) {
    return await Users.create(newUserInfo);
  }

  async updateOne(_id, updtUserInfo) {
    return await Users.updateOne({ _id }, updtUserInfo);
  }

  async delete(_id) {
    return await Users.deleteOne({ _id });
  }
}

module.exports = UsersDao;
