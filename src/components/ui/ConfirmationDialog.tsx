"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  position?: 'bottom-left' | 'center' | 'bottom-right';
  customPosition?: { top?: number; left?: number; bottom?: number; right?: number };
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  icon,
  position = "bottom-left",
  customPosition
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          container: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-700',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          cancelButton: 'border-red-300 text-red-700 hover:bg-red-50 font-normal'
        };
      case 'warning':
        return {
          container: 'border-[#6E4EFF]/20 bg-white',
          icon: 'text-[#6E4EFF] bg-[#6E4EFF]/10',
          title: 'text-[#2A2A2F]',
          message: 'text-[#626266]',
          confirmButton: 'bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] hover:from-[#5D3EE8] hover:to-[#7A59FF] text-white',
          cancelButton: 'border-[#6E4EFF]/30 text-[#6E4EFF] hover:bg-[#6E4EFF]/10 font-normal'
        };
      case 'info':
        return {
          container: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          message: 'text-blue-700',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          cancelButton: 'border-blue-300 text-blue-700 hover:bg-blue-50 font-normal'
        };
      default:
        return {
          container: 'border-gray-200 bg-gray-50',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-700',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white',
          cancelButton: 'border-gray-300 text-gray-700 hover:bg-gray-50 font-normal'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'; // Positioned at bottom left of viewport
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 left-4';
    }
  };

  const styles = getVariantStyles();
  const positionStyles = getPositionStyles();

  // Calculate custom position styles
  const customStyles = customPosition ? {
    top: customPosition.top ? `${customPosition.top}px` : 'auto',
    left: customPosition.left ? `${customPosition.left}px` : 'auto',
    bottom: customPosition.bottom ? `${customPosition.bottom}px` : 'auto',
    right: customPosition.right ? `${customPosition.right}px` : 'auto',
  } : {};

  // Use portal to render outside any parent containers
  const dialogContent = (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`fixed z-50 ${positionStyles}`} style={customStyles}>
        <div 
          className={`w-80 h-80 border rounded-lg shadow-xl ${styles.container} transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Top Icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${styles.icon} bg-opacity-10`}>
                {icon && (
                  <div className="w-8 h-8">
                    {icon}
                  </div>
                )}
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-4">
              <h3 className={`text-lg font-semibold ${styles.title}`}>
                {title}
              </h3>
            </div>

            {/* Message */}
            <div className="flex-1 flex items-center justify-center">
              <p className={`text-sm leading-relaxed text-center ${styles.message}`}>
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2 text-sm font-normal border rounded-md transition-colors whitespace-nowrap ${styles.cancelButton}`}
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${styles.confirmButton}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return typeof window !== 'undefined' 
    ? createPortal(dialogContent, document.body)
    : null;
}
