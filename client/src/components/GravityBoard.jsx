import React, { useEffect, useState, useRef } from 'react';
import TaskCard from './TaskCard'; 
import FocusMode from './FocusMode';
import TourGuide from './TourGuide';
import { getTasks, startFocusSession } from '../utils/api';
import { useTaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, MessageSquare, SlidersHorizontal, ChevronRight, Menu, Bell, Check, Search } from 'lucide-react';
import classNames from 'classnames';

const GravityBoard = () => {
    const { 
        openCreateTask, 
        activeView, 
        tasks, 
        refreshTasks, 
        toggleMobileSidebar,
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        requestNotificationPermission
    } = useTaskContext();
    const [activeFocusSession, setActiveFocusSession] = useState(null);
    const [groupedTasks, setGroupedTasks] = useState({});

    // Notification State
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    // Filter States
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Close notification panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        } else if (activeView === 'favorites') {
            data = data.filter(t => t.priority === 'high');
        }
        else if (activeView === 'completed') {
            data = data.filter(t => t.section === 'Completed');
        }
        // 'project' view shows all (or default)

        // Apply Custom Filters
        if (filterType !== 'all') {
            data = data.filter(t => t.type === filterType);
        }
        if (filterPriority !== 'all') {
            data = data.filter(t => t.priority === filterPriority);
        }

        // Apply Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(t => 
                t.title.toLowerCase().includes(query) || 
                (t.description && t.description.toLowerCase().includes(query))
            );
        }
        
        // Group by Section
        const groups = data.reduce((acc, task) => {
            const section = task.section || 'Inbox';
            if (!acc[section]) acc[section] = [];
            acc[section].push(task);
            // Sort by Gravity Score Descending (Heaviest/Most Important first)
            acc[section].sort((a, b) => (b.gravityScore || 0) - (a.gravityScore || 0));
            return acc;
        }, {});

        // Ensure default columns exist if you want fixed structure
        if (activeView !== 'completed') {
            if (!groups['Planning']) groups['Planning'] = [];
            if (!groups['In Progress']) groups['In Progress'] = [];
            if (!groups['Completed']) groups['Completed'] = [];
        } else {
            if (!groups['Completed']) groups['Completed'] = [];
        }
        
        setGroupedTasks(groups);
    }, [tasks, activeView, filterType, filterPriority, searchQuery]);

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

    const sections = activeView === 'completed' ? ['Completed'] : ['Planning', 'In Progress', 'Completed'];

    return (
        <div className="flex-1 min-h-screen bg-midnight text-t-primary pt-6 transition-all will-change-transform relative overflow-hidden">
             <TourGuide />
             {/* Background Detail - Faint Abstract Field */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon/5 to-transparent opacity-50 pointer-events-none z-0"></div>

             <AnimatePresence>
                {activeFocusSession && (
                    <FocusMode session={activeFocusSession} onExit={handleExitFocus} />
                )}
            </AnimatePresence>

             {/* Header Region */}
            <header className="px-6 py-4 mb-2 relative z-50 border-b border-white/5 bg-midnight/50 backdrop-blur-sm">
                
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button 
                            onClick={toggleMobileSidebar}
                            className="md:hidden p-2 -ml-2 text-t-secondary hover:text-t-primary"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-3xl font-bold text-t-primary tracking-wide leading-tight hidden md:block">GravityBoard</h1>
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 md:w-64 md:ml-8">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-t-disabled" size={16} />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full bg-elevated border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-t-primary focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all outline-none placeholder-t-disabled"
                            />
                        </div>

                        {/* Filters */}
                        <div className="hidden md:flex items-center gap-2">
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

                        <button className="hidden md:block text-t-disabled hover:text-t-primary transition-colors"><MoreHorizontal size={20} /></button>
                    </div>
                    
                    {/* Mobile Filters (Row 2) */}
                    <div className="flex md:hidden gap-2 w-full mt-2">
                         <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="flex-1 bg-elevated text-xs text-t-secondary border-none rounded-lg focus:ring-1 focus:ring-neon py-3 px-2"
                             >
                                 <option value="all">Types</option>
                                 <option value="general">General</option>
                                 <option value="email">Email</option>
                                 <option value="reminder">Reminder</option>
                                 <option value="calendar">Calendar</option>
                             </select>

                             <select 
                                value={filterPriority} 
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="flex-1 bg-elevated text-xs text-t-secondary border-none rounded-lg focus:ring-1 focus:ring-neon py-3 px-2"
                             >
                                 <option value="all">Priorities</option>
                                 <option value="low">Low</option>
                                 <option value="medium">Medium</option>
                                 <option value="high">High</option>
                             </select>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">

                        {/* Notification Bell */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => {
                                    setIsNotifOpen(!isNotifOpen);
                                    if (!isNotifOpen) requestNotificationPermission(); 
                                }}
                                className={classNames(
                                    "p-2 rounded-lg transition-colors relative",
                                    isNotifOpen ? "bg-white/10 text-neon" : "text-t-secondary hover:text-t-primary hover:bg-white/5"
                                )}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-surface" />
                                )}
                            </button>

                            {/* Notification Panel */}
                            {isNotifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-80 bg-elevated border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[400px]">
                                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-surface">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-t-secondary">Notifications</h4>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-[10px] text-neon hover:underline">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-t-disabled text-sm flex flex-col items-center gap-2">
                                                <Bell size={24} className="opacity-20" />
                                                <p>No new notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif.id} 
                                                    className={classNames(
                                                        "p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 group relative",
                                                        !notif.read ? "bg-neon/5" : ""
                                                    )}
                                                >
                                                    <div className={classNames(
                                                        "mt-1 w-1.5 h-1.5 rounded-full shrink-0",
                                                        !notif.read ? "bg-neon" : "bg-transparent"
                                                    )} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={classNames("text-xs font-medium truncate", !notif.read ? "text-t-primary" : "text-t-secondary")}>
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-t-disabled line-clamp-2 mt-0.5">{notif.body}</p>
                                                        <p className="text-[10px] text-t-disabled mt-1.5">
                                                            {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </p>
                                                    </div>
                                                    {!notif.read && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                                                            className="absolute right-2 top-2 p-3 sm:p-1 text-t-disabled hover:text-neon opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={16} className="sm:w-3 sm:h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                    data-tour="add-task-btn"
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
                
                
            </div>
        </div>
    );
};

export default GravityBoard;
