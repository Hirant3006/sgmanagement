const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'family_business.db');
console.log('Connecting to database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database successfully');
});

// Check if machines table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='machines'", (err, row) => {
    if (err) {
        console.error('Error checking machines table:', err);
        process.exit(1);
    }
    
    if (!row) {
        console.log('machines table does not exist');
        process.exit(1);
    }
    
    console.log('machines table exists');
    
    // Check machines data
    db.all("SELECT * FROM machines", (err, rows) => {
        if (err) {
            console.error('Error querying machines:', err);
            process.exit(1);
        }
        
        console.log(`Found ${rows.length} machines:`);
        console.log(rows);
        
        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
                process.exit(1);
            }
            console.log('Database connection closed');
        });
    });
}); 