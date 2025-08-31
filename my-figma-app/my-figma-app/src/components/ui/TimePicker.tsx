"use client";

import React, { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

interface TimePickerProps {
  selected?: string;
  onSelect?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  selected,
  onSelect,
  placeholder = "Select time",
  disabled = false,
  className = ""
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options (24-hour format)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  const handleSelect = (time: string) => {
    onSelect?.(time);
    setIsOpen(false);
  };

  const formatDisplayTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
              {selected ? formatDisplayTime(selected) : placeholder}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-[4px] shadow-lg max-h-60 overflow-y-auto" align="start">
        <div className="py-2">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleSelect(time)}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors
                ${selected === time ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
              `}
            >
              {formatDisplayTime(time)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
