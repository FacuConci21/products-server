class TicketDto {
  constructor(purchaseDatetime, amount, purchaser) {
    this.purchaseDatetime = purchaseDatetime;
    this.amount = amount;
    this.purchaser = purchaser;
  }
}

module.exports = TicketDto;
