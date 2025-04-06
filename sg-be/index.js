const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const cors = require('cors');
const auth = require('./middleware/auth');

app.use(cors());
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database('./family_business.db', (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('Connected to SQLite');
});

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);

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

app.listen(port, () => console.log(`Server on http://localhost:${port}`));