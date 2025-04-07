const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const auth = require('./middleware/auth');
const db = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const machinesRouter = require('./routes/machines');
const machineTypesRouter = require('./routes/machineTypes');
const machineSubtypesRouter = require('./routes/machineSubtypes');
const ordersRouter = require('./routes/orders');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machinesRouter);
app.use('/api/machine-types', machineTypesRouter);
app.use('/api/machine-subtypes', machineSubtypesRouter);
app.use('/api/orders', ordersRouter);

// Protected routes
app.get('/api/inventory', auth, (req, res) => {
  db.all('SELECT * FROM inventory', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/inventory', auth, (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) return res.status(400).json({ error: 'Missing data' });
  db.run('INSERT INTO inventory (name, quantity) VALUES (?, ?)', [name, quantity], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, quantity });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
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

app.listen(port, () => console.log(`Server on http://localhost:${port}`));