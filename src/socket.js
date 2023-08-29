const { Server } = require("socket.io");
const { EVENTS } = require("./utils/socket-events");
const ProductManager = require("./daos/ProductManager");

const productManager = new ProductManager("public/files");

function socketlog(event, message) {
  console.log(`[SOCKET: ON ${event}] ${message}`);
}

function realTimeServer(httpServer) {
  const io = new Server(httpServer);

  io.on(EVENTS.CONNECTION, (socket) => {
    socketlog(EVENTS.CONNECTION, `Se ha conectado un cliente (id: ${socket.id})`);

    socket.on(EVENTS.PRODUCT_CREATED, (newProduct) => {
      socketlog(EVENTS.PRODUCT_CREATED, `Se ha creado un nuevo producto (id: ${socket.id})`);
      socket.emit(EVENTS.NEW_PRODUCT, newProduct._id);
    });

    /***  CHAT    */

    socket.on(EVENTS.CHAT_CONNECT, (username) => {
      socketlog(EVENTS.CHAT_CONNECT, `\"${username}\" se unio al chat`);
      socket.broadcast.emit(EVENTS.NEW_USER, username);
    });

    socket.on(EVENTS.SEND_MESSAGE, (message) => {
      socketlog(EVENTS.SEND_MESSAGE, `\"${message.user}\" ha enviado un mensaje.`);
      io.emit(EVENTS.NEW_MESSAGE, message);
    })

  });
}

module.exports = realTimeServer;
