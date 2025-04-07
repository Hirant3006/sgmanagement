const sqlite3 = require('sqlite3').verbose();
const config = require('./config');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists in production
if (config.isProduction) {
    const dbDir = path.dirname(config.dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

// Create a database connection
const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database at:', config.dbPath);
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Handle database errors
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Backup database periodically in production
if (config.isProduction) {
    const backupInterval = 24 * 60 * 60 * 1000; // 24 hours
    setInterval(() => {
        const backupPath = `${config.dbPath}.backup`;
        db.serialize(() => {
            db.run('VACUUM INTO ?', [backupPath], (err) => {
                if (err) {
                    console.error('Backup failed:', err);
                } else {
                    console.log('Database backed up to:', backupPath);
                }
            });
        });
    }, backupInterval);
}

// Close the database connection when the process terminates
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
            process.exit(1);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});

module.exports = db; 