const express = require('express');
const router = express.Router();
const FocusSession = require('../models/FocusSession');
const Task = require('../models/Task');
const { calculateOptimalDuration } = require('../utils/focusLogic');

// POST /api/focus/start
// Request: { taskId, userEnergy }
// Response: { sessionId, durationMinutes, taskTitle }
router.post('/start', async (req, res) => {
    try {
        const { taskId, userEnergy } = req.body;
        
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const duration = calculateOptimalDuration(task, userEnergy);

        const session = new FocusSession({
            taskId,
            durationMinutes: duration,
            energyLevelOfUser: userEnergy,
            status: 'started' // Custom status for active
        });

        await session.save();

        res.json({
            sessionId: session._id,
            durationMinutes: duration,
            taskTitle: task.title,
            intention: `Focus on ${task.title}`
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/focus/complete
// Request: { sessionId, success (bool), distractions (int) }
router.post('/complete', async (req, res) => {
    try {
        const { sessionId, success, distractions } = req.body;
        
        const session = await FocusSession.findById(sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        session.endTime = new Date();
        session.actualDurationMinutes = (session.endTime - session.startTime) / 60000;
        session.status = success ? 'completed' : 'aborted';
        session.distractionCount = distractions || 0;

        await session.save();

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
