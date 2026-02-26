const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

// Get course by title
router.get('/courses/:title', async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const course = await Course.findOne({ title });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json(course);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;