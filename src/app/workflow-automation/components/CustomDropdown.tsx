"use client";

import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = ""
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white h-8 px-3 py-px border border-[#e9e9e9] rounded flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors w-full text-left"
      >
        <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
          <ChevronDownIcon />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-[#e9e9e9] rounded z-50 w-full max-h-[200px] overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-[14px] text-[#2a2a2f] hover:bg-gray-50 transition-colors ${
                value === option.value ? 'bg-[#9747FF]/5 text-[#9747FF]' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ChevronDownIcon = () => (
  <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
