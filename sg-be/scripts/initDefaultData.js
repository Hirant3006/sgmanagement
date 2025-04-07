const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

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

// Initialize default data
const initDefaultData = async () => {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(`
        INSERT OR IGNORE INTO users (username, password)
        VALUES (?, ?)
    `, ['admin', hashedPassword], function(err) {
        if (err) {
            console.error('Error creating default user:', err);
        } else {
            if (this.changes > 0) {
                console.log('Default user created');
            } else {
                console.log('Default user already exists');
            }
        }
    });

    // Create default machine types
    const machineTypes = [
        'Máy ép mía',
        'Máy lọc',
        'Máy nấu',
        'Máy đóng gói'
    ];

    machineTypes.forEach(type => {
        db.run(`
            INSERT OR IGNORE INTO machine_types (name)
            VALUES (?)
        `, [type], function(err) {
            if (err) {
                console.error(`Error creating machine type ${type}:`, err);
            } else {
                if (this.changes > 0) {
                    console.log(`Machine type ${type} created`);
                } else {
                    console.log(`Machine type ${type} already exists`);
                }
            }
        });
    });

    // Create default machine subtypes
    const machineSubtypes = [
        { name: 'Máy ép mía 3 trục', machine_type_id: 1 },
        { name: 'Máy ép mía 4 trục', machine_type_id: 1 },
        { name: 'Máy lọc ly tâm', machine_type_id: 2 },
        { name: 'Máy lọc băng tải', machine_type_id: 2 },
        { name: 'Máy nấu chân không', machine_type_id: 3 },
        { name: 'Máy nấu áp suất', machine_type_id: 3 },
        { name: 'Máy đóng gói tự động', machine_type_id: 4 },
        { name: 'Máy đóng gói bán tự động', machine_type_id: 4 }
    ];

    machineSubtypes.forEach(subtype => {
        db.run(`
            INSERT OR IGNORE INTO machine_subtypes (name, machine_type_id)
            VALUES (?, ?)
        `, [subtype.name, subtype.machine_type_id], function(err) {
            if (err) {
                console.error(`Error creating machine subtype ${subtype.name}:`, err);
            } else {
                if (this.changes > 0) {
                    console.log(`Machine subtype ${subtype.name} created`);
                } else {
                    console.log(`Machine subtype ${subtype.name} already exists`);
                }
            }
        });
    });

    // Create default machines
    const machines = [
        { name: 'Máy ép mía 3 trục A1', machine_type_id: 1, machine_subtype_id: 1 },
        { name: 'Máy ép mía 4 trục B1', machine_type_id: 1, machine_subtype_id: 2 },
        { name: 'Máy lọc ly tâm C1', machine_type_id: 2, machine_subtype_id: 3 },
        { name: 'Máy lọc băng tải D1', machine_type_id: 2, machine_subtype_id: 4 },
        { name: 'Máy nấu chân không E1', machine_type_id: 3, machine_subtype_id: 5 },
        { name: 'Máy nấu áp suất F1', machine_type_id: 3, machine_subtype_id: 6 },
        { name: 'Máy đóng gói tự động G1', machine_type_id: 4, machine_subtype_id: 7 },
        { name: 'Máy đóng gói bán tự động H1', machine_type_id: 4, machine_subtype_id: 8 }
    ];

    machines.forEach(machine => {
        db.run(`
            INSERT OR IGNORE INTO machines (name, machine_type_id, machine_subtype_id)
            VALUES (?, ?, ?)
        `, [machine.name, machine.machine_type_id, machine.machine_subtype_id], function(err) {
            if (err) {
                console.error(`Error creating machine ${machine.name}:`, err);
            } else {
                if (this.changes > 0) {
                    console.log(`Machine ${machine.name} created`);
                } else {
                    console.log(`Machine ${machine.name} already exists`);
                }
            }
        });
    });
};

// Execute the init default data function
initDefaultData();

// Close the database connection after a short delay to allow all operations to complete
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}, 2000); 