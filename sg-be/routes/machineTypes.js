const express = require('express');
const router = express.Router();
const MachineType = require('../models/machineType');

// Get all machine types
router.get('/', async (req, res) => {
    try {
        const machineTypes = await MachineType.getAll();
        res.json(machineTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get machine type by ID
router.get('/:id', async (req, res) => {
    try {
        const machineType = await MachineType.getById(req.params.id);
        if (!machineType) {
            return res.status(404).json({ error: 'Machine type not found' });
        }
        res.json(machineType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new machine type
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const id = await MachineType.create(name);
        res.status(201).json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update machine type
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const changes = await MachineType.update(req.params.id, name);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine type not found' });
        }
        res.json({ id: req.params.id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete machine type
router.delete('/:id', async (req, res) => {
    try {
        const changes = await MachineType.delete(req.params.id);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine type not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 