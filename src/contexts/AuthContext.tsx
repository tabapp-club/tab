'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  phoneNumber: string;
  isAuthenticated: boolean;
  accessToken: string;
  name: string;
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
        const savedAccessToken = localStorage.getItem('access_token');

        if (savedUser) {
          const userData = JSON.parse(savedUser);

          // Check if we have an access token in localStorage that might not be in userData
          if (savedAccessToken && !userData.accessToken) {
            userData.accessToken = savedAccessToken;
            // Update localStorage with the complete user data
            localStorage.setItem('user', JSON.stringify(userData));
          }

          setUser(userData);
        } else if (savedAccessToken) {
          const fallbackUser: User = {
            phoneNumber: 'unknown',
            isAuthenticated: true,
            accessToken: savedAccessToken,
            name: 'User'
          };
          setUser(fallbackUser);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        } else {
          console.log('AuthContext - checkAuthStatus - no saved user or access_token found');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Debug logging for user state changes
  useEffect(() => {
    console.log('AuthContext - user state changed:', user);
    console.log('AuthContext - isAuthenticated:', !!user?.isAuthenticated);
  }, [user]);

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.tabapp.club/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, country_code: '+91' })
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      const data = await response.json();
      // Optionally check data for success
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to decode JWT (for extracting user info if needed)
  function decodeJWT(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // Prompt for name if missing
  async function promptForNameAndCreateCustomer(token: string): Promise<string> {
    let name = '';

    while (!name) {
      name = window.prompt('Please enter your name to complete registration:') || '';
      name = name.trim();
    }
    const resp = await fetch('https://api.tabapp.club/v1/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    if (!resp.ok) throw new Error('Failed to save name');
    return name;
  }

  const login = async (phoneNumber: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.tabapp.club/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp, userType: 'business' })
      });
      if (!response.ok) return false;
      const data = await response.json();
      const { access_token, name } = data;
      let finalName = name;
      if (!access_token) return false;
      // If name is missing, prompt and call /v1/customers
      if (!finalName) {
        finalName = await promptForNameAndCreateCustomer(access_token);
      }
      // Optionally decode token for more info
      // const decoded = decodeJWT(access_token);
      const userData: User = {
        phoneNumber,
        isAuthenticated: true,
        accessToken: access_token,
        name: finalName,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', access_token);
      return true;
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
    localStorage.removeItem('access_token');
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
