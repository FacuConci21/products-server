const Tickets = require("../../entities/models/tickets.model");

class TicketsMongoDBDao {
  async find(filter = {}) {
    return await Tickets.find(filter);
  }

  async findById(tid) {
    return await Tickets.findById(tid);
  }

  async create(newTicketInfo) {
    return await Tickets.create(newTicketInfo);
  }

  async updateOne(_id, updtTicketInfo) {
    return await Tickets.updateOne({ _id }, updtTicketInfo);
  }

  async delete(_id) {
    return await Tickets.deleteOne({ _id });
  }
}

module.exports = TicketsMongoDBDao;
