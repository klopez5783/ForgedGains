import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // from .env
});

// POST /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body; // This array now has the correct format

    // Use Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ⚠️ Pass the entire messages array directly
    const result = await model.generateContent({ contents: messages });

    const reply = completion.choices[0].message.content;

    res.json({ reply }); // Send reply back to Expo
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
