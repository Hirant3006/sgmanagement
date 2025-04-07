const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', (req, res) => {
    // Extract filter parameters from query
    const {
        dateFrom,
        dateTo,
        machineId,
        machineTypeId,
        machineSubtypeId,
        source,
        priceMin,
        priceMax,
        costOfGoodMin,
        costOfGoodMax,
        shippingCostMin,
        shippingCostMax,
        purchaseLocation
    } = req.query;

    console.log('Filter parameters received:', {
        dateFrom,
        dateTo,
        machineId,
        machineTypeId,
        machineSubtypeId,
        source,
        priceMin,
        priceMax,
        costOfGoodMin,
        costOfGoodMax,
        shippingCostMin,
        shippingCostMax,
        purchaseLocation
    });

    // Build the SQL query with filters
    let sql = `
        SELECT o.*, 
               m.name as machine_name,
               mt.name as machine_type_name,
               mst.name as machine_subtype_name
        FROM orders o
        LEFT JOIN machines m ON o.machine_id = m.id
        LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
        LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
        WHERE 1=1
    `;
    
    const params = [];

    try {
        // Add date range filter
        if (dateFrom) {
            sql += ` AND o.date >= ?`;
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += ` AND o.date <= ?`;
            params.push(dateTo);
        }

        // Add machine filter
        if (machineId) {
            sql += ` AND o.machine_id = ?`;
            params.push(machineId);
        }

        // Add machine type filter
        if (machineTypeId) {
            sql += ` AND o.machine_type_id = ?`;
            params.push(machineTypeId);
        }

        // Add machine subtype filter
        if (machineSubtypeId) {
            sql += ` AND o.machine_subtype_id = ?`;
            params.push(machineSubtypeId);
        }

        // Add source filter (partial match)
        if (source) {
            sql += ` AND o.source LIKE ?`;
            params.push(`%${source}%`);
        }

        // Add price range filter
        if (priceMin) {
            sql += ` AND o.price >= ?`;
            params.push(priceMin);
        }
        if (priceMax) {
            sql += ` AND o.price <= ?`;
            params.push(priceMax);
        }

        // Add cost of good range filter
        if (costOfGoodMin) {
            sql += ` AND o.cost_of_good >= ?`;
            params.push(costOfGoodMin);
        }
        if (costOfGoodMax) {
            sql += ` AND o.cost_of_good <= ?`;
            params.push(costOfGoodMax);
        }

        // Add shipping cost range filter
        if (shippingCostMin) {
            sql += ` AND (o.shipping_cost >= ? OR o.shipping_cost IS NULL)`;
            params.push(shippingCostMin);
        }
        if (shippingCostMax) {
            sql += ` AND (o.shipping_cost <= ? OR o.shipping_cost IS NULL)`;
            params.push(shippingCostMax);
        }

        // Add purchase location filter (partial match)
        if (purchaseLocation) {
            sql += ` AND o.purchase_location LIKE ?`;
            params.push(`%${purchaseLocation}%`);
        }

        // Add ordering
        sql += ` ORDER BY o.date DESC`;
        
        console.log('SQL Query:', sql);
        console.log('Parameters:', params);
        
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({ 
                    error: 'Internal server error', 
                    details: err.message,
                    sql: sql,
                    params: params
                });
            }
            console.log(`Found ${rows.length} orders`);
            res.json(rows);
        });
    } catch (error) {
        console.error('Error building query:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
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