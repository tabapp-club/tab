"use client";

import { useState, useRef, useEffect } from "react";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface CalendarDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onDateRangeSelect?: (range: DateRange) => void;
  targetRef: React.RefObject<HTMLButtonElement>;
}

const ChevronLeftIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.25 8.125L3.125 5L6.25 1.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.75 1.875L6.875 5L3.75 8.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function CalendarDropdown({ isOpen, onClose, onDateRangeSelect, targetRef }: CalendarDropdownProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ from: null, to: null });
  const [isSelectingTo, setIsSelectingTo] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Position the dropdown
  useEffect(() => {
    if (isOpen && targetRef.current && calendarRef.current) {
      const positionCalendar = () => {
        const target = targetRef.current!;
        const calendar = calendarRef.current!;
        const targetRect = target.getBoundingClientRect();

        // Reset any previous positioning
        calendar.style.position = 'fixed';
        calendar.style.top = '0px';
        calendar.style.left = '0px';
        calendar.style.right = 'auto';
        calendar.style.bottom = 'auto';

        // Get calendar dimensions after it's rendered
        const calendarRect = calendar.getBoundingClientRect();
        const calendarWidth = calendarRect.width || 328;
        const calendarHeight = calendarRect.height || 400;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate best position
        let top = targetRect.bottom + 8;
        let left = targetRect.left;

        // Check if there's enough space on the right
        if (left + calendarWidth > viewportWidth - 20) {
          left = targetRect.right - calendarWidth;
        }

        // Check if there's enough space below
        if (top + calendarHeight > viewportHeight - 20) {
          top = targetRect.top - calendarHeight - 8;
        }

        // Final boundary checks
        left = Math.max(20, Math.min(left, viewportWidth - calendarWidth - 20));
        top = Math.max(20, Math.min(top, viewportHeight - calendarHeight - 20));

        // Apply the position
        calendar.style.top = `${top}px`;
        calendar.style.left = `${left}px`;
      };

      // Position immediately and after a short delay for rendering
      positionCalendar();
      const timeoutId = setTimeout(positionCalendar, 10);

      // Update on scroll/resize
      const updatePosition = () => positionCalendar();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, targetRef]);

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        targetRef.current &&
        !targetRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, targetRef]);

  // Reset state when calendar opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRange({ from: null, to: null });
      setIsSelectingTo(false);
    }
  }, [isOpen]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    if (!selectedRange.from || isSelectingTo) {
      // First click or selecting "to" date
      if (!selectedRange.from) {
        setSelectedRange({ from: date, to: null });
        setIsSelectingTo(true);
      } else {
        // Selecting "to" date
        if (date >= selectedRange.from) {
          setSelectedRange(prev => ({ ...prev, to: date }));
        } else {
          // If "to" is before "from", swap them
          setSelectedRange({ from: date, to: selectedRange.from });
        }
        setIsSelectingTo(false);
      }
    } else {
      // Start new range selection
      setSelectedRange({ from: date, to: null });
      setIsSelectingTo(true);
    }
  };

  const handleDone = () => {
    if (selectedRange.from && selectedRange.to) {
      onDateRangeSelect?.(selectedRange);
    }
    onClose();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!selectedRange.from || !selectedRange.to) return false;
    return date >= selectedRange.from && date <= selectedRange.to;
  };

  const isRangeStart = (date: Date) => {
    return selectedRange.from && date.toDateString() === selectedRange.from.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    return selectedRange.to && date.toDateString() === selectedRange.to.toDateString();
  };

  const formatDateRange = () => {
    if (!selectedRange.from) return "Select start date";
    if (!selectedRange.to) return `From ${selectedRange.from.toLocaleDateString()} - Select end date`;
    return `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`;
  };

  const days = getDaysInMonth(currentDate);

  if (!isOpen) return null;

  return (
    <div
      ref={calendarRef}
      className="calendar-dropdown visible"
      style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '328px',
        zIndex: 1000
      }}
    >
      <div className="bg-white rounded-lg border border-[#e9e9e9] shadow-[-4px_-4px_12px_0px_rgba(0,0,0,0.08),4px_4px_12px_0px_rgba(0,0,0,0.08)] p-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-2 mb-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-8 h-8 rounded-[25px] border border-[#e9e9e9] flex items-center justify-center hover:bg-[#6E4EFF]/5 hover:border-[#6E4EFF] transition-colors"
          >
            <div className="rotate-90 scale-y-[-1]">
              <ChevronRightIcon />
            </div>
          </button>

          <div className="flex-1 text-center">
            <div className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] text-[#2a2a2f] leading-[1.4]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
          </div>

          <button
            onClick={() => navigateMonth('next')}
            className="w-8 h-8 rounded-[25px] border border-[#e9e9e9] flex items-center justify-center hover:bg-[#6E4EFF]/5 hover:border-[#6E4EFF] transition-colors"
          >
            <div className="rotate-90 scale-y-[-1]">
              <ChevronLeftIcon />
            </div>
          </button>
        </div>

        {/* Selected Range Display */}
        <div className="mb-3 p-2 bg-[#f8f9fa] rounded text-center">
          <span className="font-['Manrope:Medium',sans-serif] font-medium text-[13px] text-[#2a2a2f] leading-[1.4]">
            {formatDateRange()}
          </span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="h-9 flex items-center justify-center">
              <span className="font-['Manrope:Regular',sans-serif] font-normal text-[15px] text-[#a1a1a1] leading-[1.4]">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1 mb-4">
          {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-0">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => (
                <div key={dayIndex} className="h-9 flex items-center justify-center">
                  {date ? (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                        isRangeStart(date) || isRangeEnd(date)
                          ? "bg-[#6E4EFF] text-white"
                          : isInRange(date)
                          ? "bg-[#6E4EFF]/10 text-[#6E4EFF]"
                          : isToday(date)
                          ? "bg-[#f2f2f2] text-[#2a2a2f] border border-[#6E4EFF]"
                          : "text-[#2a2a2f] hover:bg-[#6E4EFF]/5 hover:text-[#6E4EFF]"
                      }`}
                    >
                      <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] leading-[1.4]">
                        {date.getDate()}
                      </span>
                    </button>
                  ) : (
                    <div className="h-9 w-9"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="border-t border-[#e9e9e9] pt-3">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={onClose}
              className="h-8 px-2 bg-white border border-[#dce0e5] rounded-md flex items-center justify-center hover:bg-[#6E4EFF]/5 hover:border-[#6E4EFF] hover:text-[#6E4EFF] transition-colors"
            >
              <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] text-[#2a2a2f] leading-[1.4]">
                Cancel
              </span>
            </button>
            <button
              onClick={handleDone}
              disabled={!selectedRange.from || !selectedRange.to}
              className={`h-8 px-2 rounded flex items-center justify-center transition-colors ${
                selectedRange.from && selectedRange.to
                  ? "bg-[#6E4EFF] hover:bg-[#5D3EE8] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] leading-[1.4]">
                Done
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
