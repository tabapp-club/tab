"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, Settings, Zap } from 'lucide-react';
import { eventFilters, myCalendars } from '../mockData';

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  eventFiltersState: { [key: string]: boolean };
  myCalendarsState: { [key: string]: boolean };
  onEventFilterToggle: (id: string) => void;
  onCalendarToggle: (id: string) => void;
  onOpenAutomation?: () => void;
  onOpenAddCalendar?: () => void;
}

export default function CalendarSidebar({
  selectedDate,
  onDateChange,
  eventFiltersState,
  myCalendarsState,
  onEventFilterToggle,
  onCalendarToggle,
  onOpenAutomation,
  onOpenAddCalendar,
}: CalendarSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [showEventFilters, setShowEventFilters] = useState(true);
  const [showMyCalendars, setShowMyCalendars] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    timeZone: 'EST (GMT-5)',
    weekStartsOn: 'Sunday',
    timeFormat: '12h',
    defaultDuration: '30',
    showWeekends: true,
  });

  // Navigate months
  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="bg-[#f6f6f6] h-full flex flex-col gap-6 px-2 py-10 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Mini Calendar */}
      <div className="bg-transparent rounded-lg">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-t-lg">
          <h3 className="text-base font-semibold text-[#202021] font-manrope tracking-[0.08px]">
            {monthName}
          </h3>
          <div className="flex items-center">
            <button
              onClick={previousMonth}
              className="p-0.5 hover:bg-gray-50/50 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={21} className="text-[#2a2a2f]" strokeWidth={2} />
            </button>
            <button
              onClick={nextMonth}
              className="p-0.5 hover:bg-gray-50/50 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={21} className="text-[#2a2a2f]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="px-2 pb-2 rounded-b-lg">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-0 mb-0">
            {dayNames.map((day, index) => (
              <div
                key={index}
                className="h-10 flex items-center justify-center text-[10px] font-medium text-[#2a2a2f] opacity-70 font-manrope tracking-[0.05px]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => onDateChange(day.fullDate)}
                className={`h-10 flex items-center justify-center text-xs font-normal font-manrope transition-all tracking-[0.06px]
                  ${!day.isCurrentMonth ? 'opacity-50' : ''}
                  ${isSelectedDate(day.fullDate) ? 'bg-[#9747ff] text-white rounded-full w-6 h-6 mx-auto' : 'text-[#2a2a2f] hover:bg-gray-50/50 rounded-md'}
                  ${isToday(day.fullDate) && !isSelectedDate(day.fullDate) ? 'font-semibold' : ''}
                `}
              >
                {day.date}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Filters */}
      <div className="bg-transparent rounded-lg">
        <button
          onClick={() => setShowEventFilters(!showEventFilters)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-t-lg hover:bg-gray-50/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-[#202021] font-manrope tracking-[0.08px]">
            Events
          </h3>
          <ChevronRight
            size={21}
            className={`text-[#2a2a2f] transition-transform ${showEventFilters ? 'rotate-90' : ''}`}
            strokeWidth={2}
          />
        </button>

        {showEventFilters && (
          <div className="pb-0 rounded-b-lg">
            {eventFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onEventFilterToggle(filter.id)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors flex-shrink-0
                    ${eventFiltersState[filter.id] ? 'bg-[#9747ff] border-[#9747ff]' : 'bg-white border-gray-300'}
                  `}
                >
                  {eventFiltersState[filter.id] && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-xs font-normal text-[#2a2a2f] font-manrope tracking-[0.15px]">
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* My Calendars */}
      <div className="bg-transparent rounded-lg">
        <button
          onClick={() => setShowMyCalendars(!showMyCalendars)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-t-lg hover:bg-gray-50/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-[#202021] font-manrope tracking-[0.08px]">
            My calendars
          </h3>
          <div className="flex items-center gap-1">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddCalendar?.();
              }}
              className="p-0.5 hover:bg-gray-50/50 rounded transition-colors cursor-pointer"
              aria-label="Add calendar"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenAddCalendar?.();
                }
              }}
            >
              <Plus size={22} className="text-[#2a2a2f]" strokeWidth={2} />
            </div>
            <ChevronRight
              size={21}
              className={`text-[#2a2a2f] transition-transform ${showMyCalendars ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
          </div>
        </button>

        {showMyCalendars && (
          <div className="pb-0 rounded-b-lg">
            {myCalendars.map((calendar) => (
              <button
                key={calendar.id}
                onClick={() => onCalendarToggle(calendar.id)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors flex-shrink-0
                    ${myCalendarsState[calendar.id] ? `bg-[${calendar.color}] border-[${calendar.color}]` : 'bg-white border-gray-300'}
                  `}
                  style={{
                    backgroundColor: myCalendarsState[calendar.id] ? calendar.color : 'white',
                    borderColor: myCalendarsState[calendar.id] ? calendar.color : '#d1d5db',
                  }}
                >
                  {myCalendarsState[calendar.id] && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-xs font-normal text-[#2a2a2f] font-manrope tracking-[0.15px]">
                  {calendar.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Automation Section */}
      <div className="bg-transparent rounded-lg">
        <button
          onClick={() => onOpenAutomation?.()}
          className="w-full flex items-center justify-between px-3 py-2 rounded-t-lg hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#9747ff]" />
            <h3 className="text-base font-semibold text-[#202021] font-manrope tracking-[0.08px]">
              Automation
            </h3>
          </div>
          <ChevronRight size={21} className="text-[#2a2a2f]" strokeWidth={2} />
        </button>
      </div>

      {/* Settings Section */}
      <div className="bg-transparent rounded-lg">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-t-lg hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#2a2a2f]" />
            <h3 className="text-base font-semibold text-[#202021] font-manrope tracking-[0.08px]">
              Settings
            </h3>
          </div>
          <ChevronRight
            size={21}
            className={`text-[#2a2a2f] transition-transform ${showSettings ? 'rotate-90' : ''}`}
            strokeWidth={2}
          />
        </button>

        {showSettings && (
          <div className="pb-0 rounded-b-lg space-y-3 pt-2">
            {/* Time Zone */}
            <div className="px-4 py-2">
              <label className="text-xs font-medium text-[#2a2a2f] font-manrope tracking-[0.15px] block mb-2">
                Time Zone
              </label>
              <select
                value={settings.timeZone}
                onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
                className="w-full px-3 py-2 text-xs font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent"
              >
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
                <option>CST (GMT-6)</option>
                <option>MST (GMT-7)</option>
                <option>UTC (GMT+0)</option>
              </select>
            </div>

            {/* Week Starts On */}
            <div className="px-4 py-2">
              <label className="text-xs font-medium text-[#2a2a2f] font-manrope tracking-[0.15px] block mb-2">
                Week Starts On
              </label>
              <select
                value={settings.weekStartsOn}
                onChange={(e) => setSettings({ ...settings, weekStartsOn: e.target.value })}
                className="w-full px-3 py-2 text-xs font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent"
              >
                <option>Sunday</option>
                <option>Monday</option>
              </select>
            </div>

            {/* Time Format */}
            <div className="px-4 py-2">
              <label className="text-xs font-medium text-[#2a2a2f] font-manrope tracking-[0.15px] block mb-2">
                Time Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                className="w-full px-3 py-2 text-xs font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent"
              >
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>

            {/* Default Event Duration */}
            <div className="px-4 py-2">
              <label className="text-xs font-medium text-[#2a2a2f] font-manrope tracking-[0.15px] block mb-2">
                Default Event Duration
              </label>
              <select
                value={settings.defaultDuration}
                onChange={(e) => setSettings({ ...settings, defaultDuration: e.target.value })}
                className="w-full px-3 py-2 text-xs font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            {/* Show Weekends Toggle */}
            <div className="px-4 py-2 pb-3">
              <button
                onClick={() => setSettings({ ...settings, showWeekends: !settings.showWeekends })}
                className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors py-1 rounded"
              >
                <label className="text-xs font-medium text-[#2a2a2f] font-manrope tracking-[0.15px] cursor-pointer">
                  Show Weekends
                </label>
                <div
                  className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors flex-shrink-0
                    ${settings.showWeekends ? 'bg-[#9747ff] border-[#9747ff]' : 'bg-white border-gray-300'}
                  `}
                >
                  {settings.showWeekends && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

