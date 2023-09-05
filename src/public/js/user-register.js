const registrationForm = document.getElementById("register-form");

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

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Registrando usuario ...");
  appendToastNotification(`Registrando usuario ...`, "secondary");
  showNotifications();

  const resultContainer = document.getElementById("create-result");
  const formData = new FormData(registrationForm);
  const bodyData = Object.fromEntries(formData.entries());

  console.log(bodyData);
  console.log(JSON.stringify(bodyData));

  const response = await fetch("/api/users", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();

  if (data.status.toLowerCase() === "created") {
    console.log("Usuario creado.");
    console.log(data.payload);

    resultContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
        Usuario ${data.payload.username} creado con éxito!.
    </div>
    `;
  } else {
    console.error(data);
    resultContainer.innerHTML = '';
    appendToastNotification(`Ocurrio un error creando usuario.`, "danger");
    showNotifications();
  }
});
