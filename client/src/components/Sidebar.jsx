import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Plus, Search, Calendar, CalendarDays, Hash, LogOut, User, X } from 'lucide-react';
import classNames from 'classnames';

const Sidebar = () => {
    const { 
        openCreateTask, 
        setActiveView, 
        activeView, 
        counts, 
        projects, 
        isMobileSidebarOpen, 
        toggleMobileSidebar
    } = useTaskContext();
    
    const { user, logout } = useAuth();

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'AG';
    };

    const handleNavigation = (callback) => {
        if (callback) callback();
        if (isMobileSidebarOpen) toggleMobileSidebar();
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={classNames(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity",
                    isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleMobileSidebar}
            />

            <aside className={classNames(
                "fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[300px] md:w-64 bg-surface border-r border-white/5 flex flex-col h-screen transition-transform duration-300 md:translate-x-0 md:static md:shrink-0",
                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
            {/* User Profile Header */}
            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group relative border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {getInitials(user?.username)}
                    </div>
                    <span className="font-medium text-sm text-t-primary truncate max-w-[120px]">
                        {user?.username || 'Guest'}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => {
                            localStorage.removeItem("gravityBoard_intro_completed");
                            localStorage.removeItem("gravityBoard_gravity_explained"); // Reset gravity tour too
                            window.location.reload();
                        }} 
                        className="p-1.5 text-t-secondary hover:text-neon transition-colors rounded-lg hover:bg-white/5" 
                        title="Take Tour"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </button>
                     <button onClick={logout} className="p-1.5 text-t-secondary hover:text-status-error transition-colors rounded-lg hover:bg-white/5" title="Logout">
                        <LogOut size={18} />
                    </button>
                    <button 
                        onClick={toggleMobileSidebar}
                        className="md:hidden p-1.5 text-t-secondary hover:text-t-primary transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 space-y-1 mt-2">
                <button 
                    onClick={() => handleNavigation(() => openCreateTask())}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-neon hover:bg-white/5 rounded-lg transition-colors font-semibold text-sm"
                >
                    <div className="bg-neon/20 p-1 rounded-full text-neon">
                        <Plus size={16} />
                    </div>
                    Add task
                </button>
                
                <button 
                    onClick={() => handleNavigation(() => setActiveView('today'))}
                    className={classNames(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                         activeView === 'today' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                    )}
                >
                    <Calendar size={18} className="text-status-success"/> Today
                    {counts?.today > 0 && <span className="ml-auto text-xs text-t-disabled">{counts.today}</span>}
                </button>
                <button 
                     onClick={() => handleNavigation(() => setActiveView('upcoming'))}
                     className={classNames(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                         activeView === 'upcoming' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                    )}
                >
                    <CalendarDays size={18} className="text-neon-glow"/> Upcoming
                    {counts?.upcoming > 0 && <span className="ml-auto text-xs text-t-disabled">{counts.upcoming}</span>}
                </button>
            </div>

            {/* Favorites Section */}
            <div className="mt-6 px-3">
                <div className="flex items-center justify-between px-2 mb-2 text-t-disabled hover:text-t-secondary cursor-pointer group">
                    <span className="text-xs font-bold uppercase tracking-wider">Favorites</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                    <button 
                        onClick={() => handleNavigation(() => setActiveView('favorites'))}
                        className={classNames(
                            "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-sm",
                            activeView === 'favorites' ? "bg-white/5 text-t-primary" : "text-t-secondary hover:bg-white/5 hover:text-t-primary"
                        )}
                    >
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
                        onClick={() => handleNavigation(() => setActiveView('project'))}
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


        </aside>
        </>
    );
};

export default Sidebar;
