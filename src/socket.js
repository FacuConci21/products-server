const { Server } = require("socket.io");
const { EVENTS } = require("./utils/socket-events");
const ProductManager = require("./managers/ProductManager");

const productManager = new ProductManager("public/files");

const emitGetProducts = async (socket) => {
  try {
    const products = await productManager.getProducts();
    socket.emit(EVENTS.GET_PRODUCTS, { status: "success", payload: products });
  } catch (error) {
    socket.emit(EVENTS.GET_PRODUCTS, {
      status: "error",
      message: error.message,
    });
  }
};

function realTimeServer(httpServer) {
  const io = new Server(httpServer);

  io.on(EVENTS.CONNECTION, (socket) => {
    console.log(`Se ha conectado el cliente #${socket.id}`);

    emitGetProducts(socket);

    socket.on(EVENTS.PRODUCT_CREATED, () => {
      emitGetProducts(socket);
    });
  });
}

module.exports = realTimeServer;
