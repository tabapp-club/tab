"use client";

import { useState, useRef } from "react";
import { CalendarDropdown } from "./CalendarDropdown";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface TimeFilterProps {
  onFilterChange?: (filter: { type: string; days?: number; dateRange?: DateRange }) => void;
}

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M7 2v4M15 2v4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 8h16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 12h1M10 12h1M13 12h1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 16h1M10 16h1M13 16h1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const timeFilters = [
  { id: "today", label: "Today", active: true },
  { id: "yesterday", label: "Yesterday", active: false },
  { id: "7d", label: "7D", active: false },
  { id: "30d", label: "30D", active: false },
  { id: "3m", label: "3M", active: false },
  { id: "6m", label: "6M", active: false },
  { id: "12m", label: "12M", active: false },
  { id: "custom", label: "custom", active: false, hasIcon: true }
];

export function TimeFilter({ onFilterChange }: TimeFilterProps = {}) {
  const [activeFilter, setActiveFilter] = useState("today");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ from: null, to: null });
  const customButtonRef = useRef<HTMLButtonElement>(null!);

  const filterDaysMap: Record<string, number | undefined> = {
    today: undefined, // Don't send days parameter for today
    yesterday: 1,
    "7d": 7,
    "30d": 30,
    "3m": 90,
    "6m": 180,
    "12m": 365,
  };

  const handleFilterClick = (filterId: string) => {
    if (filterId === "custom") {
      setIsCalendarOpen(true);
    } else {
      setActiveFilter(filterId);
      setSelectedDateRange({ from: null, to: null });
      if (onFilterChange) {
        const filterConfig: { type: string; days?: number } = { type: filterId };
        // Only add days if it's defined (not undefined)
        if (filterDaysMap[filterId] !== undefined) {
          filterConfig.days = filterDaysMap[filterId];
        }
        onFilterChange(filterConfig);
      }
    }
  };

  const handleDateRangeSelect = (range: DateRange) => {
    setSelectedDateRange(range);
    setActiveFilter("custom");
    setIsCalendarOpen(false);
    if (onFilterChange) {
      onFilterChange({ type: "custom", dateRange: range });
    }
  };

  const getCustomLabel = () => {
    if (selectedDateRange.from && selectedDateRange.to) {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: selectedDateRange.from.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      };

      const fromStr = selectedDateRange.from.toLocaleDateString('en-US', options);
      const toStr = selectedDateRange.to.toLocaleDateString('en-US', options);

      // Always include year if either date is not from current year
      if (selectedDateRange.from.getFullYear() !== new Date().getFullYear() ||
          selectedDateRange.to.getFullYear() !== new Date().getFullYear()) {
        const optionsWithYear: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        };
        const fromStrWithYear = selectedDateRange.from.toLocaleDateString('en-US', optionsWithYear);
        const toStrWithYear = selectedDateRange.to.toLocaleDateString('en-US', optionsWithYear);
        return `${fromStrWithYear} - ${toStrWithYear}`;
      }

      return `${fromStr} - ${toStr}`;
    }
    return "custom";
  };

  return (
    <>
      <div className="overflow-x-auto mb-4 sm:mb-6">
        <div className="inline-flex border border-[#e9e9e9] rounded-[5px] bg-white overflow-hidden min-w-max">
        {timeFilters.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          const isFirst = index === 0;
          const isLast = index === timeFilters.length - 1;

          return (
            <button
              key={filter.id}
              ref={filter.id === "custom" ? customButtonRef : undefined}
              onClick={() => handleFilterClick(filter.id)}
              className={`
                h-10 px-3 border-r border-[#e9e9e9] last:border-r-0
                flex items-center justify-center gap-2
                  transition-colors whitespace-nowrap
                ${isActive
                  ? 'bg-[#6E4EFF] text-white'
                  : 'bg-white text-[#8f8f91] hover:bg-[#6E4EFF]/5 hover:text-[#6E4EFF]'
                }
                ${isFirst ? 'rounded-l-[4px]' : ''}
                ${isLast ? 'rounded-r-[4px]' : ''}
              `}
            >
              <span className="text-[13.5625px] font-medium leading-[19.6px] whitespace-nowrap">
                {filter.id === "custom" ? getCustomLabel() : filter.label}
              </span>
              {filter.hasIcon && (
                  <div className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                  <CalendarIcon />
                </div>
              )}
            </button>
          );
        })}
        </div>
      </div>

      <CalendarDropdown
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateRangeSelect={handleDateRangeSelect}
        targetRef={customButtonRef as React.RefObject<HTMLButtonElement>}
      />
    </>
  );
}
