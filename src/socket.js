const { Server } = require("socket.io");
const { EVENTS } = require("./utils/socket-events");
const ProductManager = require("./daos/ProductManager");

const productManager = new ProductManager("public/files");

function socketlog(event, message) {
  console.log(`[SOCKET: ON ${event}] ${message}`);
}

const emitGetProducts = async (socket) => {
  try {
    const products = await productManager.getProducts();
    console.log(
      `[SOCKET: ON ${EVENTS.GET_PRODUCTS}] Se envia el listado de productos (id: ${socket.id})`
    );
    socket.emit(EVENTS.GET_PRODUCTS, { status: "success", payload: products });
  } catch (error) {
    console.error(
      `[SOCKET: ON ${EVENTS.GET_PRODUCTS}] (id: ${socket.id}) ${error.message}`
    );
    socket.emit(EVENTS.GET_PRODUCTS, {
      status: "error",
      message: error.message,
    });
  }
};

function realTimeServer(httpServer) {
  const io = new Server(httpServer);

  io.on(EVENTS.CONNECTION, (socket) => {
    console.log(
      `[SOCKET: ON ${EVENTS.CONNECTION}] Se ha conectado un cliente (id: ${socket.id})`
    );

    // emitGetProducts(socket);

    socket.on(EVENTS.PRODUCT_CREATED, () => {
      console.log(
        `[SOCKET: ON ${EVENTS.PRODUCT_CREATED}] Se ha creado un nuevo producto (id: ${socket.id})`
      );
      emitGetProducts(socket);
    });

    socket.on(EVENTS.CHAT_CONNECT, (username) => {
      socketlog(EVENTS.CHAT_CONNECT, `\"${username}\" se unio al chat`);
      socket.broadcast.emit(EVENTS.NEW_USER, username);
    });

    socket.on(EVENTS.SEND_MESSAGE, (message) => {
      socketlog(EVENTS.SEND_MESSAGE, `\"${message.user}\" ha enviado un mensaje.`);
      socket.broadcast.emit(EVENTS.NEW_MESSAGE, message);
    })

  });
}

module.exports = realTimeServer;
