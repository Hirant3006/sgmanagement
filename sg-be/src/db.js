const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a single database connection to be shared across the application
const db = new sqlite3.Database(path.join(__dirname, '../family_business.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
        
        // Enable foreign keys by default
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Error enabling foreign keys:', err);
            } else {
                console.log('Foreign keys enabled globally');
            }
        });
    }
});

// Handle process termination
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

module.exports = db; 