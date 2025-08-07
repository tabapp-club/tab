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
  singleSelect?: boolean;
}

const FilterDropdown = ({
  title,
  options,
  onSelectionChange,
  isOpen,
  onToggle,
  selectedCount,
  singleSelect = false
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
    let newSelectedIds;
    if (singleSelect) {
      // For single select, toggle between selected and none
      const isCurrentlySelected = options.find(opt => opt.id === optionId)?.checked;
      newSelectedIds = isCurrentlySelected ? [] : [optionId];
    } else if (title === 'No of visits') {
      // Single select for visits - toggle between selected and none
      const isCurrentlySelected = options.find(opt => opt.id === optionId)?.checked;
      newSelectedIds = isCurrentlySelected ? [] : [optionId];
    } else {
      // For multi-select, toggle the specific option
      newSelectedIds = options
        .map(option =>
          option.id === optionId
            ? { ...option, checked: !option.checked }
            : option
        )
        .filter(option => option.checked)
        .map(option => option.id);
    }
    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className={`bg-white h-8 px-3 py-px border border-[#e9e9e9] rounded-md flex items-center justify-center overflow-clip hover:bg-gray-50 transition-colors filter-button ${
          selectedCount > 0
            ? 'border-[#7856ff] bg-[#7856ff]/5'
            : 'border-[#e9e9e9]'
        }`}
      >
        <div className="flex flex-row gap-1 h-[22px] items-center justify-end relative shrink-0">
          <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[13.453px] text-left text-nowrap">
            <p className="block leading-[19.6px] whitespace-pre">
              {selectedCount > 0
                ? options.find(opt => opt.checked)?.label || title
                : title
              }
            </p>
          </div>
          <div className="h-full relative shrink-0 w-[22px]">
            <div className="absolute h-[4.518px] left-[7px] top-[9px] w-[7.5px]">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
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
                  <div className={`w-[18px] h-[18px] flex items-center justify-center ${
                    option.checked
                      ? 'text-[#7856ff]'
                      : 'text-[#e9e9e9]'
                  }`}>
                    {option.checked && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default FilterDropdown;
