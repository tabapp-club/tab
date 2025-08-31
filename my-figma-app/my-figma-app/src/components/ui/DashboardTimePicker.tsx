"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Clock } from 'lucide-react';

interface DashboardTimePickerProps {
  selected?: string;
  onSelect?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DashboardTimePicker({
  selected,
  onSelect,
  placeholder = "Select time",
  disabled = false,
  className = ""
}: DashboardTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options (24-hour format with 30-minute intervals)
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
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-[#e9e9e9] rounded-lg shadow-[-4px_-4px_12px_0px_rgba(0,0,0,0.08),4px_4px_12px_0px_rgba(0,0,0,0.08)]" align="start">
        <div className="p-4">
          {/* Selected Time Display */}
          <div className="mb-3 p-2 bg-[#f8f9fa] rounded text-center">
            <span className="font-['Manrope:Medium',sans-serif] font-medium text-[13px] text-[#2a2a2f] leading-[1.4]">
              {selected ? formatDisplayTime(selected) : "Choose a time"}
            </span>
          </div>

          {/* Time Options Grid */}
          <div className="max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => handleSelect(time)}
                  className={`
                    h-10 px-3 rounded-lg flex items-center justify-center transition-colors
                    ${selected === time
                      ? "bg-[#6E4EFF] text-white"
                      : "text-[#2a2a2f] hover:bg-[#6E4EFF]/5 hover:text-[#6E4EFF]"
                    }
                  `}
                >
                  <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] leading-[1.4]">
                    {formatDisplayTime(time)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="border-t border-[#e9e9e9] pt-3 mt-4">
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 px-2 bg-white border border-[#dce0e5] rounded-md flex items-center justify-center hover:bg-[#6E4EFF]/5 hover:border-[#6E4EFF] hover:text-[#6E4EFF] transition-colors"
              >
                <span className="font-['Manrope:Medium',sans-serif] font-medium text-[15px] text-[#2a2a2f] leading-[1.4]">
                  Cancel
                </span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 px-2 bg-[#6E4EFF] hover:bg-[#5D3EE8] text-white rounded flex items-center justify-center transition-colors"
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
