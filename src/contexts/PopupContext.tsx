"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PopupType } from '@/components/ui/Popup';

interface PopupState {
  isVisible: boolean;
  type: PopupType;
  title: string;
  message: string;
}

interface PopupContextType {
  popup: PopupState;
  showPopup: (type: PopupType, title: string, message: string) => void;
  hidePopup: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const initialPopupState: PopupState = {
  isVisible: false,
  type: 'info',
  title: '',
  message: ''
};

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popup, setPopup] = useState<PopupState>(initialPopupState);

  const showPopup = useCallback((type: PopupType, title: string, message: string) => {
    setPopup({
      isVisible: true,
      type,
      title,
      message
    });
  }, []);

  const hidePopup = useCallback(() => {
    setPopup(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showPopup('success', title, message);
  }, [showPopup]);

  const showError = useCallback((title: string, message: string) => {
    showPopup('error', title, message);
  }, [showPopup]);

  const showWarning = useCallback((title: string, message: string) => {
    showPopup('warning', title, message);
  }, [showPopup]);

  const showInfo = useCallback((title: string, message: string) => {
    showPopup('info', title, message);
  }, [showPopup]);

  const value: PopupContextType = {
    popup,
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}
