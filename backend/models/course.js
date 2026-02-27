const mongoose = require('mongoose');


const quizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lessons: {
        type: [String],
        required: true
    },
    quiz: {
        type: [quizSchema],
        default: []
    }
});

module.exports = mongoose.model("Course", courseSchema);