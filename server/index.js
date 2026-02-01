require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antigravity')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('AntiGravity Gravity Engine is running...');
});

const tasksRouter = require('./routes/tasks');
const focusRouter = require('./routes/focus');
const authRouter = require('./routes/auth');

app.use('/api/tasks', tasksRouter);
app.use('/api/focus', focusRouter);
app.use('/api/auth', authRouter);

// Import Helper for Gravity Calculation (Placeholder)
const calculateGravity = (task) => {
    // Gravity = (Urgency * Effort) / TimeRemaining
    // This is a simplified placeholder
    return 10;
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
