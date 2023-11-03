const TicketDto = require("../entities/dtos/ticket.dto");
const TicketsRepository = require("../entities/repositories/tickets.repository");
const { logger } = require("../utils/middlewares/logger.middleware.js");

const ticketRepository = new TicketsRepository();
const service = {};

service.find = async () => {
  try {
    return await ticketRepository.find();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.findById = async (tid) => {
  try {
    return await ticketRepository.findById(tid);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.create = async (code, purchase_datetime, amount, purchaser) => {
  try {
    const newTicketInfo = new TicketDto(
      code,
      purchase_datetime,
      amount,
      purchaser
    );
    return await ticketRepository.create(newTicketInfo);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.updateOne = async (tid, updtTicketInfo) => {
  try {
    return await ticketRepository.updateOne(tid, updtTicketInfo);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

service.delete = async (tid) => {
  try {
    return await ticketRepository.deleteOne(tid);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = service;
