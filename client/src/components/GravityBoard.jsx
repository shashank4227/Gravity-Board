import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard'; 
import FocusMode from './FocusMode';
import { getTasks, startFocusSession } from '../utils/api';
import { useTaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Share2, MessageSquare, SlidersHorizontal, UserPlus, ChevronRight } from 'lucide-react';

const GravityBoard = () => {
    const { openCreateTask, activeView, tasks, refreshTasks } = useTaskContext();
    const [activeFocusSession, setActiveFocusSession] = useState(null);
    const [groupedTasks, setGroupedTasks] = useState({});

    // Filter States
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Grouping Logic
    useEffect(() => {
        let data = [...tasks]; // Use tasks from context

        // Filter based on activeView
        if (activeView === 'inbox') {
            data = data.filter(t => !t.section || t.section === 'Inbox');
        } else if (activeView === 'today') {
            const today = new Date().toISOString().split('T')[0];
            data = data.filter(t => t.deadline && t.deadline.startsWith(today));
        } else if (activeView === 'upcoming') {
            const today = new Date().toISOString().split('T')[0];
            data = data.filter(t => t.deadline && t.deadline > today);
        }
        // 'project' view shows all (or default)

        // Apply Custom Filters
        if (filterType !== 'all') {
            data = data.filter(t => t.type === filterType);
        }
        if (filterPriority !== 'all') {
            data = data.filter(t => t.priority === filterPriority);
        }
        
        // Group by Section
        const groups = data.reduce((acc, task) => {
            const section = task.section || 'Inbox';
            if (!acc[section]) acc[section] = [];
            acc[section].push(task);
            return acc;
        }, {});

        // Ensure default columns exist if you want fixed structure
        if (!groups['Planning']) groups['Planning'] = [];
        if (!groups['In Progress']) groups['In Progress'] = [];
        
        setGroupedTasks(groups);
    }, [tasks, activeView, filterType, filterPriority]);

    const handleTaskCreated = () => {
        refreshTasks();
    };

    const handleEnterFocus = async (task) => {
        const session = await startFocusSession(task._id, task.energyLevel || 'medium');
        setActiveFocusSession(session);
    };

    const handleExitFocus = () => {
        setActiveFocusSession(null);
        handleTaskCreated();
    };

    const sections = ['Planning', 'In Progress'];

    return (
        <div className="flex-1 min-h-screen bg-midnight text-t-primary pt-6 transition-all will-change-transform relative overflow-hidden">
             
             {/* Background Detail - Faint Abstract Field */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon/5 to-transparent opacity-50 pointer-events-none z-0"></div>

             <AnimatePresence>
                {activeFocusSession && (
                    <FocusMode session={activeFocusSession} onExit={handleExitFocus} />
                )}
            </AnimatePresence>

             {/* Header Region */}
            <header className="px-6 py-4 mb-2 relative z-10 border-b border-white/5 bg-midnight/50 backdrop-blur-sm">
                
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-t-primary tracking-wide leading-tight">GravityBoard</h1>
                        
                        {/* Filters */}
                        <div className="flex items-center gap-2 ml-8">
                             <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-elevated text-xs text-t-secondary border-none rounded-lg focus:ring-1 focus:ring-neon"
                             >
                                 <option value="all">All Types</option>
                                 <option value="general">General</option>
                                 <option value="email">Email</option>
                                 <option value="reminder">Reminder</option>
                                 <option value="calendar">Calendar</option>
                             </select>

                             <select 
                                value={filterPriority} 
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="bg-elevated text-xs text-t-secondary border-none rounded-lg focus:ring-1 focus:ring-neon"
                             >
                                 <option value="all">All Priorities</option>
                                 <option value="low">Low</option>
                                 <option value="medium">Medium</option>
                                 <option value="high">High</option>
                             </select>
                        </div>

                        <button className="text-t-disabled hover:text-t-primary transition-colors"><MoreHorizontal size={20} /></button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                             <button className="w-8 h-8 rounded-full bg-surface border-2 border-dashed border-t-disabled flex items-center justify-center text-t-disabled hover:text-t-primary hover:border-t-primary transition-colors">
                                <UserPlus size={14} />
                             </button>
                        </div>
                        <span className="text-t-disabled text-sm">Share</span>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <button className="flex items-center gap-2 text-sm text-t-secondary hover:text-t-primary transition-colors">
                            <SlidersHorizontal size={16} /> View
                        </button>
                         <button className="text-t-secondary hover:text-t-primary transition-colors">
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Kanban Board Layout */}
            <div className="px-8 flex gap-8 overflow-x-auto pb-8 h-[calc(100vh-160px)] relative z-10">
                 {/* Emotional Empty State Helper */}
                 {tasks.length === 0 && (
                     <div className="absolute top-1/3 left-12 text-t-disabled/40 font-mono text-sm pointer-events-none">
                         This space fills as you define your gravity.
                     </div>
                 )}

                {sections.map((section, sectionIndex) => {
                    const isHighPriority = section === 'In Progress';
                    
                    return (
                        <div 
                            key={section} 
                            className="min-w-[320px] w-[320px] flex flex-col group/column"
                        >
                            {/* Column Header */}
                            <div className={`flex items-center justify-between mb-6 pl-4 border-l-2 transition-all duration-300 ${isHighPriority ? 'border-neon' : 'border-white/5 group-hover/column:border-white/20'}`}>
                                <h3 className={`font-medium text-sm flex items-center gap-3 ${isHighPriority ? 'text-t-primary font-bold' : 'text-t-secondary'}`}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${isHighPriority ? 'bg-neon/10 text-neon' : 'bg-white/5 text-t-secondary'}`}>
                                        {section}
                                    </span>
                                    <span className={`text-xs text-t-disabled`}>
                                        {groupedTasks[section]?.length || 0}
                                    </span>
                                </h3>
                                <div className="flex gap-2 opacity-0 group-hover/column:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openCreateTask(section)}
                                        className="text-t-disabled hover:text-t-primary"
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <button className="text-t-disabled hover:text-t-primary"><MoreHorizontal size={16} /></button>
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="flex-1 space-y-3">
                                {(groupedTasks[section] || []).map((task) => (
                                    <TaskCard 
                                        key={task._id}
                                        task={{...task, onFocus: handleEnterFocus}}
                                        variant="minimal" 
                                    />
                                ))}
                                
                                {/* Add Task Button at bottom of column */}
                                <button 
                                    onClick={() => openCreateTask(section)}
                                    className="w-full flex items-center gap-3 text-t-secondary hover:text-t-primary py-2 text-sm group/add opacity-60 hover:opacity-100 transition-all pl-2"
                                >
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-neon bg-neon/10 group-hover/add:bg-neon group-hover/add:text-white transition-colors transform group-hover/add:translate-x-0.5">
                                        <Plus size={14} strokeWidth={3} />
                                    </div>
                                    <span className="group-hover/add:translate-x-1 transition-transform inline-block">Add task</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
                
                {/* Add Section Column */}
                <div className="min-w-[300px] pt-2">
                    <button 
                        onClick={() => openCreateTask()}
                        className="flex items-center gap-2 text-t-disabled font-medium hover:text-t-primary transition-colors text-sm hover:translate-x-1 duration-200"
                    >
                        <Plus size={16} /> Add section
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GravityBoard;
