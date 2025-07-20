'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  onSelectionChange: (selectedIds: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount: number;
}

const FilterDropdown = ({
  title,
  options,
  onSelectionChange,
  isOpen,
  onToggle,
  selectedCount
}: FilterDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  useEffect(() => {
    const handleDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = (options.length * 40) + 60; // Approximate height per option + header

        // Check if there's enough space below
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('up');
        } else {
          setDropdownPosition('down');
        }
      }
    };

    if (isOpen) {
      handleDropdownPosition();
    }
  }, [isOpen, options.length]);

  const handleOptionChange = (optionId: string) => {
    const newSelectedIds = options
      .map(option =>
        option.id === optionId
          ? { ...option, checked: !option.checked }
          : option
      )
      .filter(option => option.checked)
      .map(option => option.id);

    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="bg-white h-8 px-3 py-0.5 border border-[#e9e9e9] rounded flex items-center gap-1 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[14px] font-medium text-[#2a2a2f]">{title}</span>
        {selectedCount > 0 && (
          <span className="bg-[#0f60ff] text-white text-[10px] font-normal px-2 py-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
            {selectedCount}
          </span>
        )}
        <ChevronDownIcon />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border border-[#e9e9e9] rounded shadow-lg z-50 min-w-[180px] max-h-[300px] overflow-y-auto`}
          style={{
            position: 'absolute',
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div className="px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-[#626266]">Filter by {title}</span>
              <button className="text-[12px] text-[#626266] opacity-0 hover:opacity-100">
                Reset
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="py-2">
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleOptionChange(option.id)}
                    className="sr-only"
                  />
                  <div className={`w-[18px] h-[18px] border rounded flex items-center justify-center ${
                    option.checked
                      ? 'bg-[#0f60ff] border-[#0f60ff]'
                      : 'border-[#e9e9e9] bg-white'
                  }`}>
                    {option.checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[14px] text-[#2a2a2f] tracking-[0.15px]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronDownIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M7 9L11 13L15 9" stroke="#2A2A2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default FilterDropdown;
