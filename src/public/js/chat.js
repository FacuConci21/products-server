const socket = io();
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageText");
const sendButton = document.getElementById("send-button");
const loguedAs = document.getElementById("logued-as");

const chatCard = (content) => {
  return `
    <div class="card">
        <div class="card-body">
            ${content}.
        </div>
    </div>
    `;
};

const askName = () => {
  let username = "";
  do {
    username = prompt("Dinos tu nombre");
  } while (username.trim().length === 0);
  return username;
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

  messages.forEach((msg) => {
    writeMessage(msg.user, msg.textContent);
  });
}

function chat() {
  const loguedUser = askName();
  socket.emit("chat-connect", loguedUser);

  console.log(`${loguedUser} se ha unido a la sala.`);

  loguedAs.innerText += `Logueado como: ${loguedUser}`;

  loadChatMessages();

  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    postMessage(loguedUser, messageInput.value);
    messageInput.value = "";
  });

  messageInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      postMessage(loguedUser, messageInput.value);
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
