class TicketDto {
  constructor(purchaseDatetime, amount, purchaser, products) {
    this.purchaseDatetime = purchaseDatetime;
    this.amount = amount;
    this.purchaser = purchaser;
    this.products = products;
  }
}

module.exports = TicketDto;
