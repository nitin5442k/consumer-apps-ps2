require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Course.deleteOne({ title: "Fundamental of Science" });

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
                ],
                quiz: [
                    {
                        "question": "What is generally considered the first step in the scientific method?",
                        "options": [
                            "Forming a hypothesis",
                            "Making an observation",
                            "Conducting an experiment",
                            "Analyzing data"
                        ],
                        "correctAnswer": "Making an observation"
                    },
                    {
                        "question": "A scientific law is best described as:",
                        "options": [
                            "A tentative explanation for an observed phenomenon",
                            "A statement that describes what always happens under certain conditions in nature",
                            "An educated guess based on limited evidence",
                            "A belief held by the majority of the scientific community"
                        ],
                        "correctAnswer": "A statement that describes what always happens under certain conditions in nature"
                    },
                    {
                        "question": "Which of the following statements about matter is true?",
                        "options": [
                            "Matter can be created but not destroyed.",
                            "Matter is anything that has mass and takes up space.",
                            "Matter and energy are completely unrelated concepts.",
                            "Matter is only found in a solid state."
                        ],
                        "correctAnswer": "Matter is anything that has mass and takes up space."
                    },
                    {
                        "question": "In a controlled experiment, the variable that is deliberately changed by the scientist is called the:",
                        "options": [
                            "Dependent variable",
                            "Control group",
                            "Independent variable",
                            "Constant variable"
                        ],
                        "correctAnswer": "Independent variable"
                    },
                    {
                        "question": "The law of conservation of energy states that:",
                        "options": [
                            "Energy can only be created by chemical reactions.",
                            "Energy cannot be created or destroyed, only transformed.",
                            "The total energy of an isolated system is constantly decreasing.",
                            "Potential energy is always equal to kinetic energy."
                        ],
                        "correctAnswer": "Energy cannot be created or destroyed, only transformed."
                    }
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