"use client";

import React, { useEffect } from 'react';

export type PopupType = 'success' | 'error' | 'warning' | 'info';

interface PopupProps {
  type: PopupType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Auto-close duration in milliseconds
  showCloseButton?: boolean;
}

const PopupIcon = ({ type }: { type: PopupType }) => {
  const iconClasses = "w-6 h-6";

  switch (type) {
    case 'success':
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76488 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'error':
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'warning':
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'info':
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

const getPopupStyles = (type: PopupType) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-600',
        closeButton: 'text-green-600 hover:bg-green-100'
      };
    case 'error':
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-600',
        closeButton: 'text-red-600 hover:bg-red-100'
      };
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: 'text-yellow-600',
        closeButton: 'text-yellow-600 hover:bg-yellow-100'
      };
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-600',
        closeButton: 'text-blue-600 hover:bg-blue-100'
      };
    default:
      return {
        container: 'bg-gray-50 border-gray-200 text-gray-800',
        icon: 'text-gray-600',
        closeButton: 'text-gray-600 hover:bg-gray-100'
      };
  }
};

export function Popup({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
  showCloseButton = true
}: PopupProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = getPopupStyles(type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Popup */}
      <div className={`relative max-w-md w-full bg-white rounded-xl border shadow-xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className={`p-6 rounded-xl border-l-4 ${styles.container}`}>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 ${styles.icon}`}>
              <PopupIcon type={type} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed">{message}</p>
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`flex-shrink-0 p-1 rounded-full transition-colors ${styles.closeButton}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Convenience components for specific popup types
export function SuccessPopup({
  title,
  message,
  isVisible,
  onClose,
  duration = 5000
}: Omit<PopupProps, 'type'>) {
  return (
    <Popup
      type="success"
      title={title}
      message={message}
      isVisible={isVisible}
      onClose={onClose}
      duration={duration}
    />
  );
}

export function ErrorPopup({
  title,
  message,
  isVisible,
  onClose,
  duration = 7000
}: Omit<PopupProps, 'type'>) {
  return (
    <Popup
      type="error"
      title={title}
      message={message}
      isVisible={isVisible}
      onClose={onClose}
      duration={duration}
    />
  );
}

export function WarningPopup({
  title,
  message,
  isVisible,
  onClose,
  duration = 6000
}: Omit<PopupProps, 'type'>) {
  return (
    <Popup
      type="warning"
      title={title}
      message={message}
      isVisible={isVisible}
      onClose={onClose}
      duration={duration}
    />
  );
}

export function InfoPopup({
  title,
  message,
  isVisible,
  onClose,
  duration = 5000
}: Omit<PopupProps, 'type'>) {
  return (
    <Popup
      type="info"
      title={title}
      message={message}
      isVisible={isVisible}
      onClose={onClose}
      duration={duration}
    />
  );
}
