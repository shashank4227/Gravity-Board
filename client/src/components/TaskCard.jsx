import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, MapPin, RefreshCw, Folder } from 'lucide-react';
import classNames from 'classnames';

const TaskCard = ({ task, innerRef, provided, style }) => {
  const { title, gravityScore, energyLevel, deadline, contextTags } = task;

  const energyColors = {
    low: 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    high: 'bg-status-error/10 text-status-error border border-status-error/20',
  };

  const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString() : null;

  return (
    <motion.div
      ref={innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
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
        <h3 className="font-bold text-t-primary text-lg tracking-tight">{title}</h3>
        <span className="text-xs font-mono font-bold text-neon-glow bg-elevated border border-white/10 px-2 py-1 rounded">
          {gravityScore.toFixed(1)} G
        </span>
      </div>

      <div className="flex gap-2 mb-4 pl-3">
        <span className={classNames("text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold flex items-center gap-1.5", energyColors[energyLevel])}>
          <Zap size={10} strokeWidth={3} /> {energyLevel}
        </span>
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
      
      <div className="flex items-center justify-between pl-3 relative">
          {/* Section Badge */}
          <div className="flex items-center">
            <span className="text-[10px] font-bold text-t-disabled uppercase tracking-widest flex items-center gap-1">
                <Folder size={10} /> {task.section || 'General'}
            </span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bottom-0">
              <button 
                onClick={(e) => { e.stopPropagation(); task.onFocus(task); }} 
                className="text-xs bg-neon text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-neon-glow transition-colors shadow-lg shadow-neon/30 font-medium"
              >
                  <Zap size={12} fill="currentColor" /> Focus
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
