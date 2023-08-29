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

function postMessage(user, messageValue = "", _chatBox) {
  if (messageValue.trim().length > 0) {
    _chatBox.innerHTML += chatCard(`${user}: ${messageValue}`);
  }
}

function chat(_chatBox) {
  const loguedUser = askName();

  console.log(`${loguedUser} se ha unido a la sala.`);

  loguedAs.innerText += `Logueado como: ${loguedUser}`;

  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    postMessage(loguedUser, messageInput.value, _chatBox);
    messageInput.value = "";
  });

  messageInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      postMessage(loguedUser, messageInput.value, _chatBox);
      messageInput.value = "";
    }
  });
}

chat(chatBox);
