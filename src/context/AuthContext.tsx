import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { LoginDto, RegisterDto, User } from '../types';
import { showFeedback } from '../utils/feedback';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    handleUnauthorized: (message?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginDto) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const register = async (userData: RegisterDto) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const handleUnauthorized = async (message?: string) => {
        logout();
        if (message) {
            showFeedback('info', message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, handleUnauthorized }}>
            {children}
        </AuthContext.Provider>
    );
};