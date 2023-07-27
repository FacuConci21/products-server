const app = require("./app");

function main() {
  app.listen(app.get("port"), (error) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`La aplicacion se ejecuto en el puerto ${app.get("port")}`);
  });
}

main();
