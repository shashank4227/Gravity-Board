import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { ChevronDown, Plus, Search, Inbox, Calendar, CalendarDays, Hash } from 'lucide-react';

const Sidebar = () => {
    const { openCreateTask, setActiveView, activeView } = useTaskContext();

    return (
        <aside className="w-64 bg-surface border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto z-40 shrink-0">
            {/* User Profile Header */}
            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        AG
                    </div>
                    <span className="font-medium text-sm text-t-primary">AntiGravity User</span>
                </div>
                <ChevronDown size={14} className="text-t-secondary" />
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-neon hover:bg-white/5 rounded-lg transition-colors font-semibold text-sm">
                    <div className="bg-neon/20 p-1 rounded-full text-neon">
                        <Plus size={16} />
                    </div>
                    Add task
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Search size={18} /> Search
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Inbox size={18} /> Inbox
                    <span className="ml-auto text-xs text-t-disabled">5</span>
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm active-nav-item bg-white/5 text-t-primary">
                    <Calendar size={18} className="text-status-success"/> Today
                    <span className="ml-auto text-xs text-t-disabled">12</span>
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <CalendarDays size={18} className="text-neon-glow"/> Upcoming
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Hash size={18} /> Filters & Labels
                </button>
            </div>

            {/* Favorites Section */}
            <div className="mt-6 px-3">
                <div className="flex items-center justify-between px-2 mb-2 text-t-disabled hover:text-t-secondary cursor-pointer group">
                    <span className="text-xs font-bold uppercase tracking-wider">Favorites</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                        <span className="text-neon-cyan text-lg leading-3">•</span> Deep Work
                    </button>
                    <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                        <span className="text-status-warning text-lg leading-3">•</span> Backend API
                    </button>
                </div>
            </div>

            {/* My Projects */}
            <div className="mt-6 px-3 mb-auto">
                <div className="flex items-center justify-between px-2 mb-2 text-t-disabled hover:text-t-secondary cursor-pointer group">
                    <span className="text-xs font-bold uppercase tracking-wider">My Projects</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                     <button 
                        onClick={() => setActiveView('project')}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm font-medium ${activeView === 'project' ? 'bg-white/10 text-t-primary' : 'text-t-secondary hover:bg-white/5 hover:text-t-primary'}`}
                    >
                        <Hash size={16} /> GravityBoard
                        <span className="ml-auto text-xs text-t-disabled">22</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                        <Hash size={16} /> Marketing
                    </button>
                     <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                        <Hash size={16} /> Roadmap 2026
                    </button>
                </div>
            </div>

             {/* Bottom Actions */}
             <div className="p-3 border-t border-white/5 mt-4 space-y-1">
                <button className="w-full flex items-center gap-3 px-2 py-1.5 text-t-secondary hover:bg-white/5 hover:text-t-primary rounded-lg transition-colors text-sm">
                    <Plus size={16} /> Add a team
                </button>
             </div>
        </aside>
    );
};

export default Sidebar;
