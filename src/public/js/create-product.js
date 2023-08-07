const socket = io();
const container = document.getElementById("products-list");
const createForm = document.getElementById("create-form");
const accordionItem = document.getElementById("accordion");

async function loadProducts() {
  try {
    const response = await fetch("/api/products", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    });
    const data = await response.json();
    const products = data.payload || [];

    if (products.length > 0) {
      console.log("Products loaded ...", products);
      container.innerHTML = `
        <div class="alert alert-success" role="alert">
            Listado de productos disponibles...
        </div>`;

      products.forEach((product) => {
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
      });
    } else {
      console.log("Products not found");
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

    const data = new FormData(createForm);

    const obj = {};

    data.forEach((value, key) => (obj[key] = value));

    obj.status = obj.status === "on";
    obj.stock = Number.parseInt(obj.stock);
    obj.price = Number.parseFloat(obj.price);

    console.log("data sent", obj);

    const response = await fetch("/api/products", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "Post",
      body: JSON.stringify(obj),
    });
    const resData = await response.json();
    console.log("received", resData);

    if (resData.status === 'created') {
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

console.log("Client start");
loadProducts();
createProduct();
