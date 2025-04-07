const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, '../family_business.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
        console.error('Error enabling foreign keys:', err);
    } else {
        console.log('Foreign keys enabled');
    }
});

// Check database integrity
db.get('PRAGMA integrity_check', (err, result) => {
    if (err) {
        console.error('Error checking database integrity:', err);
    } else {
        console.log('Database integrity check result:', result);
    }
});

// Check tables
const tables = ['machines', 'machine_types', 'machine_subtypes', 'orders'];
tables.forEach(table => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, result) => {
        if (err) {
            console.error(`Error checking table ${table}:`, err);
        } else {
            console.log(`Table ${table} has ${result.count} rows`);
        }
    });
});

// Check foreign key constraints for orders
db.get(`
    SELECT 
        o.id as order_id,
        m.name as machine_name,
        mt.name as machine_type_name,
        mst.name as machine_subtype_name
    FROM orders o
    JOIN machines m ON o.machine_id = m.id
    JOIN machine_types mt ON o.machine_type_id = mt.id
    JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
    LIMIT 1
`, (err, result) => {
    if (err) {
        console.error('Error checking foreign key constraints for orders:', err);
    } else {
        console.log('Foreign key constraints check result for orders:', result);
    }
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database connection:', err);
    } else {
        console.log('Database connection closed');
    }
}); 