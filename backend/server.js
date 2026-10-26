const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');

// MARK: Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// MARK: Configure middleware
app.use(cors());
app.use(express.json());

// MARK: Authentication API routes
app.use('/api', authRoutes);

// MARK: Health endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'MERN API server is running successfully'
    });
});

// MARK: Start server after connecting to MongoDB
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, '127.0.0.1', () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
