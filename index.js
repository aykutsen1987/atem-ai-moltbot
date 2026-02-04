import TelegramBot from "node-telegram-bot-api";
import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const systemPrompt = process.env.SYSTEM_PROMPT;
const openaiKey = process.env.OPENAI_API_KEY;

if (!botToken || !systemPrompt || !openaiKey) {
  throw new Error("Environment variables eksik");
}

const bot = new TelegramBot(botToken, { polling: true });

const openai = new OpenAI({
  apiKey: openaiKey
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ]
    });

    const reply = completion.choices[0].message.content;

    await bot.sendMessage(chatId, reply);
  } catch (err) {
    await bot.sendMessage(
      chatId,
      "Şu anda yanıt veremiyorum, lütfen tekrar deneyin."
    );
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Atem AI is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
