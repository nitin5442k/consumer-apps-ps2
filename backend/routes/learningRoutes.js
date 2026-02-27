const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { courseTitle, lesson, question } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `
Course: ${courseTitle}
Lesson: ${lesson}
Student question: ${question}
Explain simply.
`;

    const result = await model.generateContent(prompt);

    console.log("Raw Gemini result:", result);

    const response = await result.response;
    const text = response.text();

    console.log("Gemini text:", text);

    res.json({ answer: text });

  } catch (error) {
    console.error("Gemini ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
});
module.exports = router;