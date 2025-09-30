'use client';

import { useState, useRef, useEffect } from 'react';

interface RowActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  rowData: any;
}

const RowActionsMenu = ({ isOpen, onClose, onViewDetails, rowData }: RowActionsMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewDetails = () => {
    onViewDetails();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 bg-white border border-[#e9e9e9] rounded shadow-lg z-20 min-w-[180px]"
    >
      <div className="py-1">
        <button
          onClick={handleViewDetails}
          className="w-full px-4 py-2 text-left text-[14px] text-[#2a2a2f] hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <ViewIcon />
          View customer details
        </button>

        <button
          onClick={() => {
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-[14px] text-[#2a2a2f] hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <EditIcon />
          Edit customer
        </button>

        <button
          onClick={() => {
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-[14px] text-[#f04646] hover:bg-red-50 transition-colors flex items-center gap-3"
        >
          <DeleteIcon />
          Delete customer
        </button>
      </div>
    </div>
  );
};

// Icon Components
const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3C4.5 3 1.73 5.61 1 8C1.73 10.39 4.5 13 8 13S14.27 10.39 15 8C14.27 5.61 11.5 3 8 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M7 3H3C2.44772 3 2 3.44772 2 4V13C2 13.5523 2.44772 14 3 14H12C12.5523 14 13 13.5523 13 13V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2L14 4L8 10H6V8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 1H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 4V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default RowActionsMenu;
