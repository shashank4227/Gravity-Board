const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
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
    
    // Action Item Specifics
    type: {
        type: String,
        enum: ['general', 'email', 'reminder', 'calendar'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    actionPayload: {
        type: mongoose.Schema.Types.Mixed, // Flexible storage for email details, etc.
        default: {}
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
    },
    completedAt: {
        type: Date
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
