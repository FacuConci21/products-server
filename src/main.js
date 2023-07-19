const ProductManager = require("./ProductManager");

async function main() {
  const pm = new ProductManager("files");
  console.log(await pm.getProducts());

  await pm.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
  console.log(await pm.getProducts());

  console.log(await pm.getProductById(1));

  const result = await pm.updateProduct(1, {
    title: "producto prueba",
    description: "Le cambio la descripcion",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
  console.log(result);

  await pm.deleteProduct(342);
  await pm.deleteProduct(1);
}

main();
