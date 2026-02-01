/**
 * AntiGravity Task Prioritization Engine
 * 
 * Calculates a 'Gravity Score' for each task based on:
 * 1. Urgency (Deadline proximity)
 * 2. Effort (Task difficulty)
 * 3. Energy Mismatch (User's energy vs Task energy)
 * 4. Staleness (Time since creation/interaction)
 */

const calculateGravity = (task, userContext = {}) => {
    const NOW = new Date();
    const deadline = task.deadline ? new Date(task.deadline) : null;
    
    // 1. Base Gravity from User Inputs
    // Maps energy level to numeric modifier
    const energyMap = { 'low': 0.8, 'medium': 1.0, 'high': 1.2 }; 
    const taskEnergyMod = energyMap[task.energyLevel] || 1.0;
    
    let gravity = (task.urgency || 5) * (task.effort || 5) * taskEnergyMod;

    // 2. Deadline Pressure ( Exponential increase as deadline approaches )
    if (deadline) {
        const hoursRemaining = (deadline - NOW) / (1000 * 60 * 60);
        
        if (hoursRemaining < 0) {
            gravity *= 3; // Overdue!
        } else if (hoursRemaining < 24) {
            gravity *= 2.0;
        } else if (hoursRemaining < 72) {
            gravity *= 1.5;
        }
    }

    // 3. User Context Matching
    // If user's current energy matches task's needed energy, boost gravity (pull it closer)
    if (userContext.energyLevel && userContext.energyLevel === task.energyLevel) {
        gravity *= 1.2;
    }
    
    // Low energy context should prefer Low energy tasks
    if (userContext.energyLevel === 'low' && task.energyLevel === 'high') {
        gravity *= 0.5; // Push away high energy tasks
    }

    // 4. Context Tags (Location, Device)
    if (userContext.location && task.contextTags && task.contextTags.length > 0) {
        // If task has tags but none match current location, reduce gravity
        // Logic: specific context tasks shouldn't appear in wrong context
        // This requires 'location' tags to be identifiable (e.g., @home, @work)
    }

    return Math.round(gravity * 10) / 10;
};

module.exports = { calculateGravity };
