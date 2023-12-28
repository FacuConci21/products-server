const { join } = require("path");
const appConfig = require("../utils/configs/app.config");
const ProductsRepository = require("../entities/repositories/products.repository");
const productsDaoFactory = require("../daos/factories/products-dao.factory");
const ProductDto = require("../entities/dtos/product.dto");
const { logger } = require("../utils/middlewares/logger.middleware");
const {
  CustomError,
  ErrorCodes,
  ErrorMsgs,
  ErrorTypes,
} = require("../utils/handlers/custom-error");
const { role } = require("../utils/constants");
const MailAdapter = require("../utils/mail.adapter");

const productsRepository = new ProductsRepository(productsDaoFactory());
const mailAdapter = new MailAdapter();
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
    logger.error(error);
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
  thumbnails,
  user
) => {
  try {
    if (!title || !description || !price || !code || !stock) {
      CustomError.create({
        name: ErrorTypes.CREATE_PRODUCT_VALIDATION,
        message: ErrorMsgs.REQUIRED_FIELD_MISSING,
        code: ErrorCodes.REQUIRED_FIELD_MISSING,
      });
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
      [],
      user
    );

    if (thumbnails) {
      thumbnails.forEach((imgfile) => {
        productInfo.thumbnails.push(join("img", imgfile.filename));
      });
    }

    const products = await productsRepository.create(productInfo);

    return products;
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    throw error;
  }
};

service.updateStock = async (pid, newStock) => {
  try {
    logger.info("Actualizando stock de producto: " + pid);
    const currentProduct = (await productsRepository.findById(pid)).toJSON();

    if (!currentProduct) return;

    if (newStock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    if (newStock === 0) {
      currentProduct.status = false;
    }

    currentProduct.stock = newStock;
    const updtProduct = await productsRepository.updateOne(pid, currentProduct);

    logger.info("Producto actualizado: " + currentProduct._id);
    logger.info(JSON.stringify(updtProduct));

    const updatedProduct = await productsRepository.findById(pid);

    return updatedProduct;
  } catch (error) {
    logger.error(error);
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
    logger.info(`Validando producto ${pid}`);
    const currentProduct = (await productsRepository.findById(pid)).toJson();

    if (!currentProduct) {
      logger.error(`Producto ${pid} no encontrado`);
      return;
    }

    logger.info(`Eliminando el producto ${pid} permanentemente`);
    const result = await productsRepository.delete(pid);

    logger.info(`Producto ${pid} eliminado`);
    logger.info(`${JSON.stringify(result)}`);

    const isPremium =
      currentProduct.user && currentProduct.user.role === role.premiumUsr;

    if (isPremium) {
      logger.info(`Enviando mail al usuario ${currentProduct.user.username}`);
      try {
        await mailAdapter.sendMail({
          userEmail: currentProduct.user.email,
          subjectMail: `COMUNICADO IMPORTANTE PARA ${currentProduct.user.firstName}!!!`,
          bodyMail: `
      Te queremos informar que el producto ${currentProduct.title} ha sido eliminado de forma permanente.

      Si esto fue un error por favor comuniquese con nuestro soporte: +54 9 011 123-4567

      Muchas gracias!.
      Saludos.
      `,
        });
      } catch (error) {
        logger.error(error);
      }
    }

    return result;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = service;
