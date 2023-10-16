const { join } = require("path");
const appConfig = require("../utils/configs/app.config");
const ProductsRepository = require("../entities/repositories/products.repository");
const productsDaoFactory = require("../daos/factories/products-dao.factory");
const ProductDto = require("../entities/dtos/product.dto");

const productsRepository = new ProductsRepository(productsDaoFactory());
const service = {};

service.find = async (query, limit, page, sortParam) => {
  try {
    const sortQuery = {};
    if (Number.isNaN(limit)) limit = 10;
    if (!Number.isNaN(sortParam)) sortQuery.price = sortParam;

    const productsPage = await productsRepository.find(
      query,
      limit,
      page,
      sortQuery
    );

    productsPage.hasPrevPage
      ? (productsPage.prevLink = `http://${appConfig.host}:${appConfig.port}/products?limit=${limit}&page=${productsPage.prevPage}`)
      : (productsPage.prevLink = null);

    productsPage.hasNextPage
      ? (productsPage.nextLink = `http://${appConfig.host}:${appConfig.port}/products?limit=${limit}&page=${productsPage.nextPage}`)
      : (productsPage.nextLink = null);

    return productsPage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.findById = async (id) => {
  try {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error("Not Found");
    }
    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.create = async (
  title,
  description,
  price,
  code,
  stock,
  _status,
  thumbnails
) => {
  try {
    if (!title || !description || !price || !code || !stock) {
      throw new Error("faltan uno o mas campos obligatorios >:(");
    }

    const productInfo = new ProductDto(
      title,
      description,
      price,
      code,
      (typeof stock).toLowerCase() === "number"
        ? stock
        : Number.parseInt(stock),
      _status || true,
      []
    );

    if (thumbnails) {
      thumbnails.forEach((imgfile) => {
        productInfo.thumbnails.push(join("img", imgfile.filename));
      });
    }

    const products = await productsRepository.create(productInfo);

    return products;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.update = async (
  pid,
  _title,
  _description,
  _price,
  _code,
  _stock,
  _status,
  _thumbnails
) => {
  try {
    const currentProduct = await service.findById(pid);

    const productUpdtInfo = new ProductDto(
      _title || currentProduct.title,
      _description || currentProduct.description,
      _price || currentProduct.price,
      _code || currentProduct.code,
      _stock || currentProduct.stock,
      _status || currentProduct.status,
      []
    );

    if (_thumbnails) {
      _thumbnails.forEach((imgfile) => {
        productUpdtInfo.thumbnails.push(
          join("src", "public", "img", imgfile.filename)
        );
      });
    }

    const updtProduct = await productsRepository.updateOne(
      pid,
      productUpdtInfo
    );

    const result = await service.findById(pid);

    return { updtProduct, ...{ result } };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.delete = async (pid) => {
  try {
    const deleteProd = await service.findById(pid);

    deleteProd.status = false;

    const result = await service.update(pid, deleteProd);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.permaDelete = async (pid) => {
  try {
    const result = await productsRepository.delete(pid);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
