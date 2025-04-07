const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database connection
const db = new sqlite3.Database(path.join(__dirname, '../family_business.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    } else {
        console.log('Connected to database');
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Error enabling foreign keys:', err);
            } else {
                console.log('Foreign keys enabled');
            }
        });
    }
});

// Create tables
const createTables = () => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created or already exists');
        }
    });

    // Create machine_types table
    db.run(`
        CREATE TABLE IF NOT EXISTS machine_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating machine_types table:', err);
        } else {
            console.log('Machine types table created or already exists');
        }
    });

    // Create machine_subtypes table
    db.run(`
        CREATE TABLE IF NOT EXISTS machine_subtypes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            machine_type_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (machine_type_id) REFERENCES machine_types (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating machine_subtypes table:', err);
        } else {
            console.log('Machine subtypes table created or already exists');
        }
    });

    // Create machines table
    db.run(`
        CREATE TABLE IF NOT EXISTS machines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            machine_type_id INTEGER NOT NULL,
            machine_subtype_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (machine_type_id) REFERENCES machine_types (id),
            FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating machines table:', err);
        } else {
            console.log('Machines table created or already exists');
        }
    });

    // Create orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            machine_id INTEGER NOT NULL,
            machine_type_id INTEGER NOT NULL,
            machine_subtype_id INTEGER NOT NULL,
            source TEXT NOT NULL,
            price REAL NOT NULL,
            cost_of_good REAL,
            shipping_cost REAL,
            phone TEXT,
            customer_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (machine_id) REFERENCES machines (id),
            FOREIGN KEY (machine_type_id) REFERENCES machine_types (id),
            FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err);
        } else {
            console.log('Orders table created or already exists');
        }
    });
};

// Execute the create tables function
createTables();

// Close the database connection after a short delay to allow all operations to complete
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}, 1000); 