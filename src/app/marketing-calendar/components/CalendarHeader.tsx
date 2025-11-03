"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentView: 'week' | 'list';
  onViewChange: (view: 'week' | 'list') => void;
  onCreateNew: () => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  currentView,
  onViewChange,
  onCreateNew,
  currentDate,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 gap-4 bg-white">
      {/* Month Title with chevrons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="text-[#2a2a2f]" />
        </button>
        <h1 className="text-[20px] sm:text-[20px] font-bold text-black font-manrope leading-[1.4]">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h1>
        <button
          onClick={onNext}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} className="text-[#2a2a2f]" />
        </button>
      </div>

      {/* View Toggle and Create Button */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Today Button - Hidden on mobile */}
        <button
          onClick={onToday}
          className={`hidden lg:flex items-center gap-1 px-6 py-2 rounded-[99px] border transition-all font-medium text-[14px] font-manrope leading-[1.4] bg-white border-[#e9e9e9] text-[#2a2a2f] hover:bg-gray-50`}
        >
          <span className="whitespace-nowrap">Today</span>
        </button>

        {/* Week View Button - Hidden on mobile */}
        <button
          onClick={() => onViewChange('week')}
          className={`hidden lg:flex items-center gap-1 px-6 py-2 rounded-[99px] border transition-all font-medium text-[14px] font-manrope leading-[1.4]
            ${currentView === 'week' 
              ? 'bg-[#e9e9e9] border-[#e9e9e9] text-[#2a2a2f]' 
              : 'bg-white border-[#e9e9e9] text-[#2a2a2f] hover:bg-gray-50'
            }
          `}
        >
          <span className="whitespace-nowrap">Week</span>
          <CalendarIcon size={16} className="flex-shrink-0" />
        </button>

        {/* List View Button */}
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center gap-1 px-6 py-2 rounded-[99px] border transition-all font-medium text-[14px] font-manrope leading-[1.4]
            ${currentView === 'list' 
              ? 'bg-[#e9e9e9] border-[#e9e9e9] text-[#2a2a2f]' 
              : 'bg-white border-[#e9e9e9] text-[#2a2a2f] hover:bg-gray-50'
            }
          `}
        >
          <span className="whitespace-nowrap">List view</span>
          <List size={16} className="flex-shrink-0" />
        </button>

        {/* Create New Button */}
        <div className="relative">
          <button
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            className="flex items-center gap-1 px-4 py-2 bg-[#9747ff] text-white rounded-[99px] border border-[#e9e9e9] hover:bg-[#8636ee] transition-all font-medium text-[14px] font-manrope leading-[1.4]"
          >
            <Plus size={22} strokeWidth={2} className="flex-shrink-0" />
            <span className="whitespace-nowrap">Create new</span>
            <ChevronDown size={20} className="flex-shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {showCreateDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCreateDropdown(false)}
              />
              
              {/* Dropdown Content */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button
                  onClick={() => {
                    onCreateNew();
                    setShowCreateDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#2a2a2f] hover:bg-gray-50 transition-colors font-manrope"
                >
                  <div className="font-medium">New Event</div>
                  <div className="text-xs text-gray-500 mt-0.5">Create a calendar event</div>
                </button>
                <button
                  onClick={() => {
                    setShowCreateDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#2a2a2f] hover:bg-gray-50 transition-colors font-manrope"
                >
                  <div className="font-medium">New Appointment</div>
                  <div className="text-xs text-gray-500 mt-0.5">Schedule an appointment</div>
                </button>
                <button
                  onClick={() => {
                    setShowCreateDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#2a2a2f] hover:bg-gray-50 transition-colors font-manrope"
                >
                  <div className="font-medium">New Campaign</div>
                  <div className="text-xs text-gray-500 mt-0.5">Create a marketing campaign</div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

