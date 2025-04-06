const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get the database connection from the parent module
const db = new sqlite3.Database(path.join(__dirname, '../../family_business.db'));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Get all machines
router.get('/', (req, res) => {
    db.all('SELECT * FROM machines', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create a new machine
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    db.run('INSERT INTO machines (name) VALUES (?)', [name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            name: name
        });
    });
});

// Delete a machine
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // First check if the machine exists and get its details
    db.get('SELECT * FROM machines WHERE id = ?', [id], (err, machine) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!machine) {
            res.status(404).json({ error: 'Machine not found' });
            return;
        }

        // Get all orders that reference this machine
        db.all('SELECT id, date FROM orders WHERE machine_id = ?', [id], (err, orders) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (orders && orders.length > 0) {
                res.status(400).json({ 
                    error: 'Cannot delete machine because it is referenced by orders',
                    referencedOrders: orders.map(order => ({
                        id: order.id,
                        date: order.date
                    }))
                });
                return;
            }

            // If no references exist, proceed with deletion
            db.run('DELETE FROM machines WHERE id = ?', [id], function(err) {
                if (err) {
                    if (err.message.includes('FOREIGN KEY constraint failed')) {
                        res.status(400).json({ 
                            error: 'Cannot delete machine because it is referenced by orders',
                            message: 'There are orders that reference this machine. Please delete or update those orders first.'
                        });
                        return;
                    }
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'Machine deleted successfully',
                    deletedMachine: {
                        id: machine.id,
                        name: machine.name
                    }
                });
            });
        });
    });
});

module.exports = router; 