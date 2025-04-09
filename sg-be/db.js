const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('./config/index');

// Ensure database directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
    console.log(`Creating database directory: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database file if it doesn't exist
if (!fs.existsSync(config.dbPath)) {
    console.log(`Creating database file: ${config.dbPath}`);
    fs.writeFileSync(config.dbPath, '');
}

// Connect to database
const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
db.serialize(() => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Create machine_types table
    db.run(`
        CREATE TABLE IF NOT EXISTS machine_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    // Create machine_subtypes table
    db.run(`
        CREATE TABLE IF NOT EXISTS machine_subtypes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            machine_type_id INTEGER,
            FOREIGN KEY (machine_type_id) REFERENCES machine_types(id)
        )
    `);

    // Create machines table
    db.run(`
        CREATE TABLE IF NOT EXISTS machines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            machine_type_id INTEGER,
            machine_subtype_id INTEGER,
            FOREIGN KEY (machine_type_id) REFERENCES machine_types(id),
            FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes(id)
        )
    `);
});

// Handle graceful shutdown
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