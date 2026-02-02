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
        priority: req.body.priority, // Added
        type: req.body.type,         // Added
        actionPayload: req.body.actionPayload, // Added
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

// PATCH generic update (for status, priority, etc.)
router.patch('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Update fields if they exist in body
        const updates = ['title', 'description', 'status', 'priority', 'type', 'actionPayload', 'deadline', 'section', 'energyLevel', 'urgency', 'effort'];
        
        updates.forEach(field => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        // Recalculate gravity if metrics changed
        if (req.body.urgency || req.body.effort || req.body.priority) {
             task.gravityScore = calculateGravity(task.toObject()); 
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        await Task.deleteOne({ _id: req.params.id });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST execute action (e.g., send email)
const { sendEmail } = require('../services/emailService');

router.post('/:id/execute', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.type === 'email') {
            const { recipient, subject, body } = task.actionPayload || {};
            if (!recipient) return res.status(400).json({ message: 'No recipient defined for email task' });
            
            await sendEmail(recipient, subject || task.title, body || task.description);
            
            task.status = 'completed';
            task.completedAt = new Date();
            await task.save();
            
            return res.json({ message: 'Email sent and task completed', task });
        }
        
        // Handle other types or default
        res.json({ message: 'Action executed', task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update task gravity/status (specific interaction)
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
