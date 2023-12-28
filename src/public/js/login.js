const loginForm = document.getElementById("user-login-form");

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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resultContainer = document.getElementById("login-result");
  const formData = new FormData(loginForm);
  const bodyData = Object.fromEntries(formData.entries());

  console.log("Logueando usuario ...");
  appendToastNotification(`Logueando usuario ...`, "secondary");
  showNotifications();

  const response = await fetch(`/api/users/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();

  if (data.status.toLowerCase() === "success") {
    console.log("Usuario logueado.");

    resultContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
        Usuario ${data.payload.username} logueado con éxito!.
    </div>
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;

    setTimeout(() => {
      window.location = `/profile/${data.payload._id}`;
    }, 5000);
  } else {
    console.error(data);
    resultContainer.innerHTML = "";
    appendToastNotification(`Ocurrio un error logueando usuario.`, "danger");
    showNotifications();
  }
});
