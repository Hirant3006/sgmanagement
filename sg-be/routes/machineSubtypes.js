const express = require('express');
const router = express.Router();
const MachineSubtype = require('../models/machineSubtype');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all machine subtypes
router.get('/', async (req, res) => {
    try {
        const machineSubtypes = await MachineSubtype.getAll();
        res.json(machineSubtypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get machine subtype by ID
router.get('/:id', async (req, res) => {
    try {
        const machineSubtype = await MachineSubtype.getById(req.params.id);
        if (!machineSubtype) {
            return res.status(404).json({ error: 'Machine subtype not found' });
        }
        res.json(machineSubtype);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new machine subtype
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const id = await MachineSubtype.create(name);
        res.status(201).json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update machine subtype
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const changes = await MachineSubtype.update(req.params.id, name);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine subtype not found' });
        }
        res.json({ id: req.params.id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete machine subtype
router.delete('/:id', async (req, res) => {
    try {
        const changes = await MachineSubtype.delete(req.params.id);
        if (changes === 0) {
            return res.status(404).json({ error: 'Machine subtype not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 