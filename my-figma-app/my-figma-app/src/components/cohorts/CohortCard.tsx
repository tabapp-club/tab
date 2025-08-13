"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CohortData } from "./CohortsList";

// Icons for the cohort card
const CohortIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M16.4062 4.76562H4.59375C4.50673 4.76562 4.42327 4.8002 4.36173 4.86173C4.3002 4.92327 4.26562 5.00673 4.26562 5.09375V16.9062C4.26562 16.9933 4.3002 17.0767 4.36173 17.1383C4.42327 17.1998 4.50673 17.2344 4.59375 17.2344H16.4062C16.4933 17.2344 16.5767 17.1998 16.6383 17.1383C16.6998 17.0767 16.7344 16.9933 16.7344 16.9062V5.09375C16.7344 5.00673 16.6998 4.92327 16.6383 4.86173C16.5767 4.8002 16.4933 4.76562 16.4062 4.76562ZM4.59375 3.78125C4.24565 3.78125 3.91181 3.91953 3.66567 4.16567C3.41953 4.41181 3.28125 4.74565 3.28125 5.09375V16.9062C3.28125 17.2543 3.41953 17.5882 3.66567 17.8343C3.91181 18.0805 4.24565 18.2188 4.59375 18.2188H16.4062C16.7543 18.2188 17.0882 18.0805 17.3343 17.8343C17.5805 17.5882 17.7188 17.2543 17.7188 16.9062V5.09375C17.7188 4.74565 17.5805 4.41181 17.3343 4.16567C17.0882 3.91953 16.7543 3.78125 16.4062 3.78125H4.59375ZM10.5 13.1328C10.6305 13.1328 10.7557 13.1847 10.848 13.277C10.9403 13.3693 10.9922 13.4945 10.9922 13.625V15.5938C10.9922 15.7243 10.9403 15.8495 10.848 15.9418C10.7557 16.0341 10.6305 16.0859 10.5 16.0859C10.3695 16.0859 10.2443 16.0341 10.152 15.9418C10.0597 15.8495 10.0078 15.7243 10.0078 15.5938V13.625C10.0078 13.4945 10.0597 13.3693 10.152 13.277C10.2443 13.1847 10.3695 13.1328 10.5 13.1328ZM7.71094 14.9375C7.71094 14.807 7.65908 14.6818 7.56678 14.5895C7.47448 14.4972 7.34929 14.4453 7.21875 14.4453C7.08821 14.4453 6.96302 14.4972 6.87072 14.5895C6.77842 14.6818 6.72656 14.807 6.72656 14.9375V15.5938C6.72656 15.7243 6.77842 15.8495 6.87072 15.9418C6.96302 16.0341 7.08821 16.0859 7.21875 16.0859C7.34929 16.0859 7.47448 16.0341 7.56678 15.9418C7.65908 15.8495 7.71094 15.7243 7.71094 15.5938V14.9375ZM13.7812 14.4453C13.9118 14.4453 14.037 14.4972 14.1293 14.5895C14.2216 14.6818 14.2734 14.807 14.2734 14.9375V15.5938C14.2734 15.7243 14.2216 15.8495 14.1293 15.9418C14.037 16.0341 13.9118 16.0859 13.7812 16.0859C13.6507 16.0859 13.5255 16.0341 13.4332 15.9418C13.3409 15.8495 13.2891 15.7243 13.2891 15.5938V14.9375C13.2891 14.807 13.3409 14.6818 13.4332 14.5895C13.5255 14.4972 13.6507 14.4453 13.7812 14.4453ZM5.88656 10.9803C5.83821 11.0254 5.79942 11.0797 5.77252 11.1401C5.74562 11.2005 5.73115 11.2656 5.72999 11.3317C5.72882 11.3978 5.74098 11.4634 5.76573 11.5247C5.79049 11.586 5.82733 11.6417 5.87407 11.6884C5.92081 11.7352 5.97648 11.772 6.03776 11.7968C6.09905 11.8215 6.16469 11.8337 6.23078 11.8325C6.29687 11.8313 6.36204 11.8169 6.42242 11.79C6.48279 11.7631 6.53713 11.7243 6.58219 11.6759L8.53125 9.72688L10.1522 11.3478C10.2445 11.44 10.3696 11.4918 10.5 11.4918C10.6304 11.4918 10.7555 11.44 10.8478 11.3478L15.1134 7.08219C15.1618 7.03713 15.2006 6.98279 15.2275 6.92242C15.2544 6.86204 15.2688 6.79687 15.27 6.73078C15.2712 6.66469 15.259 6.59905 15.2343 6.53776C15.2095 6.47648 15.1727 6.42081 15.1259 6.37407C15.0792 6.32733 15.0235 6.29049 14.9622 6.26573C14.9009 6.24098 14.8353 6.22882 14.7692 6.22999C14.7031 6.23115 14.638 6.24562 14.5776 6.27252C14.5172 6.29942 14.4629 6.33821 14.4178 6.38656L10.5 10.3044L8.87906 8.68344C8.78678 8.59127 8.66168 8.5395 8.53125 8.5395C8.40082 8.5395 8.27572 8.59127 8.18344 8.68344L5.88656 10.9803Z" fill="#7856FF"/>
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
      const menuWidth = 120; // Menu width
      const viewportWidth = window.innerWidth;
      
      // Calculate left position to keep menu within viewport
      let leftPosition = rect.right + window.scrollX - menuWidth;
      
      // If menu would go outside right edge, align it to the right of the button
      if (leftPosition + menuWidth > viewportWidth) {
        leftPosition = rect.left + window.scrollX - menuWidth;
      }
      
      // Ensure menu doesn't go outside left edge
      if (leftPosition < 0) {
        leftPosition = 0;
      }
      
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: leftPosition
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
        const menuWidth = 120; // Menu width
        const viewportWidth = window.innerWidth;
        
        // Calculate left position to keep menu within viewport
        let leftPosition = rect.right + window.scrollX - menuWidth;
        
        // If menu would go outside right edge, align it to the right of the button
        if (leftPosition + menuWidth > viewportWidth) {
          leftPosition = rect.left + window.scrollX - menuWidth;
        }
        
        // Ensure menu doesn't go outside left edge
        if (leftPosition < 0) {
          leftPosition = 0;
        }
        
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          left: leftPosition
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
            <h3 className="text-xl sm:text-[20px] font-bold text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
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
                Purchases
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
                Created
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-xs sm:text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] text-center">
              {cohort.createdBy}
            </div>
            <div className="text-xs sm:text-[13.5625px] font-bold text-[#626266] leading-[19.6px] tracking-[-0.1px] text-center">
              Date: {cohort.createdDate}
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
              Purchases
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
              Created
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start justify-center w-full">
          <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px] whitespace-nowrap">
            {cohort.createdBy}
          </div>
          <div className="text-[13.5625px] font-bold text-[#626266] leading-[19.6px] tracking-[-0.1px] whitespace-nowrap">
            Date: {cohort.createdDate}
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
