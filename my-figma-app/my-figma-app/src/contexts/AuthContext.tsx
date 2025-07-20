'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  phoneNumber: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

    const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate occasional network errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error');
      }

      // In a real app, you would make an API call here
      console.log('OTP sent to:', phoneNumber);

      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit OTP except '999999' (which we'll use for error state)
      if (otp.length === 6 && otp !== '999999') {
        const userData: User = {
          phoneNumber,
          isAuthenticated: true,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    sendOTP,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
