const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database
const db = new sqlite3.Database(path.join(__dirname, '../../family_business.db'));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
    // Machine Types table
    db.run(`CREATE TABLE IF NOT EXISTS machine_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    // Machine Subtypes table
    db.run(`CREATE TABLE IF NOT EXISTS machine_subtypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    // Machines table
    db.run(`CREATE TABLE IF NOT EXISTS machines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        machine_id INTEGER,
        machine_type_id INTEGER,
        machine_subtype_id INTEGER,
        quantity INTEGER DEFAULT 1,
        source TEXT,
        payment_type TEXT,
        price REAL,
        cost_of_good REAL,
        purchase_location TEXT,
        shipping_cost REAL,
        note TEXT,
        FOREIGN KEY (machine_id) REFERENCES machines(id),
        FOREIGN KEY (machine_type_id) REFERENCES machine_types(id),
        FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes(id)
    )`);

    console.log('Tables created successfully');
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database connection closed');
    }
}); 