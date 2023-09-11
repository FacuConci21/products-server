const socket = io();
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageText");
const sendButton = document.getElementById("send-button");
const loguedAs = document.getElementById("logued-as");
const logoutBtn = document.getElementById("logout-btn");

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
    chatBox.innerHTML = `
    <div class="alert alert-danger" role="alert">
        Debes estar logueado para ver los mensajes.
    </div>
    `;
    sendButton.disabled = true;
    messageInput.disabled = true;
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

const chatCard = (content) => {
  return `
    <div class="card">
        <div class="card-body">
            ${content}.
        </div>
    </div>
    `;
};

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

async function fetchUser() {
  const loggedUsername = document.getElementById("loggedUsername").value;

  console.log("Fetching user data ...");
  const response = await fetch(`/api/users?username=${loggedUsername}`);
  const data = await response.json();

  if (data.payload) {
    return data.payload.pop();
  } else {
    throw new Error(data.message);
  }
}

async function postMessage(user, textContent = "") {
  if (textContent.trim().length > 0) {
    console.log("Enviando mensaje ...");
    const message = {
      user,
      textContent,
    };

    const response = await fetch("/api/chat/msg", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "Post",
      body: JSON.stringify(message),
    });
    const data = await response.json();

    if (data.status.toLowerCase() === "created") {
      socket.emit("send-message", data.payload);
      console.log("Mensaje enviado.");
    } else {
      console.log("error al enviar", data.message);
    }
  }
}

function writeMessage(user, text = "") {
  if (text.trim().length > 0) {
    chatBox.innerHTML += chatCard(`${user}: ${text}`);
  }
}

async function loadChatMessages() {
  const response = await fetch("/api/chat/msgs");
  const data = await response.json();
  const messages = data.payload;

  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    writeMessage(msg.user, msg.textContent);
  });
}

async function chat() {
  // const loguedUser = askName();
  const loguedUser = await fetchUser();

  socket.emit("chat-connect", loguedUser.username);

  console.log(`${loguedUser.username} se ha unido a la sala.`);

  loadChatMessages();

  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    postMessage(loguedUser.username, messageInput.value);
    messageInput.value = "";
  });

  messageInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      postMessage(loguedUser.username, messageInput.value);
      messageInput.value = "";
    }
  });

  socket.on("new-user", (username) => {
    console.log(`\"${username}\" se unio al chat.`);
    appendToastNotification(`\"${username}\" se ha unido al chat.`);
    showNotifications();
  });

  socket.on("new-message", (message) => {
    console.log(`nuevo mensaje de \"${message.user}\".`);
    writeMessage(message.user, message.textContent);
    appendToastNotification(`Nuevo mensaje de ${message.user}`);
    showNotifications();
  });
}

console.log("Client start");
chat();
