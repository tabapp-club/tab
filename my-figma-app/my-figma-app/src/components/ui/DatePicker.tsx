"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DropdownProps } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  className = ""
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    if (date) {
      setIsOpen(false);
    }
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
              {selected ? format(selected, 'PPP') : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-[4px] shadow-lg" align="start">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={[
            { before: minDate },
            { after: maxDate }
          ].filter(Boolean)}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-gray-900",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-600 hover:text-gray-900",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-[4px] transition-colors",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600",
            day_today: "bg-gray-100 text-gray-900",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-400 opacity-50",
            day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-600",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
