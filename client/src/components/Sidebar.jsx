import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Plus, Search, Inbox, Calendar, CalendarDays, Hash, LogOut, User } from 'lucide-react';
import classNames from 'classnames';

const Sidebar = () => {
    const { openCreateTask, setActiveView, activeView, counts, projects, activeProject, setActiveProject } = useTaskContext();
    const { user, logout } = useAuth();

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'AG';
    };

    return (
        <aside className="w-64 bg-surface border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto z-40 shrink-0">
            {/* User Profile Header */}
            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {getInitials(user?.username)}
                    </div>
                    <span className="font-medium text-sm text-t-primary truncate max-w-[120px]">
                        {user?.username || 'Guest Check-in'}
                    </span>
                </div>
                {/* Simple dropdown trigger or logout for now */}
                 <button onClick={logout} className="text-t-secondary hover:text-status-error transition-colors" title="Logout">
                    <LogOut size={14} />
                </button>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 space-y-1">
                <button 
                    onClick={() => openCreateTask()}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-neon hover:bg-white/5 rounded-lg transition-colors font-semibold text-sm"
                >
                    <div className="bg-neon/20 p-1 rounded-full text-neon">
                        <Plus size={16} />
                    </div>
                    Add task
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Search size={18} /> Search
                </button>
                <button 
                    onClick={() => setActiveView('inbox')}
                    className={classNames(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                        activeView === 'inbox' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                    )}
                >
                    <Inbox size={18} /> Inbox
                    {counts?.inbox > 0 && <span className="ml-auto text-xs text-t-disabled">{counts.inbox}</span>}
                </button>
                <button 
                    onClick={() => setActiveView('today')}
                    className={classNames(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                         activeView === 'today' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                    )}
                >
                    <Calendar size={18} className="text-status-success"/> Today
                    {counts?.today > 0 && <span className="ml-auto text-xs text-t-disabled">{counts.today}</span>}
                </button>
                <button 
                     onClick={() => setActiveView('upcoming')}
                     className={classNames(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                         activeView === 'upcoming' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                    )}
                >
                    <CalendarDays size={18} className="text-neon-glow"/> Upcoming
                    {counts?.upcoming > 0 && <span className="ml-auto text-xs text-t-disabled">{counts.upcoming}</span>}
                </button>
            </div>

            {/* Favorites Section (Static for now, could be dynamic later) */}
            <div className="mt-6 px-3">
                <div className="flex items-center justify-between px-2 mb-2 text-t-disabled hover:text-t-secondary cursor-pointer group">
                    <span className="text-xs font-bold uppercase tracking-wider">Favorites</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                        <span className="text-neon-cyan text-lg leading-3">•</span> High Priority
                    </button>
                </div>
            </div>

            {/* My Projects */}
            <div className="mt-6 px-3 mb-auto">
                <div className="flex items-center justify-between px-2 mb-2 text-t-disabled hover:text-t-secondary cursor-pointer group">
                    <span className="text-xs font-bold uppercase tracking-wider">My Vectors</span>
                    <button onClick={() => openCreateTask()} className="text-t-disabled hover:text-t-primary">
                        <Plus size={12} className="group-hover:text-white" />
                    </button>
                </div>
                <div className="space-y-1">
                     <button 
                        onClick={() => setActiveView('project')}
                        className={classNames(
                            "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm font-medium",
                            activeView === 'project' ? 'bg-white/10 text-t-primary' : 'text-t-secondary hover:bg-white/5 hover:text-t-primary'
                        )}
                    >
                        <Hash size={16} /> All Projects
                        
                    </button>
                    
                    {/* Dynamic Projects List */}
                    {projects && projects.map(proj => (
                        <button 
                             key={proj}
                             // FUTURE: We could set filters to just this project
                             // onClick={() => setActiveProject(proj)} 
                             className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm"
                        >
                            <Hash size={16} /> {proj}
                        </button>
                    ))}
                    
                    {(!projects || projects.length === 0) && (
                        <div className="px-2 py-2 text-xs text-t-disabled italic">
                            No project sectors defined.
                        </div>
                    )}
                </div>
            </div>

             {/* Bottom Actions */}
             <div className="p-3 border-t border-white/5 mt-4 space-y-1">
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Plus size={16} /> Create Team Space
                </button>
             </div>
        </aside>
    );
};

export default Sidebar;
