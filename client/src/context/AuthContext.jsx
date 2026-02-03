import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios default header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            // If user is already loaded (e.g. from optimized login), don't re-fetch
            if (user) {
                setLoading(false);
                return;
            }

            // Ensure we are in loading state while fetching
            setLoading(true);

            try {
                // We need to use full URL here because api.js handles the base URL logic 
                // but we are using raw axios here for auth context to avoid circular deps if we imported from api.js
                // However, cleaner approach: stick to api.js or duplicate URL logic. 
                // Let's use the env variable logic directly here for safety.
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${API_URL}/auth/me`);
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load user", err);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token, user]);

    const login = async (email, password) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            setUser(res.data.user); // Optimistic update
            setToken(res.data.token);
            return true;
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    const register = async (username, email, password) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
            setUser(res.data.user); // Optimistic update
            setToken(res.data.token);
            return true;
        } catch (err) {
            console.error("Registration failed", err);
            throw err;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
