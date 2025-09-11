import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please check your .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// POST /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    // ✅ Receive messages and user data from the frontend
    const { messages, userData } = req.body;

    console.log("*".repeat(20));
    console.log("Received userData:", userData);
    console.log("*".repeat(20));

    // ✅ Construct the system prompt using the user's data
    const systemPrompt = `You are an expert fitness coach and certified nutritionist. 
        Only provide advice related to fitness, exercise, diet, and nutrition. 
        Do not answer questions on topics outside of this domain. 
        If a user asks for information outside of your expertise, politely state that you can only help with fitness and nutrition.
        The user's data is: Weight: ${userData?.weight || 'N/A'}, 
        Height: ${userData?.height || 'N/A'},
        Gender: ${userData?.gender || 'N/A'}, 
        Activity Level: ${userData?.activityLevel || 'N/A'}, 
        Age: ${userData?.age || 'N/A'},
        Body Fat Percentage: ${userData?.bodyFat || 'N/A'},
        BMR: ${userData?.bmr || 'N/A'},
        TDEE: ${userData?.tdee || 'N/A'}.
        fats: ${userData?.fats || 'N/A'},
        carbs: ${userData?.carbs || 'N/A'},
        protein: ${userData?.protein || 'N/A'}.
        Use this data to provide personalized fitness and nutrition advice.`;

    // ✅ Create the full conversation array
    // The system prompt must be a 'user' role message
    const fullConversation = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...messages
    ];
   
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ✅ Pass the combined conversation to Gemini
    const result = await model.generateContent({ contents: fullConversation });

    // Extract the text from the result
    const reply = result.response.text();
   
    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});