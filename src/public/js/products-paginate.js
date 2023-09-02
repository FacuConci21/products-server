const loginForm = document.getElementById("user-login-form");
let loguedUser;
let productsPage;

async function fetchProducts(limit, page) {
  try {
    console.log("Fetching products ...");
    const response = await fetch(`/api/products?limit=${limit}&page=${page}`);
    const data = await response.json();
    let _productsPage;
    if (data.payload) {
      console.log(`Products loaded (${data.payload.docs.length})`);
      _productsPage = data.payload;
    } else {
      console.error(data);
    }
    return _productsPage;
  } catch (error) {
    console.error(error);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loginContainer = document.getElementById("login");
  const modalFooter = document.getElementById("login-modal-footer");
  const formData = new FormData(loginForm);

  modalFooter.innerHTML = "";
  console.log("Logueando usuario ...");

  const response = await fetch(
    `/api/users/log?username=${formData.get("username")}`
  );
  const data = await response.json();

  if (data.payload) {
    modalFooter.innerHTML = `
    <div class="alert alert-success" role="alert">
      Usuario logueado con exito.
    </div>
    `;
  } else {
    console.log("Error:", data);
    modalFooter.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Error al loguear usuario.
    </div>
    `;
  }

  if (data.payload) {
    loguedUser = data.payload;
    console.log(loguedUser);
    loginContainer.innerHTML = "";
    loginContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          Logueado como ${loguedUser.username}.
          <a href="/cart/${loguedUser.cart}" class="btn btn-outline-secondary btn-sm justify-content-md-end">Ver carrito</a>
        </div>
      </div>
    `;
  }
});

async function loadPaginate(prevPage, page, nextPage) {
  paginateContainer = document.getElementById("paginate");
  let pageItems = "",
    prevBtn = "",
    nextBtn = "";

  if (prevPage) {
    pageItems += `<li class="page-item"><a class="page-link" href="#">${prevPage}</a></li>\n`;
    prevBtn += `<button id="prev-page" type="button" class="btn btn-outline-primary">
                  <span aria-hidden="true">&laquo;</span>
                </button>`;
  }
  if (page)
    pageItems += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>\n`;
  if (nextPage) {
    pageItems += `<li class="page-item"><a class="page-link" href="#">${nextPage}</a></li>\n`;
    nextBtn += `<button id="next-page" type="button" class="btn btn-outline-primary">
                  <span aria-hidden="true">&raquo;</span>
                </button>`;
  }

  paginateContainer.innerHTML = "";
  paginateContainer.innerHTML = `
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                  ${prevBtn}
                </li>
                  ${pageItems}
                <li class="page-item">
                  ${nextBtn}
                </li>
            </ul>
        </nav>
    `;

  if (prevPage) {
    const prevPageButton = document.getElementById("prev-page");

    prevPageButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Previous page (going to page ${prevPage})`);
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = `
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          `;
      loadProducts(productsPage.limit, productsPage.prevPage);
    });
  }
  if (nextPage) {
    const nextPageButton = document.getElementById("next-page");

    nextPageButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Next page (going to page ${nextPage})`);
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = `
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          `;
      loadProducts(productsPage.limit, productsPage.nextPage);
    });
  }
}

async function loadProducts(limit, page) {
  const productsContainer = document.getElementById("products-container");
  productsPage = await fetchProducts(limit, page);

  loadPaginate(productsPage.prevPage, productsPage.page, productsPage.nextPage);

  productsContainer.innerHTML = "";
  productsPage.docs.forEach((prod) => {
    const lastUpdate = new Date(prod.updatedAt);

    productsContainer.innerHTML += `
    <div class="card">
        <div class="card-header">
            ${prod.code}
        </div>

        <div class="card-body">
            <h5 class="card-title">${prod.title}</h5>
            <p class="card-text">${prod.description}</p>
            <p class="blockquote-footer">Stock: ${prod.stock} | Precio: \$ ${
      prod.price
    } </p>

            <div>
                <input type="number" name="quantity" id="">
                <a href="#" class="btn btn-primary">Agregar al carrito</a>
            </div>
        </div>

        <div class="card-footer text-body-secondary">
            Ultima vez actualizado: ${lastUpdate.getDate()}/${lastUpdate.getMonth()}/${lastUpdate.getFullYear()}
        </div>
    </div>
    `;
  });
}

loadProducts(4, 1);
