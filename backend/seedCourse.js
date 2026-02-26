require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Course.deleteMany({});

        await Course.insertMany([
            {
                title: "Fundamental of Science",
                lessons: [
                    "What is Science?",
                    "Scientific Methods",
                    "Laws of Nature",
                    "Energy & Matter",
                    "Final Review"
                ]
            },
            {
                title: "Mathematics",
                lessons: [
                    "Introduction to Algebra",
                    "Geometry Basics",
                    "Trigonometry",
                    "Calculus Intro",
                    "Practice Problems"
                ]
            },
            {
                title: "Computer and Technology",
                lessons: [
                    "MS Word Basics",
                    "MS Excel Essentials",
                    "PowerPoint Mastery",
                    "Copilot Introduction",
                    "Tech Summary"
                ]
            },
            {
                title: "English Literature",
                lessons: [
                    "Poetry Introduction",
                    "Classic Stories",
                    "Shakespeare Basics",
                    "Modern Literature",
                    "Final Reflection"
                ]
            }
        ]);

        console.log("✅ Courses inserted");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();