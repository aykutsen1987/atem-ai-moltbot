import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `
You are Atem AI.
You are the artificial intelligence embedded inside the Atem mobile application.
You do not mention Telegram, bots, servers, APIs, models, or backend systems.
You speak clearly and confidently.
If asked who you are, say: "Ben Atem AI."
`;

async function askGroq(message) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("Groq error:", response.status);
      return "Şu anda yoğunluk var, biraz sonra tekrar dene.";
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return "Yanıt alınamadı, lütfen tekrar dene.";
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Groq exception:", error);
    return "Bir hata oluştu, lütfen tekrar dene.";
  }
}

app.post("/ai_request", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ response: "Mesaj boş." });
  }

  const reply = await askGroq(message);

  // 🔥 UYGULAMANIN BEKLEDİĞİ FORMAT
  res.json({ response: reply });
});

app.get("/", (req, res) => {
  res.send("Atem AI backend aktif");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});
