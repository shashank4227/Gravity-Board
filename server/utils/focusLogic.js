/**
 * Adaptive Focus Logic
 * Calculates optimal session duration based on:
 * 1. Task properties (Gravity, Effort)
 * 2. User Energy Level
 * 3. Time of Day (Circadian Rhythm - Simplified)
 */

const calculateOptimalDuration = (task, userEnergy) => {
    let baseDuration = 25; // Default Pomodoro

    // 1. Adjust by Energy Level
    switch (userEnergy) {
        case 'low':
            baseDuration = 15; // Micro-focus for low energy
            break;
        case 'medium':
            baseDuration = 25;
            break;
        case 'high':
            baseDuration = 45; // Deep work for high energy
            break;
        default:
            baseDuration = 25;
    }

    // 2. Adjust by Task Effort/Gravity (if available)
    if (task.effort) {
        if (task.effort > 7 && userEnergy === 'high') {
            baseDuration += 10; // Extend deep work for hard tasks if energy is high
        } else if (task.effort > 7 && userEnergy === 'low') {
            baseDuration -= 5; // Shorten sessions for hard tasks if energy is low (avoid burnout)
        }
    }

    // 3. Time of Day Adjustment (Simple Heuristic)
    const hour = new Date().getHours();
    const isLateNight = hour >= 22 || hour < 5;
    
    if (isLateNight) {
        baseDuration = Math.min(baseDuration, 20); // Cap at 20 mins late at night
    }

    // Cap limits
    return Math.max(5, Math.min(baseDuration, 90));
};

module.exports = { calculateOptimalDuration };
