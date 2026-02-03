import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, RefreshCw, Folder, Mail, Bell, Calendar, Play, Trash2, CheckCircle, AlertCircle, AlignLeft, Pencil, ExternalLink } from 'lucide-react';
import classNames from 'classnames';
import { executeTask, deleteTask } from '../utils/api';
import { useTaskContext } from '../context/TaskContext'; 

const TaskCard = ({ task, style }) => {
  const { title, description, gravityScore, energyLevel, deadline, contextTags, type, priority, status, actionPayload } = task;
  const [isExecuting, setIsExecuting] = useState(false);
  const { refreshTasks, openEditTask } = useTaskContext();

  const energyColors = {
    low: 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    high: 'bg-status-error/10 text-status-error border border-status-error/20',
  };

  const priorityColors = {
      low: 'text-emerald-400',
      medium: 'text-status-warning',
      high: 'text-status-error'
  };

  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : null;

  const getTypeIcon = () => {
      switch(type) {
          case 'email': return <Mail size={14} />;
          case 'reminder': return <Bell size={14} />;
          case 'calendar': return <Calendar size={14} />;
          default: return <AlignLeft size={14} />;
      }
  };

  const renderActionButtons = () => {
      if (type === 'email' && actionPayload?.recipient) {
          // Changed to specific Gmail Compose URL
          const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(actionPayload.recipient)}&su=${encodeURIComponent(title)}&body=${encodeURIComponent(description || '')}`;
          
          return (
              <a 
                  href={gmailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/10 text-t-primary text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors group/btn"
              >
                  <Mail size={14} className="group-hover/btn:text-neon transition-colors" />
                  Compose in Gmail
                  <ExternalLink size={12} className="opacity-50" />
              </a>
          );
      }

      if (type === 'calendar' && deadline) {
          // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
          // We need to ensure we are handling the timezone correctly - usually converting to UTC string and stripping non-digits works well for Z time
          const dateObj = new Date(deadline);
          const startStr = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
          const endStr = new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 1 hour default duration
          
          const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description || '')}&dates=${startStr}/${endStr}`;
          
          return (
              <a 
                  href={calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/10 text-t-primary text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors group/btn"
              >
                  <Calendar size={14} className="group-hover/btn:text-neon transition-colors" />
                  Add to Google Calendar
                  <ExternalLink size={12} className="opacity-50" />
              </a>
          );
      }

      return null;
  };

  return (
    <motion.div
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-surface p-5 rounded-2xl shadow-lg border border-white/5 mb-4 hover:border-neon/50 hover:shadow-[0_0_15px_rgba(124,124,255,0.1)] transition-all relative overflow-hidden group"
    >
        {/* Gravity Indicator - Visual Cue */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-1" 
            style={{ 
                backgroundColor: `rgba(124, 124, 255, ${Math.min(gravityScore / 20, 1)})`,
                boxShadow: `0 0 10px rgba(124, 124, 255, ${Math.min(gravityScore / 20, 0.5)})`
            }} 
        />

      <div className="flex justify-between items-start mb-3 pl-3">
        <div className="flex items-start gap-2">
            <span className={classNames("mt-1 p-1 rounded-md", 
                type === 'email' ? "text-sky-400 bg-sky-400/10" : 
                type === 'calendar' ? "text-purple-400 bg-purple-400/10" : 
                type === 'reminder' ? "text-amber-400 bg-amber-400/10" :
                "text-t-disabled"
            )}>
                {getTypeIcon()}
            </span>
            <h3 className="font-bold text-t-primary text-lg tracking-tight leading-tight">{title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span 
                data-tour="gravity-score"
                className="text-xs font-mono font-bold text-neon-glow bg-elevated border border-white/10 px-2 py-1 rounded"
            >
            {gravityScore.toFixed(1)} G
            </span>
        </div>
        
      </div>

      <div className="flex gap-2 mb-4 pl-3 flex-wrap">
        {priority && (
             <span className={classNames("text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold flex items-center gap-1.5 border", 
                priority === 'high' ? 'bg-status-error/10 text-status-error border-status-error/20' : 
                priority === 'medium' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                'bg-emerald-900/20 text-emerald-400 border-emerald-500/20'
             )}>
                <AlertCircle size={10} strokeWidth={3} /> {priority}
             </span>
        )}

        {formattedDeadline && (
            <span className="text-[10px] bg-elevated text-t-secondary px-2 py-0.5 rounded uppercase tracking-wider font-semibold flex items-center gap-1.5 border border-white/5">
                <Clock size={10} strokeWidth={3} /> {formattedDeadline}
            </span>
        )}
        {task.recurrence && task.recurrence.frequency && task.recurrence.frequency !== 'none' && (
            <span className="text-[10px] bg-neon/10 text-neon-cyan px-2 py-0.5 rounded uppercase tracking-wider font-semibold flex items-center gap-1.5 border border-neon-cyan/20">
                <RefreshCw size={10} strokeWidth={3} /> {task.recurrence.frequency}
            </span>
        )}
      </div>

      {/* Description Snippet */}
      {description && (
          <p className="text-sm text-t-secondary pl-3 mb-3 line-clamp-2">
              {description}
          </p>
      )}
      
      {/* Action Buttons */}
      <div className="pl-3 mb-3">
          {renderActionButtons()}
      </div>

      <div className="flex items-center justify-between pl-3 relative min-h-[24px] mt-auto">
          {/* Section Badge */}
          <div className="flex items-center">
            <span className="text-[10px] font-bold text-t-disabled uppercase tracking-widest flex items-center gap-1">
                <Folder size={10} /> {task.section || 'General'}
            </span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bottom-0 flex gap-2">
               <button 
                onClick={(e) => {
                    e.stopPropagation();
                    openEditTask(task);
                }}
                className="text-xs bg-status-warning/10 text-status-warning px-2 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-status-warning/20 transition-colors border border-status-warning/20"
              >
                  <Pencil size={12} />
              </button>
               <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm("Delete this action item?")) {
                        deleteTask(task._id).then(() => window.location.reload());
                    }
                }}
                className="text-xs bg-status-error/10 text-status-error px-2 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-status-error/20 transition-colors border border-status-error/20"
              >
                  <Trash2 size={12} />
              </button>
          </div>
      </div>

      {contextTags && contextTags.length > 0 && (
          <div className="flex gap-2 pl-3 mt-3 flex-wrap border-t border-white/5 pt-2">
              {contextTags.map(tag => (
                  <span key={tag} className="text-[10px] text-t-disabled hover:text-t-secondary transition-colors flex items-center gap-0.5">
                      # {tag}
                  </span>
              ))}
          </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
