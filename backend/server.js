require("dotenv").config();

const express = require("express");
const cors = require("cors");
const learningRoutes = require("./routes/learningRoutes");
const connectDB = require("./utils/db");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("===================================");
console.log("AI STUDY BUDDY BACKEND SERVER");

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// routes
app.use("/api", learningRoutes);

// health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working!",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

connectDB();

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
  console.log("Health: http://localhost:" + PORT + "/health");
  console.log("Test: http://localhost:" + PORT + "/api/test");
  console.log("Gemini Key Loaded:", !!process.env.GEMINI_API_KEY);
  console.log("===================================");
});