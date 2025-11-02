"use client";

import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DashboardDatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
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

export function DashboardDatePicker({
  selected,
  onSelect,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  className = ""
}: DashboardDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selected || new Date());

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
    // Check if date is within allowed range
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    
    onSelect?.(date);
    setIsOpen(false);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString();
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left border border-gray-300 rounded-[4px] 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${selected ? 'text-gray-900' : 'text-gray-500'}
            ${className}
          `}
        >
          <div className="flex items-center justify-between">
            <span>
              {selected ? formatDisplayDate(selected) : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-[#e9e9e9] rounded-lg shadow-[-4px_-4px_12px_0px_rgba(0,0,0,0.08),4px_4px_12px_0px_rgba(0,0,0,0.08)]" align="start">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 py-2 mb-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 rounded-[25px] border border-[#e9e9e9] flex items-center justify-center hover:bg-[#9747FF]/5 hover:border-[#9747FF] transition-colors"
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
              className="w-8 h-8 rounded-[25px] border border-[#e9e9e9] flex items-center justify-center hover:bg-[#9747FF]/5 hover:border-[#9747FF] transition-colors"
            >
              <div className="rotate-90 scale-y-[-1]">
                <ChevronLeftIcon />
              </div>
            </button>
          </div>

          {/* Selected Date Display */}
          <div className="mb-3 p-2 bg-[#f8f9fa] rounded text-center">
            <span className="font-['Manrope:Medium',sans-serif] font-medium text-[13px] text-[#2a2a2f] leading-[1.4]">
              {selected ? formatDisplayDate(selected) : "Select a date"}
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
                        disabled={isDisabled(date)}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected(date)
                            ? "bg-[#9747FF] text-white"
                            : isToday(date)
                            ? "bg-[#f2f2f2] text-[#2a2a2f] border border-[#9747FF]"
                            : isDisabled(date)
                            ? "text-[#a1a1a1] cursor-not-allowed"
                            : "text-[#2a2a2f] hover:bg-[#9747FF]/5 hover:text-[#9747FF]"
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
                onClick={() => setIsOpen(false)}
                className="h-8 px-2 bg-white border border-[#dce0e5] rounded-md flex items-center justify-center hover:bg-[#9747FF]/5 hover:border-[#9747FF] hover:text-[#9747FF] transition-colors"
              >
                <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] text-[#2a2a2f] leading-[1.4]">
                  Cancel
                </span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 px-2 bg-[#9747FF] hover:bg-[#9747FF] text-white rounded flex items-center justify-center transition-colors"
              >
                <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] leading-[1.4]">
                  Done
                </span>
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
