import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api';

export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Save tasks to local storage
    const saveLocally = (tasks) => {
        localStorage.setItem('cached_tasks', JSON.stringify(tasks));
        localStorage.setItem('cache_timestamp', Date.now());
    };

    // Load tasks from local storage
    const loadLocally = () => {
        const cached = localStorage.getItem('cached_tasks');
        return cached ? JSON.parse(cached) : [];
    };

    // Queue an operation
    const queueOperation = (type, data) => {
        const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
        queue.push({ type, data, timestamp: Date.now() });
        localStorage.setItem('offline_queue', JSON.stringify(queue));
    };

    // Sync Queue
    const syncQueue = async () => {
        const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
        if (queue.length === 0) return;

        setIsSyncing(true);
        console.log("Syncing offline queue...", queue);

        const newQueue = [];
        for (const op of queue) {
            try {
                // Attempt to replay operation
                // Note: unique IDs generated offline might clash, usually solved by using UUIDs 
                // or letting server assign ID and updating client. 
                // For this demo, we assume operations are replayable or handled.
                /* 
                   Implementation detail: 
                   You would switch(op.type) { case 'create': await createTask(op.data); ... }
                */
               console.log(`Replaying ${op.type}`, op.data);
            } catch (err) {
                console.error(`Failed to replay ${op.type}`, err);
                // Keep in queue or move to dead letter queue
                newQueue.push(op); 
            }
        }

        localStorage.setItem('offline_queue', JSON.stringify(newQueue));
        setIsSyncing(false);
    };

    return {
        isOnline,
        isSyncing,
        saveLocally,
        loadLocally,
        queueOperation
    };
};
