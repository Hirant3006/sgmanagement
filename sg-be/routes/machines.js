const express = require('express');
const router = express.Router();
const Machine = require('../models/machine');

// Get all machines
router.get('/', async (req, res) => {
    try {
        const machines = await Machine.getAll();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

// Create new machine
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const id = await Machine.create(name);
        res.status(201).json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

// Delete machine
router.delete('/:id', async (req, res) => {
    try {
        const changes = await Machine.delete(req.params.id);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 