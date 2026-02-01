const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    
    // Core AntiGravity Metrics
    gravityScore: {
        type: Number,
        default: 0
    },
    energyLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    urgency: {
        type: Number, // 0-10
        default: 5
    },
    effort: {
        type: Number, // 0-10
        default: 5
    },
    
    // Context
    contextTags: [{
        type: String // e.g., 'home', 'work', 'mobile', 'desktop'
    }],
    
    // Time & Status
    deadline: Date,
    status: {
        type: String,
        enum: ['floating', 'surfaced', 'completed'],
        default: 'floating'
    },
    
    // Recurrence & Organization
    recurrence: {
        frequency: {
            type: String,
            enum: ['none', 'daily', 'weekly', 'monthly'],
            default: 'none'
        },
        interval: {
            type: Number, // e.g., every 2 weeks
            default: 1
        }
    },
    section: {
        type: String, // e.g., 'Work', 'Personal', 'Health'
        default: 'General',
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to recalculate gravity (simplified version for now)
TaskSchema.methods.calculateGravity = function() {
    // Basic formula: (Urgency * 2) + Effort
    // This will be expanded later
    this.gravityScore = (this.urgency * 2) + this.effort;
    return this.gravityScore;
};

module.exports = mongoose.model('Task', TaskSchema);
