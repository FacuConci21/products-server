const loginForm = document.getElementById("user-login-form");
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

async function addProduct(form) {
  if (loguedUser) {
    console.log("Añadiendo producto ...");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const url = `/api/carts/${loguedUser.cart}/product/${data.productId}?quantity=${data.quantity}`;

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
  } else {
    appendToastNotification("No estas logueado.", "danger");
    showNotifications();
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loginContainer = document.getElementById("login");
  const modalFooter = document.getElementById("login-modal-footer");
  const formData = new FormData(loginForm);
  const bodyData = Object.fromEntries(formData.entries());

  modalFooter.innerHTML = "";
  console.log("Logueando usuario ...");

  const response = await fetch(`/api/users/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(bodyData),
  });
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
    console.log("Usuario logueado.");
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

function addProductFormEvents() {
  const formsArr = Array.from(document.forms);
  formsArr.forEach((form) => {
    if (form.id.startsWith("add-product")) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await addProduct(form);
      });
    }
  });
}

addProductFormEvents();
