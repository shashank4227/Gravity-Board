import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, Calendar, MapPin, AlignLeft, RefreshCw, Folder } from 'lucide-react';
import { createTask } from '../utils/api';
import classNames from 'classnames';

const CreateTaskForm = ({ onTaskCreated }) => {
    const { isCreateTaskOpen, closeCreateTask, createTaskSection, onTaskCreated: onGlobalTaskCreated } = useTaskContext();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [energyLevel, setEnergyLevel] = useState('medium');
    const [deadline, setDeadline] = useState('');
    const [contextTags, setContextTags] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const [section, setSection] = useState('');

    useEffect(() => {
        if (isCreateTaskOpen) {
            setSection(createTaskSection || '');
        }
    }, [isCreateTaskOpen, createTaskSection]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            // Process tags
            const tags = contextTags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            await createTask({
                title,
                description,
                energyLevel,
                deadline,
                contextTags: tags,
                recurrence: { frequency: recurrence },
                section: section || 'General'
            });

            // Reset and close
            setTitle('');
            setDescription('');
            setEnergyLevel('medium');
            setDeadline('');
            setContextTags('');
            setRecurrence('none');
            setSection('');
            closeCreateTask();
            
            if (onTaskCreated) onTaskCreated();
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Failed to create task. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    const energyOptions = [
        { value: 'low', label: 'Low', color: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' },
        { value: 'medium', label: 'Medium', color: 'bg-status-warning/10 text-status-warning border-status-warning/20' },
        { value: 'high', label: 'High', color: 'bg-status-error/10 text-status-error border-status-error/20' }
    ];

    if (!isCreateTaskOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-t-primary tracking-tight">New Protocol</h2>
                    <button 
                        onClick={closeCreateTask}
                        className="p-2 hover:bg-elevated rounded-full text-t-disabled hover:text-t-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="What is the objective?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-xl font-medium placeholder-t-disabled bg-transparent border-none focus:ring-0 p-0 m-0 text-t-primary"
                                autoFocus
                            />
                        </div>

                        {/* Energy Level Selection */}
                        <div>
                            <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-3 block flex items-center gap-1.5">
                                <Zap size={10} /> Energy Required
                            </label>
                            <div className="flex gap-3">
                                {energyOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setEnergyLevel(opt.value)}
                                        className={classNames(
                                            "px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex-1",
                                            energyLevel === opt.value 
                                                ? opt.color 
                                                : "bg-elevated text-t-disabled border-transparent hover:bg-white/10 hover:text-t-secondary"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Deadline */}
                            <div className="bg-elevated p-3 rounded-xl border border-white/5">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <Calendar size={10} /> Deadline
                                </label>
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>

                            {/* Recurrence */}
                            <div className="bg-elevated p-3 rounded-xl border border-white/5">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <RefreshCw size={10} /> Cycles
                                </label>
                                <select
                                    value={recurrence}
                                    onChange={(e) => setRecurrence(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary"
                                >
                                    <option value="none" className="bg-surface">Single Instance</option>
                                    <option value="daily" className="bg-surface">Daily Cycle</option>
                                    <option value="weekly" className="bg-surface">Weekly Cycle</option>
                                    <option value="monthly" className="bg-surface">Monthly Cycle</option>
                                </select>
                            </div>

                            {/* Section */}
                            <div className="bg-elevated p-3 rounded-xl border border-white/5">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <Folder size={10} /> Vector / Section
                                </label>
                                <input
                                    type="text"
                                    placeholder="General"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary placeholder-t-disabled"
                                />
                            </div>

                             {/* Context Tags */}
                             <div className="bg-elevated p-3 rounded-xl border border-white/5">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <MapPin size={10} /> Context
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. @home, #deepwork"
                                    value={contextTags}
                                    onChange={(e) => setContextTags(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary placeholder-t-disabled"
                                />
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div className="bg-elevated p-3 rounded-xl border border-white/5">
                             <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                <AlignLeft size={10} /> Notes
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary placeholder-t-disabled resize-none"
                                placeholder="..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-2">
                             <button
                                type="submit"
                                disabled={isLoading || !title}
                                className="bg-neon text-white px-8 py-3 rounded-xl font-bold tracking-wide hover:bg-neon-glow transition-all shadow-lg shadow-neon/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
                            >
                                {isLoading ? 'Aligning...' : 'Initiate'}
                                {!isLoading && <Plus size={18} strokeWidth={3} />}
                            </button>
                        </div>
                    </form>
            </motion.div>
        </div>
    );
};

export default CreateTaskForm;
