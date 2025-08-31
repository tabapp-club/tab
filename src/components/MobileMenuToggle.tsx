"use client";

import { useState, useEffect } from "react";

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar-mobile');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;

    if (sidebar && overlay && body) {
      if (isOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        body.classList.add('sidebar-open');
      } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        body.classList.remove('sidebar-open');
      }
    }

    // Cleanup on unmount
    return () => {
      if (body) {
        body.classList.remove('sidebar-open');
      }
    };
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar-mobile');
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      const overlay = document.querySelector('.sidebar-overlay');

      if (isOpen && sidebar && toggleButton) {
        // If clicking on overlay OR outside sidebar (but not on toggle button)
        if ((overlay && event.target === overlay) ||
            (!sidebar.contains(event.target as Node) && !toggleButton.contains(event.target as Node))) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
                    className="mobile-menu-toggle w-10 h-10 bg-white border border-[#e9e9e9] rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Overlay */}
      <div
        className="sidebar-overlay"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        aria-hidden="true"
      />
    </>
  );
}
