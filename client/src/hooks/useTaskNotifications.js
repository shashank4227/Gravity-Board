import { useEffect, useRef, useState } from 'react';

const useTaskNotifications = (tasks) => {
    // Track sent notifications to prevent duplicates
    // Format: "taskId-threshold" e.g. "123-1hour", "123-10min"
    const sentNotifications = useRef(new Set());
    
    // Internal state for notification history
    const [notifications, setNotifications] = useState([]);

    const addNotification = (title, body, taskId) => {
        const newNotif = {
            id: Date.now().toString(),
            title,
            body,
            taskId,
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep last 50
    };

    const markRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const requestPermission = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            // Already granted
            new Notification(`GravityBoard`, { body: "Notifications are monitoring deadlines." });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    };

    useEffect(() => {
        // Request permission on mount if default
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
                         addNotification('Task Due Soon', `"${task.title}" is due in 1 hour.`, task._id);
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
                         addNotification('Immediate Deadline', `"${task.title}" is due in 10 minutes!`, task._id);
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

    return { 
        notifications, 
        unreadCount: notifications.filter(n => !n.read).length,
        markRead,
        markAllRead,
        requestPermission
    };
};

export default useTaskNotifications;
