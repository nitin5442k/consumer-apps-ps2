const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Eligibility = require('../models/eligibility');

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const Course = require("../models/course");

// Get course by title
router.get("/courses/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const course = await Course.findOne({ title });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json(course);
    } catch (err) {
        console.error("Course fetch error:", err);
        res.status(500).json({ error: "Failed to fetch course" });
    }
});

// 🔥 POST /api/ask
router.post("/ask", async (req, res) => {
    try {
        const { courseTitle, lesson, question } = req.body;

        if (!courseTitle || !lesson || !question) {
            return res.status(400).json({
                error: "Missing courseTitle, lesson, or question",
            });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



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


// GET quiz (without correct answers)
router.get("/quiz/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);

        const course = await Course.findOne({ title });

        if (!course || !course.quiz || course.quiz.length === 0) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        // Remove correctAnswer before sending
        const safeQuiz = course.quiz.map(q => ({
            question: q.question,
            options: q.options
        }));

        res.json(safeQuiz);

    } catch (err) {
        console.error("Quiz fetch error:", err);
        res.status(500).json({ error: "Failed to fetch quiz" });
    }
});
// POST: Submit Quiz Answers
router.post('/quiz/submit', async (req, res) => {
    try {
        // 1. Get data from frontend (Added walletAddress here)
        const { courseTitle, answers, walletAddress } = req.body;

        const course = await Course.findOne({ title: courseTitle });

        if (!course || !course.quiz || course.quiz.length === 0) {
            return res.status(404).json({ error: "Quiz not found for this course" });
        }

        // 2. Calculate the score FIRST
        let correctCount = 0;
        const quizQuestions = course.quiz;
        const totalQuestions = quizQuestions.length;

        quizQuestions.forEach((q, index) => {
            if (answers[index] && answers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= 70; // Now 'passed' is defined!

        // 3. Update Eligibility database SECOND
        if (passed && walletAddress) {
            await Eligibility.findOneAndUpdate(
                { walletAddress: walletAddress, courseTitle: courseTitle },
                { quizPassed: true },
                { upsert: true }
            );
            console.log(`Eligibility recorded for ${walletAddress}`);
        }

        // 4. Send response to frontend
        res.json({
            score: score,
            passed: passed,
            correctCount: correctCount,
            total: totalQuestions
        });

    } catch (err) {
        console.error("Quiz Submission Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;