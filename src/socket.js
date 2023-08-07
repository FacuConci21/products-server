const { Server } = require("socket.io");

function realTimeServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`Se ha conectado el cliente #${socket.id}`);
  });
}

module.exports = realTimeServer;
