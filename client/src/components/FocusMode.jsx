import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { completeFocusSession } from '../utils/api';

const FocusMode = ({ session, onExit }) => {
    const [timeLeft, setTimeLeft] = useState(session.durationMinutes * 60);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            handleComplete(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleComplete = async (success) => {
        setIsActive(false);
        try {
            await completeFocusSession({
                sessionId: session.sessionId,
                success,
                distractions: 0 // TODO: Add tracker
            });
            // Show success animation or summary before exiting?
            if (success) {
                alert("Focus Session Complete! Task Gravity Updated.");
            }
            onExit();
        } catch (err) {
            console.error("Error logging session", err);
            onExit();
        }
    };

    const progress = (timeLeft / (session.durationMinutes * 60)) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 text-white flex flex-col items-center justify-center backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="max-w-md w-full text-center p-8"
                >
                    <div className="mb-8">
                        <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Focusing On</span>
                        <h2 className="text-3xl font-bold mt-2">{session.taskTitle}</h2>
                        <p className="text-gray-400 mt-2 italic">"{session.intention}"</p>
                    </div>

                    {/* Timer Visual */}
                    <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-gray-800"
                            />
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={((100 - progress) / 100) * (2 * Math.PI * 120)}
                                className="text-indigo-500 transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <div className="absolute text-5xl font-mono font-bold tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => handleComplete(false)}
                            className="bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors border border-gray-700"
                        >
                            <XCircle size={20} /> Give Up
                        </button>
                        
                        <button
                            onClick={() => handleComplete(true)} // Normally hidden until done, but useful for testing
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                        >
                            <CheckCircle size={20} /> Complete Early
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FocusMode;
