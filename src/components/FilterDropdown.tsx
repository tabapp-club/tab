'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BottomSheet } from './ui/BottomSheet';

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
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Only handle click outside for desktop dropdowns
      if (!isMobile) {
        // Check if click is outside both the dropdown and the button
        if (dropdownRef.current && !dropdownRef.current.contains(target) &&
            buttonRef.current && !buttonRef.current.contains(target)) {
          onToggle();
        }
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle, isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      // Use CSS media query for more reliable detection
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobileWidth = mediaQuery.matches;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Use multiple detection methods for better reliability
      const mobile = isMobileWidth || (isMobileUserAgent && isTouchDevice);
      setIsMobile(mobile);
      
      // Removed debug logging
    };
    
    // Set initial state
    checkMobile();
    
    // Listen to media query changes
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    mediaQuery.addEventListener('change', checkMobile);
    
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  useEffect(() => {
    const handleDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = (options.length * 40) + 60; // Approximate height per option + header

        // For mobile, use portal positioning
        if (isMobile) {
          setPortalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX,
            width: buttonRect.width
          });
        }

        // Check if there's enough space below
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('up');
          if (isMobile) {
            setPortalPosition({
              top: buttonRect.top + window.scrollY - dropdownHeight,
              left: buttonRect.left + window.scrollX,
              width: buttonRect.width
            });
          }
        } else {
          setDropdownPosition('down');
        }
      }
    };

    if (isOpen) {
      handleDropdownPosition();
    }
  }, [isOpen, options.length, isMobile]);

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
      const currentlySelected = options.filter(opt => opt.checked).map(opt => opt.id);

      if (currentlySelected.includes(optionId)) {
        // Remove if currently selected
        newSelectedIds = currentlySelected.filter(id => id !== optionId);
      } else {
        // Add if not currently selected
        newSelectedIds = [...currentlySelected, optionId];
      }
    }

    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`bg-white h-10 px-3 py-px border border-[#e9e9e9] rounded-md flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors filter-button relative w-28 sm:w-32 flex-shrink-0 ${
          selectedCount > 0
            ? 'border-[#9747FF] bg-[#9747FF]/5'
            : 'border-[#e9e9e9]'
        }`}
      >
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
            {title}
          </span>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#9747FF] rounded-full flex-shrink-0">
              {selectedCount}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
          <ChevronDownIcon />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {(() => {
            // Removed debug logging
            return null;
          })()}
          {(isMobile || window.innerWidth < 768 || window.matchMedia('(max-width: 767px)').matches) ? (
            <BottomSheet
              isOpen={isOpen}
              onClose={onToggle}
              title={`Filter by ${title}`}
            >
              <div className="py-2">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <input
                        type={singleSelect ? "radio" : "checkbox"}
                        name={singleSelect ? title : undefined}
                        checked={option.checked}
                        onChange={() => handleOptionChange(option.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                        singleSelect ? 'rounded-full' : 'rounded'
                      } ${
                        option.checked
                          ? 'bg-[#9747FF] border-[#9747FF] text-white'
                          : 'border-gray-300 text-transparent'
                      } transition-all duration-200`}>
                        {option.checked && (
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            {singleSelect ? (
                              <circle cx="8" cy="8" r="3" fill="currentColor"/>
                            ) : (
                              <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            )}
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-base text-gray-900 font-medium">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              
              {/* Apply/Reset buttons */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Reset all options
                      const checkedOptions = options.filter(option => option.checked);
                      if (checkedOptions.length > 0) {
                        onSelectionChange([]);
                      }
                    }}
                    className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={onToggle}
                    className="flex-1 py-2 px-4 bg-[#9747FF] text-white rounded font-medium hover:bg-[#9747FF] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </BottomSheet>
          ) : (
            <div
              ref={dropdownRef}
              className={`absolute ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border border-[#e9e9e9] rounded shadow-lg w-[180px] sm:min-w-[180px] max-h-[300px] overflow-y-auto`}
              style={{
                position: 'absolute',
                zIndex: 99999
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
                          ? 'text-[#9747FF]'
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
        </>
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
