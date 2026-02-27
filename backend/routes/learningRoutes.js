const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 POST /api/ask
router.post("/ask", async (req, res) => {
    try {
        const { courseTitle, lesson, question } = req.body;

        if (!courseTitle || !lesson || !question) {
            return res.status(400).json({
                error: "Missing courseTitle, lesson, or question",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        // 🔥 Structured Tutor Prompt
        const prompt = `
You are an AI tutor for the course "${courseTitle}".

Current lesson: "${lesson}".

Student asked:
"${question}"

Instructions:
- Explain in very simple language.
- Assume beginner level.
- Use short paragraphs.
- Give 1 real-world analogy.
- End with 1 follow-up question to check understanding.
- Keep answer under 200 words.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            answer: text,
        });

    } catch (error) {
        console.error("Gemini ERROR:", error);
        res.status(500).json({
            error: "AI failed",
        });
    }
});

module.exports = router;