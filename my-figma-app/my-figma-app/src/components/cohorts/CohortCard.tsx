"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CohortData } from "./CohortsList";

// Icons for the cohort card
const CohortIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="9.5" fill="currentColor" stroke="none"/>
    <path d="M6 14.5L10.5 10L15 14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5V5.00833M9 9V9.00833M9 13V13.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CohortCardProps {
  cohort: CohortData;
}

export function CohortCard({ cohort }: CohortCardProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMoreClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 120 // Adjust for menu width
      });
    }
    setShowMoreMenu(!showMoreMenu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  // Handle scroll to update menu position
  useEffect(() => {
    const handleScroll = () => {
      if (showMoreMenu && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 120
        });
      }
    };

    if (showMoreMenu) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showMoreMenu]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

    return (
    <div className="cohort-card bg-white border border-[#e9e9e9] rounded-lg min-h-[117px] flex flex-col lg:flex-row overflow-hidden relative">
      {/* Name Section */}
      <div className="flex flex-col items-start justify-center min-h-12 sm:min-h-16 p-3 sm:p-4 lg:w-[360px] lg:border-r border-[#e9e9e9] order-1">
        <div className="flex items-start gap-2 w-full">
          <div className="w-4 h-4 sm:w-[21px] sm:h-[21px] flex-shrink-0 text-[#7856ff] mt-0.5">
            <CohortIcon />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 items-start justify-center overflow-hidden">
            <h3 className="text-sm sm:text-[16px] font-bold text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
              {cohort.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: Combined Count and Created By */}
      <div className="flex flex-col xs:flex-row lg:hidden border-b lg:border-b-0 border-[#e9e9e9] order-2">
        {/* Count Section Mobile */}
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-3 sm:py-4 flex-1 border-b xs:border-b-0 xs:border-r border-[#e9e9e9]">
          <div className="flex items-center justify-center h-5 sm:h-6 rounded-[3px] w-full mb-2">
            <div className="flex items-center justify-start gap-1 sm:gap-[5px] overflow-hidden">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#7856ff] rounded-sm flex-shrink-0" />
              <span className="text-xs sm:text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
                {cohort.category}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <span className="text-xl sm:text-[28px] md:text-[32px] font-bold text-[#2a2a2f] text-center tracking-[-2.88px] leading-[1.4]">
              {formatNumber(cohort.count)}
            </span>
          </div>
        </div>

        {/* Created By Section Mobile */}
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-3 sm:py-4 flex-1">
          <div className="flex items-center justify-center h-5 sm:h-6 rounded-[3px] w-full mb-2">
            <div className="flex items-center justify-start gap-1 sm:gap-[5px] overflow-hidden">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#7856ff] rounded-sm flex-shrink-0" />
              <span className="text-xs sm:text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
                Created by
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-xs sm:text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] text-center">
              {cohort.createdBy}
            </div>
            <div className="text-xs sm:text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] text-center">
              date: {cohort.createdDate}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Count Section */}
      <div className="hidden lg:flex flex-col items-center justify-center px-6 py-4 w-[181px] border-r border-[#e9e9e9] order-3">
        <div className="flex items-center justify-center h-6 rounded-[3px] w-full mb-auto">
          <div className="flex items-center justify-start gap-[5px] overflow-hidden">
            <div className="w-2.5 h-2.5 bg-[#7856ff] rounded-sm flex-shrink-0" />
            <span className="text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
              {cohort.category}
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <span className="text-[32px] font-bold text-[#2a2a2f] text-center tracking-[-2.88px] leading-[1.4]">
            {formatNumber(cohort.count)}
          </span>
        </div>
      </div>

      {/* Desktop: Created By Section */}
      <div className="hidden lg:flex flex-col items-center justify-center px-6 py-4 w-[166px] border-r border-[#e9e9e9] order-4">
        <div className="flex items-center justify-start h-6 rounded-[3px] w-full mb-auto">
          <div className="flex items-center justify-start gap-[5px] overflow-hidden">
            <div className="w-2.5 h-2.5 bg-[#7856ff] rounded-sm flex-shrink-0" />
            <span className="text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
              Created by
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start justify-center w-full">
          <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] whitespace-nowrap">
            {cohort.createdBy}
          </div>
          <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] whitespace-nowrap">
            date: {cohort.createdDate}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex-1 lg:border-r border-[#e9e9e9] relative order-5">
        <div className="flex flex-col justify-center h-full">
          <div className="flex flex-col items-start justify-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col items-start justify-center w-full">
              <div className="flex items-center justify-start h-5 sm:h-6 rounded-[3px] w-full mb-2">
                <div className="flex items-center justify-start gap-1 sm:gap-2 overflow-hidden">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#7856ff] rounded-sm flex-shrink-0" />
                  <span className="text-xs sm:text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
                    Description
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] w-full max-w-[305px]">
                {cohort.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Actions Section */}
      <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 relative order-6 border-t lg:border-t-0 border-[#e9e9e9] z-10">
        <div className="flex items-center justify-start h-5 sm:h-6 rounded-[3px] lg:w-full lg:mb-auto">
          <div className="flex items-center justify-start gap-1 sm:gap-[5px] overflow-hidden">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#767676] rounded-sm flex-shrink-0" />
            <span className="text-xs sm:text-[11.0625px] font-medium text-[#626266] leading-[12px] whitespace-nowrap">
              more
            </span>
          </div>
        </div>
        <div className="flex lg:flex-1 items-center justify-end lg:justify-start">
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={handleMoreClick}
              className="flex items-start justify-start p-[6px] sm:p-[7px] rounded-md hover:bg-gray-100 transition-colors"
              aria-label="More actions"
            >
              <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] overflow-hidden text-[#8f8f91]">
                <MoreIcon />
              </div>
            </button>
          </div>
        </div>

        {/* Dropdown menu rendered in portal */}
        {showMoreMenu && typeof document !== 'undefined' && createPortal(
          <div
            ref={menuRef}
            className="dropdown-menu fixed bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
                <div className="py-1">
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                    Edit
                  </button>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                    Duplicate
                  </button>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                    Delete
                  </button>
                </div>
          </div>,
          document.body
            )}
      </div>
    </div>
  );
}
