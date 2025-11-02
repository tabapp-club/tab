'use client';

import { useState, useRef, useEffect } from 'react';

interface PaginationProps {
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

const Pagination = ({
  currentPage: externalCurrentPage = 1,
  itemsPerPage: externalItemsPerPage = 10,
  totalItems = 52,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(externalCurrentPage);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentPage = onPageChange ? externalCurrentPage : internalCurrentPage;
  const itemsPerPage = onItemsPerPageChange ? externalItemsPerPage : internalItemsPerPage;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const perPageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    const handleDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = perPageOptions.length * 40; // Approximate height per option

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

    if (showPerPageDropdown) {
      handleDropdownPosition();
    }
  }, [showPerPageDropdown, perPageOptions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPerPageDropdown(false);
      }
    };

    if (showPerPageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPerPageDropdown]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      if (onPageChange) {
        onPageChange(newPage);
      } else {
        setInternalCurrentPage(newPage);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      if (onPageChange) {
        onPageChange(newPage);
      } else {
        setInternalCurrentPage(newPage);
      }
    }
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const handlePerPageChange = (newItemsPerPage: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    } else {
      setInternalItemsPerPage(newItemsPerPage);
      // Reset to first page when changing items per page
      if (onPageChange) {
        onPageChange(1);
      } else {
        setInternalCurrentPage(1);
      }
    }
    setShowPerPageDropdown(false);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`h-7 w-7 sm:h-8 sm:w-8 lg:h-[30px] lg:w-[30px] rounded-md px-1 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center touch-manipulation flex-shrink-0 ${
            i === currentPage
              ? 'bg-[#9747FF] text-white'
              : 'text-[#9747FF] hover:bg-[#9747FF] hover:bg-opacity-10 hover:text-[#9747FF]'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center lg:justify-center px-2 sm:px-3 lg:px-4 py-2 sm:py-3 gap-4 sm:gap-3 lg:gap-4 min-w-0 items-center sm:items-center">
      {/* Mobile: Centered Show per page and page info */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 justify-center sm:justify-start">
        {/* Show per page */}
        <div className="flex items-center gap-1 sm:gap-2 relative min-w-0" ref={dropdownRef}>
          <span className="text-xs sm:text-[13px] font-medium text-[#9747FF] leading-[14px] tracking-[-0.13px] flex-shrink-0">
            Show
          </span>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
              className="bg-[#fcfcfc] border border-[#dbdfe9] rounded-md px-1.5 sm:px-2 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs sm:text-[11px] font-normal text-[#2a2a2f] leading-[12px]">
                {itemsPerPage}
              </span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown */}
            {showPerPageDropdown && (
              <div
                className={`absolute ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border border-[#dbdfe9] rounded-md z-50 min-w-full max-h-[200px] overflow-y-auto`}
                style={{
                  position: 'absolute',
                  zIndex: 9999
                }}
              >
                {perPageOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePerPageChange(option)}
                    className={`w-full px-1.5 sm:px-2 py-1 sm:py-1.5 text-left text-xs sm:text-[11px] hover:bg-gray-50 transition-colors whitespace-nowrap ${
                      option === itemsPerPage ? 'bg-gray-100 text-[#2a2a2f]' : 'text-[#2a2a2f]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs sm:text-[13px] font-medium text-[#9747FF] leading-[14px] tracking-[-0.13px] flex-shrink-0">
            per page
          </span>
        </div>

        {/* Page info */}
        <span className="text-xs sm:text-[13px] font-medium text-[#9747FF] leading-[14px] tracking-[-0.13px] flex-shrink-0">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Navigation - separate on mobile, inline on larger screens */}
      <div className="flex items-center gap-0.5 sm:gap-0.5 min-w-0">
        {/* Previous button */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`h-7 w-7 sm:h-8 sm:w-8 lg:h-[30px] lg:w-[30px] flex items-center justify-center transition-colors touch-manipulation flex-shrink-0 ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-[#2a2a2f] hover:bg-gray-100'
          }`}
        >
          <ChevronLeftIcon />
        </button>

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`h-7 w-7 sm:h-8 sm:w-8 lg:h-[30px] lg:w-[30px] flex items-center justify-center transition-colors touch-manipulation flex-shrink-0 ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-[#2a2a2f] hover:bg-gray-100'
          }`}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

// Icon Components
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Pagination;
