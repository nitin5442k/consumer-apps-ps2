require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AI Study Buddy Backend is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        solanaNetwork: process.env.SOLANA_NETWORK
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend API is working!',
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        nftStorageConfigured: !!process.env.NFT_STORAGE_API_KEY,
        solanaConfigured: !!process.env.WALLET_KEYPAIR_PATH
    });
});

// Start server
app.listen(PORT, () => {
    console.log("===================================");
    console.log("AI STUDY BUDDY BACKEND SERVER");
    console.log("Server running on http://localhost:" + PORT);
    console.log("Health: http://localhost:" + PORT + "/health");
    console.log("Test: http://localhost:" + PORT + "/api/test");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Solana:", process.env.SOLANA_NETWORK);
    console.log("===================================");
});