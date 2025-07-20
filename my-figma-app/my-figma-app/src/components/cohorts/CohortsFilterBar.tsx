"use client";

import { useState } from "react";

// Search icon for the input field
const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="6.75" stroke="currentColor" strokeWidth="1.5"/>
    <path d="m18.5 18.5-3.75-3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CohortsFilterBarProps {
  totalCohorts?: number;
  visibleCohorts?: number;
  onSearch?: (query: string) => void;
}

export function CohortsFilterBar({
  totalCohorts = 50,
  visibleCohorts = 10,
  onSearch
}: CohortsFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-3 sm:py-2 min-h-[60px]">
        {/* Cohorts count */}
        <div className="flex items-center px-1 sm:px-2">
          <span className="text-sm sm:text-[14px] font-medium text-[#071437] leading-[14px] whitespace-nowrap">
            Showing {visibleCohorts} of {totalCohorts} cohorts
          </span>
        </div>

        {/* Search input */}
        <div className="flex items-center justify-end">
          <div className="relative w-full sm:w-auto sm:min-w-[168px]">
            <div className="bg-[#f6f6f6] border border-transparent rounded-md h-8 flex items-center px-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20">
              {/* Search icon */}
              <div className="flex items-center justify-center pl-1 pr-0">
                <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex items-center justify-center text-[#757575]">
                  <SearchIcon />
                </div>
              </div>

              {/* Input field */}
              <div className="flex-1 h-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search cohorts"
                  className="w-full h-[30px] bg-transparent border-none outline-none text-sm sm:text-[13.3438px] font-normal text-[#2a2a2f] placeholder:text-[#757575] px-2 py-[6.5px] rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
