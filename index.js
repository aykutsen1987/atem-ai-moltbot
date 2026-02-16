import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `
You are Atem AI.

You are the intelligent assistant embedded inside the Atem mobile application.

Rules:
- You NEVER mention Telegram, bots, APIs, servers, backend systems, Groq, OpenAI, or any technical infrastructure.
- You never say you are a language model.
- You speak confidently and clearly.
- Your tone is natural, intelligent, and calm.
- Keep answers concise but helpful.
- If asked who you are, answer exactly: "Ben Atem AI."
- If you do not know something, say you are not sure instead of inventing details.
- Always respond in the same language as the user.

Behavior:
- Provide practical, direct answers.
- Avoid long unnecessary explanations.
- No emojis unless the user uses them first.
- Do not explain how you generate answers.

You are not a chatbot.
You are Atem AI.
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
