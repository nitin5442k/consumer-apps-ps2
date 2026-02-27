require("dotenv").config();

const express = require("express");
const cors = require("cors");
const learningRoutes = require("./routes/learningRoutes");
const connectDB = require("./utils/db");  // 🔥 Disabled for now

const app = express();
const PORT = process.env.PORT || 5000;

console.log("===================================");
console.log("AI STUDY BUDDY BACKEND SERVER");

// 🔥 1. Body parsing middleware MUST come first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 2. CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// 🔥 3. Routes
app.use("/api", learningRoutes);

// 🔥 4. Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// 🔥 5. Test Route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working!",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});


connectDB();  // Mongo temporarily disabled

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
  console.log("Health: http://localhost:" + PORT + "/health");
  console.log("Test: http://localhost:" + PORT + "/api/test");
  console.log("Gemini Key Loaded:", !!process.env.GEMINI_API_KEY);
  console.log("===================================");
});