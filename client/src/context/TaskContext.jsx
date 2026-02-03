import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getTasks } from '../utils/api';
import { useAuth } from './AuthContext';
import useTaskNotifications from '../hooks/useTaskNotifications';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    // Data State
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Modal State
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [createTaskSection, setCreateTaskSection] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    // Navigation/View State
    const [activeView, setActiveView] = useState('project'); // 'inbox', 'today', 'upcoming', 'project'
    const [activeProject, setActiveProject] = useState('GravityBoard'); // Default project or 'General'

    // Notification Logic
    const { notifications, unreadCount, markRead, markAllRead, requestPermission } = useTaskNotifications(tasks);

    const refreshTasks = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to refresh tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        if (isAuthenticated) {
            refreshTasks();
        } else {
            setTasks([]);
        }
    }, [isAuthenticated]);

    // Derived State
    const counts = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        
        return {
            inbox: tasks.filter(t => !t.section || t.section === 'Inbox').length,
            today: tasks.filter(t => t.deadline && t.deadline.startsWith(todayStr)).length,
            upcoming: tasks.filter(t => t.deadline && t.deadline > todayStr).length,
        };
    }, [tasks]);

    const projects = useMemo(() => {
        const uniqueSections = [...new Set(tasks.map(t => t.section))].filter(s => s && s !== 'Inbox' && s !== 'General');
        return uniqueSections.sort();
    }, [tasks]);

    const openCreateTask = (section = '') => {
        setCreateTaskSection(section);
        setEditingTask(null);
        setIsCreateTaskOpen(true);
    };

    const openEditTask = (task) => {
        setEditingTask(task);
        setIsCreateTaskOpen(true);
    };

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

    const closeCreateTask = () => {
        setIsCreateTaskOpen(false);
        setCreateTaskSection('');
        setEditingTask(null);
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            isLoading,
            refreshTasks,
            counts,
            projects,
            isCreateTaskOpen,
            createTaskSection,
            openCreateTask,
            closeCreateTask,
            editingTask,
            openEditTask,
            activeView,
            setActiveView,
            activeProject,
            setActiveProject,
            isMobileSidebarOpen,
            toggleMobileSidebar: () => setIsMobileSidebarOpen(prev => !prev),
            setIsMobileSidebarOpen, // Expose explicit setter
            notifications,
            unreadCount,
            markRead,
            markAllRead,
            requestNotificationPermission: requestPermission
        }}>
            {children}
        </TaskContext.Provider>
    );
};
