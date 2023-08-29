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
      writeMessage(user, textContent);
      console.log(`Mensaje enviado`);
    } else {
      console.log('error al enviar', data.message);
    }
  }
}

function writeMessage(user, text = "", emit = true) {
  if (text.trim().length > 0) {
    if (emit) socket.emit("send-message", user);
    chatBox.innerHTML += chatCard(`${user}: ${text}`);
  }
}

async function loadChatMessages() {
  const response = await fetch("/api/chat/msgs");
  const data = await response.json();
  const messages = data.payload;

  messages.forEach((msg) => {
    writeMessage(msg.user, msg.textContent, false);
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
    // writeMessage(loguedUser, messageInput.value);
    messageInput.value = "";
  });

  messageInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      postMessage(loguedUser, messageInput.value);
      // writeMessage(loguedUser, messageInput.value);
      messageInput.value = "";
    }
  });
}

console.log("Client start");
chat();
