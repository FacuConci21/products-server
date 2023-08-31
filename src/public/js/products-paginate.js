const prevPageTag = document.getElementById("prev-page");
const nextPageTag = document.getElementById("next-page");

async function fetchProducts(limit, page) {
  try {
    console.log("Fetching products ...");
    const response = await fetch(`/api/products?limit=${limit}&page=${page}`);
    const data = await response.json();
    let productsPage;
    if (data.payload) {
      console.log(`Products loaded (${data.payload.docs.length})`);
      productsPage = data.payload;
    } else {
      console.error(data);
    }
    return productsPage;
  } catch (error) {
    console.error(error);
  }
}

async function loadPaginate(prevPage, page, nextPage) {
  const paginateContainer = document.getElementById("paginate");
  let pageItems = "";

  if (prevPage)
    pageItems += `<li class="page-item"><a class="page-link" href="#">${prevPage}</a></li>\n`;
  if (page)
    pageItems += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>\n`;
  if (nextPage)
    pageItems += `<li class="page-item"><a class="page-link" href="#">${nextPage}</a></li>\n`;

  paginateContainer.innerHTML = "";
  paginateContainer.innerHTML = `
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <a id="prev-page" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                ${pageItems}
                <li class="page-item">
                    <a id="next-page"  class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    `;
}

async function loadProducts(limit, page) {
  const productsContainer = document.getElementById("products-container");
  const productsPage = await fetchProducts(limit, page);
  console.log(productsPage);

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
