const express = require('express');
const router = express.Router();
const db = require('../db');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
        console.error('Error enabling foreign keys:', err);
    } else {
        console.log('Foreign keys enabled in orders.js');
    }
});

// Get all orders
router.get('/', (req, res) => {
    const query = `
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
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create a new order
router.post('/', async (req, res) => {
    console.log('Received order creation request:', req.body);
    
    const { 
        date, 
        machine_id, 
        machine_type_id, 
        machine_subtype_id,
        quantity = 1,
        source = null,
        payment_type = null,
        price,
        cost_of_good,
        purchase_location = null,
        shipping_cost = null,
        note = null
    } = req.body;

    // Validate required fields based on schema NOT NULL constraints
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    if (!machine_id) {
        return res.status(400).json({ error: 'Machine is required' });
    }

    if (!machine_type_id) {
        return res.status(400).json({ error: 'Machine type is required' });
    }

    if (!machine_subtype_id) {
        return res.status(400).json({ error: 'Machine subtype is required' });
    }

    if (!price) {
        return res.status(400).json({ error: 'Price is required' });
    }

    if (!cost_of_good) {
        return res.status(400).json({ error: 'Cost of good is required' });
    }

    // Validate data types
    if (isNaN(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (isNaN(Number(cost_of_good)) || Number(cost_of_good) <= 0) {
        return res.status(400).json({ error: 'Cost of good must be a positive number' });
    }

    if (shipping_cost !== null && (isNaN(Number(shipping_cost)) || Number(shipping_cost) < 0)) {
        return res.status(400).json({ error: 'Shipping cost must be a non-negative number' });
    }

    try {
        // Insert the order directly after validation
        const query = `
            INSERT INTO orders (
                date, machine_id, machine_type_id, machine_subtype_id,
                quantity, source, payment_type, price, cost_of_good,
                purchase_location, shipping_cost, note, phone, customer_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            date, machine_id, machine_type_id, machine_subtype_id,
            quantity, source, payment_type, price, cost_of_good,
            purchase_location, shipping_cost, note, req.body.phone || null, req.body.customer_name || null
        ];

        console.log('Executing insert query with params:', params);

        db.run(query, params, function(err) {
            if (err) {
                console.error('Error creating order:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }

            console.log('Order created successfully with ID:', this.lastID);

            // Get the created order with all related information
            db.get(`
                SELECT o.*, 
                       m.name as machine_name,
                       mt.name as machine_type_name,
                       mst.name as machine_subtype_name
                FROM orders o
                LEFT JOIN machines m ON o.machine_id = m.id
                LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
                LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
                WHERE o.id = ?
            `, [this.lastID], (err, order) => {
                if (err) {
                    console.error('Error fetching created order:', err);
                    return res.status(500).json({ error: 'Database error: ' + err.message });
                }
                res.status(201).json({
                    message: 'Order created successfully',
                    order: order
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error in POST /orders:', error);
        res.status(500).json({ error: 'Unexpected error: ' + error.message });
    }
});

// Update an order
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { 
        date, 
        machine_id, 
        machine_type_id, 
        machine_subtype_id,
        quantity,
        source,
        price,
        cost_of_good,
        purchase_location,
        shipping_cost,
        note,
        phone,
        customer_name
    } = req.body;

    // First check if the order exists
    db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
        if (err) {
            console.error('Error checking order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Build the update query dynamically based on provided fields
        let updateFields = [];
        let params = [];

        if (date !== undefined) {
            updateFields.push('date = ?');
            params.push(date);
        }
        if (machine_id !== undefined) {
            updateFields.push('machine_id = ?');
            params.push(machine_id);
        }
        if (machine_type_id !== undefined) {
            updateFields.push('machine_type_id = ?');
            params.push(machine_type_id);
        }
        if (machine_subtype_id !== undefined) {
            updateFields.push('machine_subtype_id = ?');
            params.push(machine_subtype_id);
        }
        if (quantity !== undefined) {
            updateFields.push('quantity = ?');
            params.push(quantity);
        }
        if (source !== undefined) {
            updateFields.push('source = ?');
            params.push(source);
        }
        if (price !== undefined) {
            updateFields.push('price = ?');
            params.push(price);
        }
        if (cost_of_good !== undefined) {
            updateFields.push('cost_of_good = ?');
            params.push(cost_of_good);
        }
        if (purchase_location !== undefined) {
            updateFields.push('purchase_location = ?');
            params.push(purchase_location);
        }
        if (shipping_cost !== undefined) {
            updateFields.push('shipping_cost = ?');
            params.push(shipping_cost);
        }
        if (note !== undefined) {
            updateFields.push('note = ?');
            params.push(note);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            params.push(phone);
        }
        if (customer_name !== undefined) {
            updateFields.push('customer_name = ?');
            params.push(customer_name);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }

        // Add the id to the params array
        params.push(id);

        const query = `
            UPDATE orders 
            SET ${updateFields.join(', ')}
            WHERE id = ?
        `;

        db.run(query, params, function(err) {
            if (err) {
                console.error('Error updating order:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Get the updated order
            db.get(`
                SELECT o.*, 
                       m.name as machine_name,
                       mt.name as machine_type_name,
                       mst.name as machine_subtype_name
                FROM orders o
                LEFT JOIN machines m ON o.machine_id = m.id
                LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
                LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
                WHERE o.id = ?
            `, [id], (err, updatedOrder) => {
                if (err) {
                    console.error('Error fetching updated order:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({
                    message: 'Order updated successfully',
                    order: updatedOrder
                });
            });
        });
    });
});

// Delete an order
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Order deleted successfully' });
    });
});

module.exports = router; 