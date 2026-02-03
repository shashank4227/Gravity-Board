import { useEffect, useRef } from 'react';

const useTaskNotifications = (tasks) => {
    // Track sent notifications to prevent duplicates
    // Format: "taskId-threshold" e.g. "123-1hour", "123-10min"
    const sentNotifications = useRef(new Set());

    useEffect(() => {
        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkDeadlines = () => {
             if (Notification.permission !== 'granted') return;

             const now = new Date();

             tasks.forEach(task => {
                 if (!task.deadline || task.status === 'completed') return;

                 const deadline = new Date(task.deadline);
                 const diff = deadline - now;
                 const diffMinutes = Math.floor(diff / 1000 / 60);

                 // Thresholds
                 // 1 Hour (60 mins) - Check window: 59 to 61 minutes
                 if (diffMinutes >= 59 && diffMinutes <= 61) {
                     const key = `${task._id}-1hour`;
                     if (!sentNotifications.current.has(key)) {
                         new Notification(`GravityBoard: Task Due Soon`, {
                             body: `"${task.title}" is due in 1 hour.`,
                             icon: '/favicon.ico' // generic icon if avail
                         });
                         sentNotifications.current.add(key);
                     }
                 }

                 // 10 Minutes - Check window: 9 to 11 minutes
                 if (diffMinutes >= 9 && diffMinutes <= 11) {
                     const key = `${task._id}-10min`;
                     if (!sentNotifications.current.has(key)) {
                         new Notification(`GravityBoard: Task Immediate Deadline`, {
                             body: `"${task.title}" is due in 10 minutes!`,
                             icon: '/favicon.ico'
                         });
                         sentNotifications.current.add(key);
                     }
                 }
             });
        };

        // Check every minute
        const intervalId = setInterval(checkDeadlines, 60 * 1000);
        
        // Initial check
        checkDeadlines();

        return () => clearInterval(intervalId);
    }, [tasks]);
};

export default useTaskNotifications;
