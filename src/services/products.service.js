const { join } = require("path");
const ProductsDao = require("../daos/products.dao");
const productsDao = new ProductsDao();

const service = {};

service.find = async (limit) => {
  try {
    const products = await productsDao.find();
    return products;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

service.findById = async (id) => {
  try {
    const product = (await productsDao.find({ _id: id })).pop();
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

    const productInfo = {
      title,
      description,
      price,
      code,
      stock:
        (typeof stock).toLowerCase() === "number"
          ? stock
          : Number.parseInt(stock),
      status: _status || true,
      thumbnails: [],
    };

    if (thumbnails) {
      thumbnails.forEach((imgfile) => {
        productInfo.thumbnails.push(
          join("src", "public", "img", imgfile.filename)
        );
      });
    }

    const products = await productsDao.create(productInfo);

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

    const productUpdtInfo = {
      title: _title || currentProduct.title,
      description: _description || currentProduct.description,
      price: _price || currentProduct.price,
      thumbnails: [],
      code: _code || currentProduct.code,
      stock: _stock || currentProduct.stock,
      status: _status || currentProduct.status,
    };

    if (_thumbnails) {
      _thumbnails.forEach((imgfile) => {
        productUpdtInfo.thumbnails.push(
          join("src", "public", "img", imgfile.filename)
        );
      });
    }

    const updtProduct = await productsDao.updateOne(pid, productUpdtInfo);

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
    const result = await productsDao.delete(pid);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = service;
