const btnBuyAll = document.getElementById("btn-buy-all");
const btnClearCart = document.getElementById("btn-clear-cart");

const appendToastNotification = (message, type = "primary") => {
  const notifContainer = document.getElementById("notif-container");

  notifContainer.innerHTML = "";
  notifContainer.innerHTML += `
        <div id="notification" class="toast text-bg-${type}">
          <div class="d-flex">
              <div class="toast-body">
                  ${message}
              </div>
              <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
        `;
};

const showNotifications = () => {
  const notificationToast = document.getElementById("notification");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(notificationToast);
  toastBootstrap.show();
};

btnBuyAll.addEventListener("click", async () => {
  console.log("Comprando ...");
  appendToastNotification(`Iniciando la compra ...`, "secondary");
  showNotifications();

  const btnsContainer = document.getElementById("btns-container");
  const cartIdInput = document.getElementById("cartId");

  btnsContainer.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

  const response = await fetch("/api/ticket/" + cartIdInput.value, {
    method: "Post",
  });

  const resData = await response.json();
  console.log("Received", resData);

  if (resData.status.toLowerCase() === "created") {
    appendToastNotification(`Compra exitosa ...`, "success");
    showNotifications();
    btnsContainer.innerHTML = `
        <a href="/api/ticket/${resData.payload.ticket.code}" class="btn btn-outline-success">Ver ticket de compra</a>
        `;
  } else {
    appendToastNotification(`Ocurrio un error.`, "danger");
    showNotifications();
  }
});

btnClearCart.addEventListener("click", () => {
  console.log("Vaciando carrito");
});

async function fetchCartById() {
  const cartIdInput = document.getElementById("cartId");
  const cartId = cartIdInput.value;

  console.log("Fetching cart ...");

  const response = await fetch(`/api/carts/${cartId}`);
  const data = await response.json();

  if (data.payload) {
    console.log("Cart fetched.");
  } else {
    console.error(data);
  }
}

fetchCartById();
