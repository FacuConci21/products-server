const bodyContainer = document.getElementById("body-container");

async function home() {
  console.log("Fetching products...");

  const response = await fetch("/api/products");
  const data = await response.json();
  const productsList = data.payload.docs || [];

  bodyContainer.innerHTML = "";

  if (!data.payload) {
    console.log(data);
  }

  if (productsList.length > 0) {
    console.log(`Productos cargados ${productsList.length}`);

    bodyContainer.innerHTML += `
    <div class="alert alert-success" role="alert">
        Listado de productos disponibles...
    </div>
    `;
    
    productsList.forEach((prod) => {
      bodyContainer.innerHTML += `
            <div class="card" id="products-container">
                <div class="card-header">
                    ${prod.code}
                </div>

                <div class="card-body">
                    <h5 class="card-title">${prod.title}</h5>
                    <p class="card-text">${prod.description}</p>
                    <p class="blockquote-footer">Stock: ${prod.stock} | Precio: \$ ${prod.price} </p>
                </div>

                <div class="card-footer text-body-secondary">
                    Ultima vez actualizado: dd/mm/aaaa
                </div>
            </div>
    `;
    });
  } else {
    bodyContainer.innerHTML += `
        <div class="alert alert-danger" role="alert">
            No se obtuvieron productos desde el servidor
        </div>
    `;
  }
}

home();
