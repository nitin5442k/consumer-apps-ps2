const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Eligibility = require('../models/eligibility');

if (!process.env.GEMINI_API_KEY) {
    console.error("gemini api key missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const Course = require("../models/course");

// get course by title
router.get("/courses/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const course = await Course.findOne({ title });

        if (!course) {
            return res.status(404).json({ error: "course not found" });
        }

        res.json(course);
    } catch (err) {
        console.error("course fetch error:", err);
        res.status(500).json({ error: "failed to fetch course" });
    }
});

// handle ai tutor questions
router.post("/ask", async (req, res) => {
    try {
        const { courseTitle, lesson, question } = req.body;

        if (!courseTitle || !lesson || !question) {
            return res.status(400).json({
                error: "missing coursetitle, lesson, or question",
            });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an AI tutor for the course "${courseTitle}".
Current lesson: "${lesson}".
Student asked: "${question}"

instructions:
- explain in very simple language.
- assume beginner level.
- use short paragraphs.
- give 1 real-world analogy.
- end with 1 follow-up question to check understanding.
- keep answer under 200 words.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            answer: text,
        });

    } catch (error) {
        console.error("gemini error:", error);
        res.status(500).json({
            error: "ai failed",
        });
    }
});

// get quiz without showing correct answers
router.get("/quiz/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const course = await Course.findOne({ title });

        if (!course || !course.quiz || course.quiz.length === 0) {
            return res.status(404).json({ error: "quiz not found" });
        }

        const safeQuiz = course.quiz.map(q => ({
            question: q.question,
            options: q.options
        }));

        res.json(safeQuiz);

    } catch (err) {
        console.error("quiz fetch error:", err);
        res.status(500).json({ error: "failed to fetch quiz" });
    }
});

// submit quiz answers and update eligibility
router.post('/quiz/submit', async (req, res) => {
    try {
        const { courseTitle, answers, walletAddress } = req.body;
        const course = await Course.findOne({ title: courseTitle });

        if (!course || !course.quiz || course.quiz.length === 0) {
            return res.status(404).json({ error: "quiz not found for this course" });
        }

        let correctCount = 0;
        const quizQuestions = course.quiz;
        const totalQuestions = quizQuestions.length;

        quizQuestions.forEach((q, index) => {
            if (answers[index] && answers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= 70;

        // record passing result in the database
        if (passed && walletAddress) {
            await Eligibility.findOneAndUpdate(
                { walletAddress: walletAddress, courseTitle: courseTitle },
                { quizPassed: true },
                { upsert: true }
            );
            console.log(`eligibility recorded for ${walletAddress}`);
        }

        res.json({
            score: score,
            passed: passed,
            correctCount: correctCount,
            total: totalQuestions
        });

    } catch (err) {
        console.error("quiz submission error:", err);
        res.status(500).json({ error: "internal server error" });
    }
});

module.exports = router;