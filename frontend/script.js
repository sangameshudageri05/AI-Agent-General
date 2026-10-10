const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messagesDiv = document.getElementById("messages");
const statusDiv = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message, "user");
  input.value = "";
  statusDiv.textContent = "AI is thinking...";

  try {
    console.log("Sending message:", message);

    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    console.log("HTTP status:", response.status);

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    addMessage("AI", data.reply || "No reply received.", "bot");
    statusDiv.textContent = "";

  } catch (error) {
    console.error("Chat error:", error);
    statusDiv.textContent = "Error: " + error.message;
  }
});

function addMessage(sender, message, className) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = `${sender}: ${message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}