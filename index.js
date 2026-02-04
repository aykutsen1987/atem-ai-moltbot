import TelegramBot from "node-telegram-bot-api";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN eksik");
}

const bot = new TelegramBot(botToken, { polling: true });

// Basit Atem AI kimliği
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  bot.sendMessage(
    chatId,
    "Merhaba, ben Atem AI. Size nasıl yardımcı olabilirim?"
  );
});

// Render health check
app.get("/", (req, res) => {
  res.send("Atem AI is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
