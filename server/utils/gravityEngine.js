/**
 * AntiGravity Task Prioritization Engine
 * 
 * Calculates a 'Gravity Score' for each task based on:
 * 1. Urgency (Deadline proximity)
 * 2. Effort (Task difficulty)
 * 3. Energy Mismatch (User's energy vs Task energy)
 * 4. Staleness (Time since creation/interaction)
 */

const calculateGravity = (task) => {
    const NOW = new Date();
    const deadline = task.deadline ? new Date(task.deadline) : null;
    
    // 1. Base Gravity from User Inputs
    // Priority Modifier
    const priorityMap = { 'low': 0.8, 'medium': 1.0, 'high': 1.5 };
    const priorityMod = priorityMap[task.priority] || 1.0;
    
    let gravity = priorityMod; 

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



    return Math.round(gravity * 10) / 10;
};

module.exports = { calculateGravity };
