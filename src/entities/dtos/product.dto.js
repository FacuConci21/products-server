class ProductDto {
  constructor(title, description, price, code, stock, _status, thumbnails) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this._status = _status;
    this.thumbnails = thumbnails;
  }
}

module.exports = ProductDto;