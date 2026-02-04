import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Telegram'a mesaj gönder
async function sendMessage(chatId, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
}

// Basit Atem AI logic
function getReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("merhaba") || msg.includes("selam"))
    return "Merhaba, buradayım.";

  if (msg.includes("nasılsın"))
    return "İyiyim. Sana nasıl yardımcı olabilirim?";

  return "Biraz daha açar mısın?";
}

// Telegram webhook
app.post("/telegram", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text || "";

  const reply = getReply(text);
  await sendMessage(chatId, reply);

  res.sendStatus(200);
});

// Sağlık kontrolü
app.get("/", (req, res) => {
  res.send("Atem AI backend çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ayakta:", PORT);
});
