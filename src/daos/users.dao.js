const Users = require("./models/users.model");

class UsersDao {
  async find() {
    return await Users.find();
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
