const db = require('./db');

console.log('Starting database cleanup...');

// Function to clean a table
function cleanTable(tableName) {
  return new Promise((resolve, reject) => {
    console.log(`Cleaning table: ${tableName}`);
    db.run(`DELETE FROM ${tableName}`, (err) => {
      if (err) {
        console.error(`Error cleaning table ${tableName}:`, err);
        reject(err);
      } else {
        console.log(`Table ${tableName} cleaned successfully`);
        resolve();
      }
    });
  });
}

// Function to reset auto-increment counters
function resetAutoIncrement(tableName) {
  return new Promise((resolve, reject) => {
    console.log(`Resetting auto-increment for table: ${tableName}`);
    db.run(`DELETE FROM sqlite_sequence WHERE name = ?`, [tableName], (err) => {
      if (err) {
        console.error(`Error resetting auto-increment for ${tableName}:`, err);
        reject(err);
      } else {
        console.log(`Auto-increment reset for ${tableName}`);
        resolve();
      }
    });
  });
}

// Main function to clean all tables
async function cleanDatabase() {
  try {
    // List of tables to clean (in order of dependencies)
    const tables = [
      'orders',           // Clean orders first (depends on machines, types, subtypes)
      'machines',         // Clean machines (depends on types, subtypes)
      'machine_subtypes', // Clean subtypes (depends on types)
      'machine_types',    // Clean types
      'users'             // Clean users last
    ];

    // Clean each table
    for (const table of tables) {
      await cleanTable(table);
      await resetAutoIncrement(table);
    }

    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

// Run the cleanup
cleanDatabase(); 