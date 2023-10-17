const TicketsMongoDBDao = require("../../daos/mongodb/ticket-mongodb.dao");

class TicketsRepository {
  constructor() {
    this.dao = new TicketsMongoDBDao();
  }

  async find(filter = {}) {
    return await this.dao.find(filter);
  }

  async findById(tid) {
    return await this.dao.findById(tid);
  }

  async create(newTicketInfo) {
    return await this.dao.create(newTicketInfo);
  }

  async updateOne(_id, updtTicketInfo) {
    return await this.dao.updateOne(_id, updtTicketInfo);
  }

  async delete(_id) {
    return await this.dao.deleteOne(_id);
  }
}

module.exports = TicketsRepository;
