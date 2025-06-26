import fetch from "node-fetch";

// 🔑 Paste your Gemini API key below
const API_KEY = "AIzaSyCw8qpsZ-lOGYeN1yW2cPRU0h4XiIXiWIg";

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const body = {
  contents: [
    {
      parts: [{ text: "what is data science " }]
    }
  ]
};

async function run() {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  console.log("🤖 Gemini says:");
  console.log(data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply");
}

run();