'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  phoneNumber: string;
  isAuthenticated: boolean;
  accessToken: string;
  name: string;
  user_type?: string;
  business_id?: string;
  tokenExpiry?: number; // Timestamp when token expires
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
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

          // Check if token is expired
          if (userData.tokenExpiry && Date.now() > userData.tokenExpiry) {
            // Token expired, clear session
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            return;
          }

          // Check if we have an access token in localStorage that might not be in userData
          if (savedAccessToken && !userData.accessToken) {
            userData.accessToken = savedAccessToken;
            // Update localStorage with the complete user data
            localStorage.setItem('user', JSON.stringify(userData));
          }

          // If business_id is missing, try to fetch it
          if (userData.accessToken && !userData.business_id) {
            console.log('Business ID missing, fetching...');
            (async () => {
              try {
                const businessesResponse = await api.business.getBusinesses(userData.accessToken);
                if (businessesResponse.data && businessesResponse.data.length > 0) {
                  userData.business_id = businessesResponse.data[0]._id;
                  localStorage.setItem('user', JSON.stringify(userData));
                  setUser(userData);
                  console.log('Fetched and set businessId:', userData.business_id);
                }
              } catch (error) {
                console.warn('Failed to fetch business_id on load:', error);
              }
            })();
          }

          setUser(userData);
        } else if (savedAccessToken) {
          const fallbackUser: User = {
            phoneNumber: 'unknown',
            isAuthenticated: true,
            accessToken: savedAccessToken,
            name: 'User',
            tokenExpiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
          };
          setUser(fallbackUser);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        } else {
          // No saved user or access_token found
        }
      } catch (error) {
        // Error checking auth status
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // User state change effect (removed debug logging)

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await api.auth.sendOTP({ phone_number: phoneNumber, country_code: '+91' });
      return true;
    } catch (error) {
      throw error; // Re-throw to allow proper error handling in components
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await api.auth.verifyOTP({ phone_number: phoneNumber, otp });

      console.log('Verify OTP response:', response);

      // API returns: { message: string, data: { token: string } }
      const { message, data } = response;
      console.log('Message:', message, 'Data:', data);

      if (!message || !data || !data.token) {
        return { success: false, error: 'Invalid response from server' };
      }

      // Check if the message indicates success
      if (!message.toLowerCase().includes('successfully')) {
        return { success: false, error: 'OTP verification failed' };
      }

      const token = data.token;
      console.log('Token:', token);

      // Decode JWT to get user info
      const decoded = decodeJWT(token);
      const name = decoded?.name || 'User';

       // Try to get user_type from API first, fallback to JWT
       let userType = decoded?.user_type;
       try {
         console.log('Fetching user details from /user/me...');
         const userResponse = await api.auth.getUser(token);
         userType = userResponse.data.user_type;
         console.log('User type from API:', userType);
       } catch (userError) {
         console.warn('Failed to fetch user details from API, using JWT:', userError);
         console.log('User type from JWT:', userType);
       }

       // Fetch businesses to get business_id
       let businessId: string | undefined;
       try {
         console.log('Fetching businesses for business_id...');
         const businessesResponse = await api.business.getBusinesses(token);
         console.log('Businesses response:', businessesResponse);
         if (businessesResponse.data && businessesResponse.data.length > 0) {
           businessId = businessesResponse.data[0]._id;
           console.log('Set businessId:', businessId);
         } else {
           console.warn('No businesses found');
         }
       } catch (error) {
         console.warn('Failed to fetch businesses:', error);
       }

       const userData: User = {
         phoneNumber,
         isAuthenticated: true,
         accessToken: token,
         name,
         user_type: userType,
         business_id: businessId,
         tokenExpiry: decoded?.expiry_time ? decoded.expiry_time * 1000 : Date.now() + (24 * 60 * 60 * 1000), // Use token expiry or default 24 hours
       };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', token);
      return { success: true };
    } catch (error: any) {
      // Check if it's a 404 error (user not registered)
      if (error.status === 404) {
        return { success: false, error: 'User not registered' };
      }
      // For other errors, return generic failure
      return { success: false, error: error.message || 'Verification failed' };
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

  const login = async (phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    // Use verifyOTP for login logic
    return await verifyOTP(phoneNumber, otp);
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
    verifyOTP,
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
