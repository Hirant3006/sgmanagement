const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database connection
const db = new sqlite3.Database(path.join(__dirname, '../family_business.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db; 