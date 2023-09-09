const loginForm = document.getElementById("user-login-form");
const addCartForm = document.getElementById("add-cart");
const logoutBtn = document.getElementById("logout-btn");
let loguedUser;

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

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginCard = document.getElementById("user-logged");

  console.log("Loggin out ...");
  loginCard.innerHTML += `<div class="spinner-border float-end" role="status"></div>`;

  const response = await fetch(`/api/users/logout`);
  const data = await response.json();

  if (data.status.toLowerCase() === "success") {
    const loginContainer = document.getElementById("login");

    console.log("Usuario deslogueado.");
    loginContainer.innerHTML = `
      <a href="/login" class="btn btn-primary">
          Login
      </a>
    `;
  } else {
    console.error(data);
    loginCard.innerHTML = `
      <input type="hidden" name="loggedUsername" id="loggedUsername" value="${loguedUser.username}">
      <div class="card">
          <div id="user-logged" class="card-body">
              Logueado como ${loguedUser.username}.
              <a id="cart-link" class="btn btn-outline-secondary btn-sm justify-content-md-end">Ver
                  carrito</a>
              <button id="logout-btn" type="button" class="btn btn-primary">
                  Logout
              </button>
          </div>
      </div>
  `;
  }
});

addCartForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (loguedUser) {
    console.log("Añadiendo producto ...");

    const formData = new FormData(addCartForm);
    const data = Object.fromEntries(formData.entries());

    const url = `/api/carts/${loguedUser.cart}/product/${data.productId}?quantity=${data.quantity}`;

    console.log(data);

    try {
      const response = await fetch(url, {
        method: "Post",
        body: "{}",
      });
      const resData = await response.json();

      if (resData.status.toLowerCase() === "created") {
        console.log(`Producto añadido al carrito de ${loguedUser.firstName}`);
        appendToastNotification("Producto añadido.");
        showNotifications();
      } else {
        console.error(resData.message);
        appendToastNotification("Error al añadir producto.", "danger");
        showNotifications();
      }
    } catch (error) {
      console.error(error);
      appendToastNotification("Error al añadir producto.", "danger");
      showNotifications();
    }
  }
});

async function isLoggedUser() {
  const loginCard = document.getElementById("user-logged");

  if (loginCard) {
    const loggedUsername = document.getElementById("loggedUsername").value;
    const cartLink = document.getElementById("cart-link");

    const response = await fetch(`/api/users?username=${loggedUsername}`);
    const data = await response.json();
    loguedUser = data.payload.pop();
    console.log(loguedUser);
    cartLink.href = `/cart/${loguedUser.cart}`;
  }
}
isLoggedUser();
