const { argv } = require("node:process");

process.env.NODE_ENV = argv[2];

const app = require("./app");
const realTimeServer = require("./socket");
const { logger } = require("./utils/middlewares/logger.middleware");

function main() {
  logger.info(`running env: ${process.env.NODE_ENV}`);

  const httpServer = app.listen(app.get("port"), (error) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info(`La aplicacion se ejecuto en el puerto ${app.get("port")}`);
  });

  realTimeServer(httpServer);
}

main();
