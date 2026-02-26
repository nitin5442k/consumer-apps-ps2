const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    lessons: [String]
});

module.exports = mongoose.model('Course', CourseSchema);