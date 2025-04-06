const db = require('../config/database');

// Create orders table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL DEFAULT CURRENT_DATE,
    machine_id INTEGER NOT NULL,
    machine_type_id INTEGER NOT NULL,
    machine_subtype_id INTEGER NOT NULL,
    source TEXT,
    price INTEGER NOT NULL,
    cost_of_good INTEGER NOT NULL,
    shipping_cost INTEGER,
    purchase_location TEXT,
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines (id),
    FOREIGN KEY (machine_type_id) REFERENCES machine_types (id),
    FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes (id)
  )
`);

// Get all orders with related data
const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        o.*,
        m.name as machine_name,
        mt.name as machine_type_name,
        mst.name as machine_subtype_name
      FROM orders o
      LEFT JOIN machines m ON o.machine_id = m.id
      LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
      LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
      ORDER BY o.date DESC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get a single order by ID
const getOrderById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT 
        o.*,
        m.name as machine_name,
        mt.name as machine_type_name,
        mst.name as machine_subtype_name
      FROM orders o
      LEFT JOIN machines m ON o.machine_id = m.id
      LEFT JOIN machine_types mt ON o.machine_type_id = mt.id
      LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.id
      WHERE o.id = ?
    `, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Create a new order
const createOrder = (order) => {
  return new Promise((resolve, reject) => {
    const {
      date,
      machine_id,
      machine_type_id,
      machine_subtype_id,
      source,
      price,
      cost_of_good,
      shipping_cost,
      purchase_location,
      note
    } = order;

    db.run(`
      INSERT INTO orders (
        date,
        machine_id,
        machine_type_id,
        machine_subtype_id,
        source,
        price,
        cost_of_good,
        shipping_cost,
        purchase_location,
        note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      date,
      machine_id,
      machine_type_id,
      machine_subtype_id,
      source,
      price,
      cost_of_good,
      shipping_cost,
      purchase_location,
      note
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...order });
      }
    });
  });
};

// Update an existing order
const updateOrder = (id, order) => {
  return new Promise((resolve, reject) => {
    const {
      date,
      machine_id,
      machine_type_id,
      machine_subtype_id,
      source,
      price,
      cost_of_good,
      shipping_cost,
      purchase_location,
      note
    } = order;

    db.run(`
      UPDATE orders
      SET 
        date = ?,
        machine_id = ?,
        machine_type_id = ?,
        machine_subtype_id = ?,
        source = ?,
        price = ?,
        cost_of_good = ?,
        shipping_cost = ?,
        purchase_location = ?,
        note = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      date,
      machine_id,
      machine_type_id,
      machine_subtype_id,
      source,
      price,
      cost_of_good,
      shipping_cost,
      purchase_location,
      note,
      id
    ], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id, ...order });
      }
    });
  });
};

// Delete an order
const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM orders WHERE id = ?', [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id });
      }
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}; 