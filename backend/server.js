import cors from "cors";
import dotenv from "dotenv";
import express from "express";
// import OpenAI from "openai"; // You no longer need this for Gemini
// import genAI from './gemini'; // Assuming you might import Gemini separately

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

// Access your Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set. Please check your .env file.");
    // You might want to exit the process or handle this error gracefully
    // process.exit(1); 
}

// Initialize Gemini (you might need to import the Gemini SDK)
// Example: 
// import { GoogleGenerativeAI } from "@google/generative-ai";
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


// POST /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body; // This array now has the correct format

    // Use Gemini
    // Ensure genAI is properly initialized and available here
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ⚠️ Pass the entire messages array directly
    // const result = await model.generateContent({ contents: messages });

    // const reply = completion.choices[0].message.content; // This line seems to be from OpenAI, remove/adapt for Gemini

    // Placeholder for Gemini response
    const reply = "This is a placeholder response from Gemini."; 
    
    res.json({ reply }); // Send reply back to Expo
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});