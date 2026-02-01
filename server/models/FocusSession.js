const mongoose = require('mongoose');

const FocusSessionSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    actualDurationMinutes: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    status: {
        type: String,
        enum: ['completed', 'aborted', 'paused'],
        default: 'paused' // Initial state until completed/aborted
    },
    energyLevelOfUser: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    distractionCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('FocusSession', FocusSessionSchema);
