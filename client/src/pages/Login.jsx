import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to login');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon/5 to-transparent opacity-50 pointer-events-none"></div>

            <div className="w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                     <h1 className="text-3xl font-bold text-t-primary mb-2 tracking-tight">Welcome Back</h1>
                     <p className="text-t-secondary text-sm">Enter your coordinates to resume focus.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-status-error/10 border border-status-error/20 text-status-error rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1.5 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-t-disabled" size={16} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-elevated border border-white/5 rounded-xl py-3 pl-10 pr-4 text-t-primary focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all outline-none placeholder-t-disabled"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                     <div>
                        <label className="text-[10px] font-bold text-t-disabled uppercase tracking-widest mb-1.5 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-t-disabled" size={16} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-elevated border border-white/5 rounded-xl py-3 pl-10 pr-4 text-t-primary focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all outline-none placeholder-t-disabled"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-neon text-white py-3 rounded-xl font-bold hover:bg-neon-glow transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Sign In'}
                        {!isSubmitting && <ArrowRight size={18} strokeWidth={3} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-t-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-neon font-semibold hover:underline">
                            Initialize Protocol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
