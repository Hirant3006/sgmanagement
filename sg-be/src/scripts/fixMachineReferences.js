const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database
const db = new sqlite3.Database(path.join(__dirname, '../../family_business.db'));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Function to get all orders referencing a specific machine
function getOrdersForMachine(machineId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM orders WHERE machine_id = ?', [machineId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Function to update orders to reference a different machine
function updateOrdersToNewMachine(oldMachineId, newMachineId) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE orders SET machine_id = ? WHERE machine_id = ?', 
            [newMachineId, oldMachineId], 
            function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
    });
}

// Function to delete orders for a specific machine
function deleteOrdersForMachine(machineId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM orders WHERE machine_id = ?', [machineId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

// Main function
async function main() {
    const machineId = 31; // The machine ID you want to fix

    try {
        // Get all orders for this machine
        const orders = await getOrdersForMachine(machineId);
        console.log(`Found ${orders.length} orders referencing machine ${machineId}:`);
        orders.forEach(order => {
            console.log(`- Order ID: ${order.id}, Date: ${order.date}`);
        });

        if (orders.length > 0) {
            // Ask what to do with these orders
            console.log('\nOptions:');
            console.log('1. Update orders to reference a different machine');
            console.log('2. Delete these orders');
            console.log('3. Exit without changes');
            
            // For now, we'll just log the options
            // In a real scenario, you would implement the chosen option
        } else {
            console.log('No orders found referencing this machine.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        db.close();
    }
}

main(); 