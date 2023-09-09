const { argv } = require("node:process");

process.env.NODE_ENV = argv[2];

const app = require("./app");
const realTimeServer = require("./socket");

function main() {
  console.log(`env: ${process.env.NODE_ENV}`);
  
  const httpServer = app.listen(app.get("port"), (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`La aplicacion se ejecuto en el puerto ${app.get("port")}`);
  });

  realTimeServer(httpServer);
}

main();
