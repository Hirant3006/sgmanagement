const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');
const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const machineTypeRoutes = require('./routes/machineTypes');
const machineSubtypeRoutes = require('./routes/machineSubtypes');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Add headers to allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/machine-types', machineTypeRoutes);
app.use('/api/machine-subtypes', machineSubtypeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running in ${config.env} mode on port ${PORT}`);
    console.log('CORS is enabled for all origins');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});