const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', (req, res) => {
    const sql = `
        SELECT o.*, 
               m.name as machine_name,
               mt.name as machine_type_name,
               mst.name as machine_subtype_name
        FROM orders o
        LEFT JOIN machines m ON o.machine_id = m.id
        LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
        LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
        ORDER BY o.date DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Get a single order
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM orders WHERE id = ?';
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error('Error fetching order:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(row);
    });
});

// Create a new order
router.post('/', (req, res) => {
    const { 
        date, 
        machine_id, 
        machine_type_id, 
        machine_subtype_id, 
        source, 
        price, 
        cost_of_good, 
        shipping_cost,
        phone,
        customer_name
    } = req.body;

    // Validate required fields
    if (!date || !machine_id || !machine_type_id || !machine_subtype_id || !source || !price) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: {
                date: !date ? 'Date is required' : null,
                machine_id: !machine_id ? 'Machine is required' : null,
                machine_type_id: !machine_type_id ? 'Machine type is required' : null,
                machine_subtype_id: !machine_subtype_id ? 'Machine subtype is required' : null,
                source: !source ? 'Source is required' : null,
                price: !price ? 'Price is required' : null
            }
        });
    }

    const sql = `
        INSERT INTO orders (
            date, 
            machine_id, 
            machine_type_id, 
            machine_subtype_id, 
            source, 
            price, 
            cost_of_good, 
            shipping_cost,
            phone,
            customer_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        date,
        machine_id,
        machine_type_id,
        machine_subtype_id,
        source,
        price,
        cost_of_good || null,
        shipping_cost || null,
        phone || null,
        customer_name || null
    ], function(err) {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({
            id: this.lastID,
            message: 'Order created successfully'
        });
    });
});

// Update an order
router.put('/:id', (req, res) => {
    const { 
        date, 
        machine_id, 
        machine_type_id, 
        machine_subtype_id, 
        source, 
        price, 
        cost_of_good, 
        shipping_cost,
        phone,
        customer_name
    } = req.body;

    // Validate required fields
    if (!date || !machine_id || !machine_type_id || !machine_subtype_id || !source || !price) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: {
                date: !date ? 'Date is required' : null,
                machine_id: !machine_id ? 'Machine is required' : null,
                machine_type_id: !machine_type_id ? 'Machine type is required' : null,
                machine_subtype_id: !machine_subtype_id ? 'Machine subtype is required' : null,
                source: !source ? 'Source is required' : null,
                price: !price ? 'Price is required' : null
            }
        });
    }

    const sql = `
        UPDATE orders 
        SET date = ?,
            machine_id = ?,
            machine_type_id = ?,
            machine_subtype_id = ?,
            source = ?,
            price = ?,
            cost_of_good = ?,
            shipping_cost = ?,
            phone = ?,
            customer_name = ?
        WHERE id = ?
    `;

    db.run(sql, [
        date,
        machine_id,
        machine_type_id,
        machine_subtype_id,
        source,
        price,
        cost_of_good || null,
        shipping_cost || null,
        phone || null,
        customer_name || null,
        req.params.id
    ], function(err) {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully' });
    });
});

// Delete an order
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM orders WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Error deleting order:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    });
});

module.exports = router; 