import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, Calendar, MapPin, AlignLeft, RefreshCw, Folder, Mail, Bell, AlertCircle } from 'lucide-react';
import { createTask, updateTask } from '../utils/api';
import classNames from 'classnames';

const CreateTaskForm = ({ onTaskCreated }) => {
    const { isCreateTaskOpen, closeCreateTask, createTaskSection, onTaskCreated: onGlobalTaskCreated, refreshTasks, editingTask } = useTaskContext();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [energyLevel, setEnergyLevel] = useState('medium');
    const [deadline, setDeadline] = useState('');
    const [contextTags, setContextTags] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const [section, setSection] = useState('');
    
    // New Fields
    const [type, setType] = useState('general');
    const [priority, setPriority] = useState('medium');
    const [emailRecipient, setEmailRecipient] = useState(''); // Specific action payload state

    useEffect(() => {
        if (isCreateTaskOpen) {
            if (editingTask) {
                // Populate form with existing task data
                setTitle(editingTask.title || '');
                setDescription(editingTask.description || '');
                setEnergyLevel(editingTask.energyLevel || 'medium');
                setDeadline(editingTask.deadline ? editingTask.deadline.substring(0, 16) : ''); // Format for datetime-local
                setContextTags(editingTask.contextTags ? editingTask.contextTags.join(', ') : '');
                setRecurrence(editingTask.recurrence?.frequency || 'none');
                setSection(editingTask.section || '');
                setType(editingTask.type || 'general');
                setPriority(editingTask.priority || 'medium');
                setEmailRecipient(editingTask.actionPayload?.recipient || '');
            } else {
                // Reset/Default for new task
                setTitle('');
                setDescription('');
                setEnergyLevel('medium');
                setDeadline('');
                setContextTags('');
                setRecurrence('none');
                setSection(createTaskSection || '');
                setType('general');
                setPriority('medium');
                setEmailRecipient('');
            }
        }
    }, [isCreateTaskOpen, createTaskSection, editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            // Process tags
            const tags = contextTags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            const payload = {};
            if (type === 'email') {
                payload.recipient = emailRecipient;
            }

            const taskData = {
                title,
                description,
                energyLevel,
                deadline,
                contextTags: tags,
                recurrence: { frequency: recurrence },
                section: section || 'General',
                type,
                priority,
                actionPayload: payload
            };

            if (editingTask) {
                await updateTask(editingTask._id, taskData);
            } else {
                await createTask(taskData);
            }

            // Reset and close
            setTitle('');
            setDescription('');
            setEnergyLevel('medium');
            setDeadline('');
            setContextTags('');
            setRecurrence('none');
            setSection('');
            setType('general');
            setPriority('medium');
            setEmailRecipient('');
            
            closeCreateTask();
            refreshTasks();
            
            if (onTaskCreated) onTaskCreated();
        } catch (error) {
            console.error("Failed to save task", error);
            alert("Failed to save task. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    const energyOptions = [
        { value: 'low', label: 'Low', color: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' },
        { value: 'medium', label: 'Medium', color: 'bg-status-warning/10 text-status-warning border-status-warning/20' },
        { value: 'high', label: 'High', color: 'bg-status-error/10 text-status-error border-status-error/20' }
    ];

    const typeOptions = [
        { value: 'general', label: 'General', icon: <AlignLeft size={16} /> },
        { value: 'email', label: 'Email', icon: <Mail size={16} /> },
        { value: 'reminder', label: 'Reminder', icon: <Bell size={16} /> },
        { value: 'calendar', label: 'Calendar', icon: <Calendar size={16} /> } // Reusing Calendar icon
    ];

    if (!isCreateTaskOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-t-primary tracking-tight">{editingTask ? 'Edit Action Item' : 'New Action Item'}</h2>
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
                                placeholder="What needs to be accomplished?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-xl font-medium placeholder-t-disabled bg-transparent border-none focus:ring-0 p-0 m-0 text-t-primary"
                                autoFocus
                            />
                        </div>

                        {/* Type & Priority Row */}
                        <div className="flex gap-4">
                            {/* Type Selection */}
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-3 block flex items-center gap-1.5">
                                    <Zap size={10} /> Type
                                </label>
                                <div className="flex bg-elevated rounded-xl p-1 gap-1">
                                    {typeOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setType(opt.value)}
                                            className={classNames(
                                                "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                                                type === opt.value
                                                    ? "bg-neon/20 text-neon-cyan shadow-sm"
                                                    : "text-t-disabled hover:text-t-primary"
                                            )}
                                            title={opt.label}
                                        >
                                            {opt.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Priority Selection */}
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-3 block flex items-center gap-1.5">
                                    <AlertCircle size={10} /> Priority
                                </label>
                                <div className="flex bg-elevated rounded-xl p-1 gap-1">
                                    {['low', 'medium', 'high'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={classNames(
                                                "flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all",
                                                priority === p
                                                    ? p === 'high' ? 'bg-status-error/20 text-status-error' : p === 'medium' ? 'bg-status-warning/20 text-status-warning' : 'bg-emerald-500/20 text-emerald-400'
                                                    : "text-t-disabled hover:text-t-primary"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Conditional Email Fields */}
                        <AnimatePresence>
                            {type === 'email' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-elevated p-3 rounded-xl border border-white/5 mb-4">
                                        <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                            <Mail size={10} /> Recipient
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="recipient@example.com"
                                            value={emailRecipient}
                                            onChange={(e) => setEmailRecipient(e.target.value)}
                                            className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary placeholder-t-disabled"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Existing Details Grid (Deadline, Recurrence, Section, Context) */}
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
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 text-t-primary bg-elevated"
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
                                {isLoading ? (editingTask ? 'Updating...' : 'Aligning...') : (editingTask ? 'Update Action' : 'Initiate Action')}
                                {!isLoading && <Plus size={18} strokeWidth={3} />}
                            </button>
                        </div>
                    </form>
            </motion.div>
        </div>
    );
};

export default CreateTaskForm;
