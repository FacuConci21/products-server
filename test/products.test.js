const chai = require("chai");
const { EXPECTATION_FAILED } = require("http-status-codes");
const supertest = require("supertest");
const expect = require("chai").expect;

const requester = supertest("http://localhost:8080");

describe("TESTS PARA EL MODULO DE PRODUCTOS", () => {
  describe("Testeando endpoints GET", () => {
    it("[GET] debe traer 10 productos paginados", async () => {
      const response = await requester.get("/api/products");

      const { statusCode, body } = response;

      expect(statusCode).to.equal(200);

      const { status, payload } = body;

      expect(status).to.equal("success");
      expect(payload).to.have.property("docs");
      expect(payload).to.have.property("totalPages");
      expect(payload.docs).to.have.length(10);
    });

    it("[GET] debe traer 5 productos paginados ", async () => {
      const response = await requester.get("/api/products?limit=5");

      const { statusCode, body } = response;
      const { status, payload } = body;

      expect(statusCode).to.equal(200);
      expect(status).to.equal("success");
      expect(payload).to.have.property("docs");
      expect(payload).to.have.property("totalPages");
      expect(payload.docs).to.have.length(5);
    });

    it("[GET] debe traer 6 productos paginados de la pagina 2", async () => {
      const response = await requester.get("/api/products?limit=6&page=2");

      const { statusCode, body } = response;
      const { status, payload } = body;

      expect(statusCode).to.equal(200);
      expect(status).to.equal("success");
      expect(payload).to.have.property("docs");
      expect(payload).to.have.property("totalPages");
      expect(payload.docs).to.have.length(6);
      expect(payload.page).to.equal(2);
    });

    it("[GET] debe traer 10 productos paginados con status true", async () => {
      const response = await requester.get("/api/products?status=true");

      const { statusCode, body } = response;
      const { status, payload } = body;

      expect(statusCode).to.equal(200);
      expect(status).to.equal("success");
      expect(payload).to.have.property("docs");
      expect(payload).to.have.property("totalPages");
      expect(payload.docs).to.have.length(10);

      const { docs } = payload;

      const productsStatus = docs.every((product) => product.status === true);

      expect(productsStatus).to.equal(true);
    });

    it("[GET] debe traer 1 producto buscado por id", async () => {
      const response = await requester.get(
        "/api/products/64e7c95915b162c8545713ed"
      );

      const { statusCode, body } = response;
      const { status, payload } = body;

      expect(statusCode).to.equal(200);
      expect(status).to.equal("success");
      expect(payload).to.have.property("_id");
      expect(payload).to.have.property("title");
      expect(payload).to.have.property("description");
      expect(payload).to.have.property("price");
      expect(payload).to.have.property("code");
      expect(payload).to.have.property("stock");
      expect(payload).to.have.property("status");
      expect(payload).to.have.property("thumbnails");
      expect(payload).to.have.property("updatedAt");
    });
  });
});
