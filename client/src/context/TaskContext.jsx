import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    // Modal State
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [createTaskSection, setCreateTaskSection] = useState('');

    // Navigation/View State
    const [activeView, setActiveView] = useState('project'); // 'inbox', 'today', 'upcoming', 'project'
    const [activeProject, setActiveProject] = useState('GravityBoard'); // Default project

    const openCreateTask = (section = '') => {
        setCreateTaskSection(section);
        setIsCreateTaskOpen(true);
    };

    const closeCreateTask = () => {
        setIsCreateTaskOpen(false);
        setCreateTaskSection('');
    };

    return (
        <TaskContext.Provider value={{
            isCreateTaskOpen,
            createTaskSection,
            openCreateTask,
            closeCreateTask,
            activeView,
            setActiveView,
            activeProject,
            setActiveProject
        }}>
            {children}
        </TaskContext.Provider>
    );
};
