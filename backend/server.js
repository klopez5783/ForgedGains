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
    const { messages } = req.body; // Get messages array from frontend

    const completion = await client.chat.completions.create({
      model: "gpt-4o", // ✅ Using GPT-4o
      messages, // Pass messages directly
    });

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
