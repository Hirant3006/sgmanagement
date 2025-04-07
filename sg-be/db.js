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
    
    // Check if database file exists, if not create it
    if (!fs.existsSync(config.dbPath)) {
        console.log('Database file does not exist, creating it...');
        // Create an empty file
        fs.writeFileSync(config.dbPath, '');
        console.log('Database file created at:', config.dbPath);
    }
}

// Create a database connection
const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database at:', config.dbPath);
    
    // Initialize database tables if they don't exist
    db.serialize(() => {
        // Create orders table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                machine_id INTEGER,
                machine_type_id INTEGER,
                machine_subtype_id INTEGER,
                source TEXT,
                price REAL,
                cost_of_good REAL,
                shipping_cost REAL,
                purchase_location TEXT,
                phone TEXT,
                customer_name TEXT,
                FOREIGN KEY (machine_id) REFERENCES machines (id),
                FOREIGN KEY (machine_type_id) REFERENCES machine_types (id),
                FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes (id)
            )
        `);
        
        // Create machines table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS machines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                machine_type_id INTEGER,
                machine_subtype_id INTEGER,
                FOREIGN KEY (machine_type_id) REFERENCES machine_types (id),
                FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes (id)
            )
        `);
        
        // Create machine_types table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS machine_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
        `);
        
        // Create machine_subtypes table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS machine_subtypes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                machine_type_id INTEGER,
                FOREIGN KEY (machine_type_id) REFERENCES machine_types (id)
            )
        `);
        
        console.log('Database tables initialized');
    });
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
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = db; 