const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'family_business.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database successfully');
});

// Check if orders table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'", (err, row) => {
    if (err) {
        console.error('Error checking orders table:', err);
        process.exit(1);
    }
    
    if (!row) {
        console.error('Orders table does not exist!');
        process.exit(1);
    }
    
    console.log('Orders table exists');
    
    // Get table schema
    db.all("PRAGMA table_info(orders)", (err, columns) => {
        if (err) {
            console.error('Error getting table schema:', err);
            process.exit(1);
        }
        
        console.log('\nOrders table schema:');
        columns.forEach(col => {
            console.log(`${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
        });
        
        // Check for sample data
        db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
            if (err) {
                console.error('Error counting orders:', err);
                process.exit(1);
            }
            
            console.log(`\nTotal orders in database: ${row.count}`);
            
            if (row.count > 0) {
                // Show a sample order
                db.get("SELECT * FROM orders LIMIT 1", (err, order) => {
                    if (err) {
                        console.error('Error getting sample order:', err);
                        process.exit(1);
                    }
                    
                    console.log('\nSample order:');
                    console.log(order);
                });
            }
        });
    });
});

// Close the database connection after 5 seconds
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
            process.exit(1);
        }
        console.log('\nDatabase connection closed');
    });
}, 5000); 