
const supertest = require("supertest");
const expect = require("chai").expect;

const requester = supertest("http://localhost:8080");

describe("TESTS PARA EL MODULO DE CARRITOS", () => {
  describe("Testeando endpoints GET", () => {
    it("[GET] debe traer los datos de un carrito con productos y usuario", async () => {
      const response = await requester.get(
        "/api/carts/64ef97058e6d96fbad0ba4b2"
      );

      const { body } = response;

      const { status, payload } = body;

      expect(status).to.equal("success");
      expect(payload).to.have.property("products");
      expect(payload).to.have.property("user");
    });

    it("[GET] debe traer los datos de un carrito con productos y usuario populado", async () => {
      const response = await requester.get(
        "/api/carts/64ef97058e6d96fbad0ba4b2"
      );

      const { body } = response;

      const { status, payload } = body;

      expect(status).to.equal("success");

      const { products, user } = payload;

      expect(user).to.have.property("username");
      expect(user).to.have.property("password");
      expect(user).to.have.property("role");

      if (products.length > 0) {
        products.forEach((p) => {
          const product = p.pid;
          expect(product).to.have.property("title");
          expect(product).to.have.property("status");
        });
      }
    });
  });

  describe("Testeando endpoints PUT", () => {
    it("[PUT] debe actualizar la lista de productos de un carrito", async () => {
      const response = await requester
        .put("/api/carts/64ef974c1649d6a75ddaeb06")
        .send({
          products: [],
        });

      const { statusCode, body } = response;

      expect(statusCode).to.equal(200);

      expect(body.payload.products).to.be.ok.and.have.length(0);
    });
  });
});
