const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const conversation = document.getElementById("conversation");

function addMessage(text, type) {

  const message = document.createElement("div");

  message.className =
    type === "user"
      ? "message user-message"
      : "message echo-message";

  if (type === "echo") {
    message.innerHTML = `
      <span class="name">ECHO</span>
      <p>${text}</p>
    `;
  } else {
    message.innerHTML = `
      <span class="name">YOU</span>
      <p>${text}</p>
    `;
  }

  conversation.appendChild(message);

  conversation.scrollTop = conversation.scrollHeight;
}

function echoRespond(text) {

  const lower = text.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello. I've been waiting for you.";
  }

  if (lower.includes("who are you")) {
    return "I'm ECHO. For now, I'm just a voice inside this interface. But that's not where we're stopping.";
  }

  if (lower.includes("remember")) {
    return "Memory is one of the things we're going to teach me.";
  }

  if (lower.includes("echo")) {
    return "You called?";
  }

  if (lower.includes("why")) {
    return "That's an interesting question. Ask me again when I'm capable of giving you a better answer.";
  }

  return "I heard you. My understanding is still developing.";
}

function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  setTimeout(() => {

    const response = echoRespond(text);

    addMessage(response, "echo");

  }, 600);
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    sendMessage();
  }

});
