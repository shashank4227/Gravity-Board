const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { calculateGravity } = require('../utils/gravityEngine');

// GET all tasks (eventually will return only surfaced ones)
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        
        // Recalculate gravity for all tasks based on current time (and potential user context from query)
        // For now, assuming context is passed via query params or defaults
        const userContext = {
            energyLevel: req.query.energyLevel || 'medium',
            location: req.query.location
        };

        const tasksWithGravity = tasks.map(task => {
            const gravity = calculateGravity(task.toObject(), userContext);
            return { ...task.toObject(), gravityScore: gravity };
        });

        // Sort by gravity desc
        tasksWithGravity.sort((a, b) => b.gravityScore - a.gravityScore);

        res.json(tasksWithGravity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new task
router.post('/', auth, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        energyLevel: req.body.energyLevel,
        urgency: req.body.urgency,
        effort: req.body.effort,
        deadline: req.body.deadline,
        contextTags: req.body.contextTags,
        recurrence: req.body.recurrence,
        section: req.body.section,
        user: req.user.id
    });

    // Calculate initial gravity
    task.gravityScore = calculateGravity(task.toObject());

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update task gravity/status
router.patch('/:id/interactions', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Update logic based on interactions (e.g., procrastinated -> lower gravity temporarily?)
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
