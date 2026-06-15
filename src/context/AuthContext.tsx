'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================
// Authentication Types
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Auth Provider (Mocked for future Firebase/Supabase integration)
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check local storage for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('mock_auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with Firebase/Supabase Auth (e.g. signInWithEmailAndPassword)
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: AuthUser = {
        id: 'user_123',
        email,
        name: email.split('@')[0], // Generate simple name from email
      };
      
      setUser(mockUser);
      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // TODO: Replace with Firebase/Supabase Auth (e.g. createUserWithEmailAndPassword)
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: AuthUser = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      
      setUser(mockUser);
      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // TODO: Replace with Firebase/Supabase Auth (e.g. signOut)
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setUser(null);
      localStorage.removeItem('mock_auth_user');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
