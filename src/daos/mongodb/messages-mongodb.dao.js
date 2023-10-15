const Messages = require("../../entities/models/messages.model");

class MessagesMongoDBDao {
  async find(limit = 8) {
    return await Messages.aggregate([
      { $sort: { _id: -1 } },
      { $limit: limit },
      { $sort: { _id: 1 } },
    ]);
  }

  async create(newMessageInfo) {
    return await Messages.create(newMessageInfo);
  }

  async updateOne(_id, updtMessageInfo) {
    return await Messages.updateOne({ _id }, updtMessageInfo);
  }

  async delete(_id) {
    return await Messages.deleteOne({ _id });
  }
}

module.exports = MessagesMongoDBDao;
