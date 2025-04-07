const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = config.corsOrigin ? config.corsOrigin.split(',') : ['http://localhost:5173'];
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/machine-types', require('./routes/machineTypes'));
app.use('/api/machine-subtypes', require('./routes/machineSubtypes'));

// Protected routes
app.get('/api/inventory', require('./middleware/auth'), (req, res) => {
  db.all('SELECT * FROM inventory', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/inventory', require('./middleware/auth'), (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) return res.status(400).json({ error: 'Missing data' });
  db.run('INSERT INTO inventory (name, quantity) VALUES (?, ?)', [name, quantity], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, quantity });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: config.isDevelopment ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`Server is running in ${config.env} mode on port ${config.port}`);
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