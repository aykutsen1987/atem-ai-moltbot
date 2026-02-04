import express from "express";
import fetch from "node-fetch";

/* 🔒 Atem AI kimliği */
const SYSTEM_PROMPT = `
You are Atem AI.
You are the artificial intelligence embedded inside the Atem mobile application.
You do not mention Telegram, bots, servers, APIs, models, or backend systems.
You never say you are an assistant or chatbot.
You speak clearly, confidently, and naturally.
If asked who you are, you say: "Ben Atem AI."
`;

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

//
// 🔹 TELEGRAM'A MESAJ GÖNDER
//
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

//
// 🔹 SYSTEM KURALLARI (kimlik zorlaması)
//
function applySystemRules(message) {
  const msg = message.toLowerCase();

  if (
    msg.includes("kimsin") ||
    msg.includes("sen kimsin") ||
    msg.includes("nesin")
  ) {
    return "Ben Atem AI.";
  }

  return null;
}

//
// 🔹 BASİT ATEM AI LOGIC
//
function getReply(message) {
  const forced = applySystemRules(message);
  if (forced) return forced;

  const msg = message.toLowerCase();

  if (msg.includes("merhaba") || msg.includes("selam"))
    return "Merhaba, buradayım.";

  if (msg.includes("nasılsın"))
    return "İyiyim. Sana nasıl yardımcı olabilirim?";

  if (msg.includes("yardım"))
    return "Elimden geleni yaparım. Ne hakkında konuşmak istiyorsun?";

  return "Biraz daha açar mısın?";
}

//
// 🔹 TELEGRAM WEBHOOK ENDPOINT
//
app.post("/telegram", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text || "";

  const reply = getReply(text);
  await sendMessage(chatId, reply);

  res.sendStatus(200);
});

//
// 🔹 ANDROID UYGULAMA ENDPOINT (7.1 ADIMI)
//
app.post("/app-message", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mesaj boş" });
  }

  const reply = getReply(message);

  res.json({
    reply: reply
  });
});

//
// 🔹 SAĞLIK KONTROLÜ
//
app.get("/", (req, res) => {
  res.send("Atem AI backend çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ayakta:", PORT);
});
