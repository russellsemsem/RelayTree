// app.js
import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3030;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// middlewares
app.use(cors());           // allow requests from your Next app (localhost:3000)
app.use(express.json());   // parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/response", async (req, res) => {
  try {
    const question = req.body?.question || "Explain how AI works in a few words";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });

    // send plain text back (keep it simple)
    res.send(response.text);
    // or: res.json({ answer: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).send("Error calling Gemini");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
