const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    courseTitle: { type: String, required: true },
    quizPassed: { type: Boolean, default: false },
    certificateMinted: { type: Boolean, default: false },
    mintDate: { type: Date }
});

// Ensure a user can't have duplicate entries for the same course
eligibilitySchema.index({ walletAddress: 1, courseTitle: 1 }, { unique: true });

module.exports = mongoose.model("Eligibility", eligibilitySchema);