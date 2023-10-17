class TicketDto {
  constructor(code, purchaseDatetime, amount, purchaser) {
    this.code = code;
    this.purchaseDatetime = purchaseDatetime;
    this.amount = amount;
    this.purchaser = purchaser;
  }
}

module.exports = TicketDto;