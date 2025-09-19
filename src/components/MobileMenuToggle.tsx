"use client";

import { useState, useEffect } from "react";

const MenuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.33301 12H26.6663M5.33301 20H18.6663" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        // Store current scroll position
        const scrollY = window.scrollY;
        body.style.top = `-${scrollY}px`;
        
        sidebar.classList.add('open');
        overlay.classList.add('open');
        body.classList.add('sidebar-open');
      } else {
        // Restore scroll position
        const scrollY = body.style.top;
        body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        body.classList.remove('sidebar-open');
      }
    }

    // Cleanup on unmount
    return () => {
      if (body) {
        body.style.top = '';
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

  // Listen for sidebar closed event from within the sidebar
  useEffect(() => {
    const handleSidebarClosed = () => {
      setIsOpen(false);
    };

    window.addEventListener('sidebar-closed', handleSidebarClosed);
    return () => window.removeEventListener('sidebar-closed', handleSidebarClosed);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
                    className="mobile-menu-toggle w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <MenuIcon />
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
