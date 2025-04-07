const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all machines
router.get('/', (req, res) => {
    const sql = `
        SELECT m.*, 
               mt.name as machine_type_name,
               mst.name as machine_subtype_name
        FROM machines m
        LEFT JOIN machine_types mt ON m.machine_type_id = mt.id
        LEFT JOIN machine_subtypes mst ON m.machine_subtype_id = mst.id
        ORDER BY m.name ASC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching machines:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Get machine by ID
router.get('/:id', async (req, res) => {
    try {
        const machine = await Machine.getById(req.params.id);
        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        res.json(machine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new machine
router.post('/', (req, res) => {
    const { name, machine_type_id, machine_subtype_id } = req.body;

    // Validate required fields
    if (!name || !machine_type_id || !machine_subtype_id) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: {
                name: !name ? 'Name is required' : null,
                machine_type_id: !machine_type_id ? 'Machine type is required' : null,
                machine_subtype_id: !machine_subtype_id ? 'Machine subtype is required' : null
            }
        });
    }

    const sql = `
        INSERT INTO machines (name, machine_type_id, machine_subtype_id)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [name, machine_type_id, machine_subtype_id], function(err) {
        if (err) {
            console.error('Error creating machine:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({
            id: this.lastID,
            message: 'Machine created successfully'
        });
    });
});

// Update machine
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const changes = await Machine.update(req.params.id, name);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        res.json({ id: req.params.id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a machine
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM machines WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Error deleting machine:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        res.json({ message: 'Machine deleted successfully' });
    });
});

module.exports = router; 