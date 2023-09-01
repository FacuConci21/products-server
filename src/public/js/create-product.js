const socket = io();
const container = document.getElementById("products-list");
const createForm = document.getElementById("create-form");
const accordionItem = document.getElementById("accordion");

function writeProduct(product) {
  container.innerHTML += `
    <div class="card">
      <div class="card-header">
        ${product.code}
      </div>
      
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <p class="blockquote-footer">Stock: ${product.stock} | Precio: $${product.price} </p>

        <div>
            <input type="number" name="quantity" id="">
            <a href="#" class="btn btn-primary">Agregar al carrito</a>
        </div>

      </div>

      <div class="card-footer text-body-secondary">
        Ultima vez actualizado: dd/mm/aaaa
      </div>
    </div>
  `;
}

async function loadOneProduct(productId = "") {
  try {
    console.log("Fetching product ...");

    const response = await fetch("/api/products/" + productId);
    const data = await response.json();

    if (data.payload) {
      const product = data.payload;

      console.log(`Product loaded.`);

      writeProduct(product);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
    container.innerHTML = `    
        <div class="alert alert-danger" role="alert">
            Ha ocurrido un error...
        </div>`;
  }
}

async function loadProducts() {
  try {
    console.log("Fetching products ...");

    const response = await fetch("/api/products");
    const data = await response.json();
    const products = data.payload.docs || [];

    console.log(`Products loaded (${products.length})`);

    if (!data.payload) {
      console.log(data);
    }

    if (products.length > 0) {
      container.innerHTML = `
        <div class="alert alert-success" role="alert">
            Listado de productos disponibles...
        </div>`;

      products.forEach((product) => {
        writeProduct(product);
      });
    } else {
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            No se obtuvieron productos desde el servidor 
        </div>`;
    }
  } catch (error) {
    console.log(error);
    container.innerHTML = `    
        <div class="alert alert-danger" role="alert">
            Ha ocurrido un error...
        </div>`;
  }
}

async function createProduct() {
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Creating product ...");

    const data = new FormData(createForm);

    data.set('status', (data.get('status') === 'on'));

    console.log("Sending ...", Object.fromEntries(data.entries()));
    const response = await fetch("/api/products", {
      method: "Post",
      body: data,
    });
    const resData = await response.json();
    console.log("Received", resData);

    if (resData.status.toLowerCase() === "created") {
      socket.emit("product-created", resData.payload);

      accordionItem.innerHTML += `
        <div class="alert alert-secondary" role="alert">
            Producto creado ...
        </div>`;
    } else {
      accordionItem.innerHTML += `
        <div class="alert alert-danger" role="alert">
            Parece que algo salio mal...
        </div>`;
    }
  });
}

socket.on("new-product", (productId) => {
  console.log("New product created.");
  loadOneProduct(productId);
});

console.log("Client start");
loadProducts();
createProduct();
