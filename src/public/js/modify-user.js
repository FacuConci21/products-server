const modifyForm = document.getElementById("modify-form");

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

modifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Modificando usuario ...");
  appendToastNotification(`Modificando usuario ...`, "secondary");
  showNotifications();

  const userId = document.getElementById("userId");
  const formData = new FormData(modifyForm);
  const bodyData = Object.fromEntries(formData.entries());

  const response = await fetch(`/api/users/${userId.value}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();

  const resultContainer = document.getElementById("modify-result");
  if (data.status.toLowerCase() === "success") {
    console.log("Usuario modificado.");

    resultContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
        Usuario ${data.payload.username} modificado con éxito!.
    </div>
    `;
  } else {
    console.error(data);
    resultContainer.innerHTML = "";
    appendToastNotification(`Ocurrio un error creando usuario.`, "danger");
    showNotifications();
  }
});
