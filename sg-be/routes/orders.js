const express = require('express');
const router = express.Router();
const orderModel = require('../models/order');
const machineModel = require('../models/machine');
const machineTypeModel = require('../models/machineType');
const machineSubtypeModel = require('../models/machineSubtype');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (!date || !machine_id || !machine_type_id || !machine_subtype_id || !price || !cost_of_good) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate foreign keys exist
    const [machine, machineType, machineSubtype] = await Promise.all([
      machineModel.getById(machine_id),
      machineTypeModel.getById(machine_type_id),
      machineSubtypeModel.getById(machine_subtype_id)
    ]);

    if (!machine || !machineType || !machineSubtype) {
      return res.status(400).json({ error: 'Invalid machine, machine type, or machine subtype' });
    }

    const newOrder = await orderModel.createOrder({
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
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (!date || !machine_id || !machine_type_id || !machine_subtype_id || !price || !cost_of_good) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate foreign keys exist
    const [machine, machineType, machineSubtype] = await Promise.all([
      machineModel.getById(machine_id),
      machineTypeModel.getById(machine_type_id),
      machineSubtypeModel.getById(machine_subtype_id)
    ]);

    if (!machine || !machineType || !machineSubtype) {
      return res.status(400).json({ error: 'Invalid machine, machine type, or machine subtype' });
    }

    const updatedOrder = await orderModel.updateOrder(req.params.id, {
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
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    await orderModel.deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router; 