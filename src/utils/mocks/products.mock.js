const { faker } = require("@faker-js/faker");
const ProductDto = require("../../entities/dtos/product.dto");

function generateProduct() {
  return {
    _id: faker.database.mongodbObjectId(),
    ...new ProductDto(
      faker.commerce.productName(),
      faker.commerce.productDescription(),
      faker.commerce.price(),
      faker.string.alphanumeric(8),
      faker.string.numeric({ length: 2, exclude: ["0"] }),
      true,
      []
    ),
  };
}

function generateManyProducts(quantity) {
  const fakeProducts = [];
  for (let i = 0; i < quantity; i++) {
    fakeProducts.push(generateProduct());
  }
  return fakeProducts;
}

module.exports = { generateManyProducts, generateProduct };
