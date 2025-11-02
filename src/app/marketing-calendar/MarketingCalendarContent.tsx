"use client";

import React, { useState } from 'react';
import CalendarSidebar from './components/CalendarSidebar';
import CalendarHeader from './components/CalendarHeader';
import WeekView from './components/WeekView';
import ListView from './components/ListView';
import AutomationSettingsPanel from './components/AutomationSettingsPanel';
import AddCalendarSidepane from './components/AddCalendarSidepane';
import { mockEvents, eventFilters, myCalendars } from './mockData';
import { Menu, X } from 'lucide-react';
import { useSidebar } from '@/components/SidebarContext';

export default function MarketingCalendarContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'week' | 'list'>('week');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const [showAddCalendarPanel, setShowAddCalendarPanel] = useState(false);
  
  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Event filters state
  const [eventFiltersState, setEventFiltersState] = useState(
    eventFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.enabled;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // Calendar filters state
  const [myCalendarsState, setMyCalendarsState] = useState(
    myCalendars.reduce((acc, calendar) => {
      acc[calendar.id] = calendar.enabled;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // Get start of week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(selectedDate);

  // Filter events based on selected filters
  const filteredEvents = mockEvents.filter(event => {
    // Apply event type filters - check if the event type's filter is enabled
    const typeFilter = eventFiltersState[event.type] !== undefined 
      ? eventFiltersState[event.type]
      : true; // Show events with types not in filters by default
    
    // Apply calendar filters if event has calendar property
    const calendarFilter = event.calendar 
      ? myCalendarsState[event.calendar] 
      : true;
    
    return typeFilter && calendarFilter;
  });

  const handleEventFilterToggle = (id: string) => {
    setEventFiltersState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCalendarToggle = (id: string) => {
    setMyCalendarsState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCreateNew = () => {
    // Handle create new event
    console.log('Create new event');
  };

  // Header navigation handlers
  const handlePrev = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      if (currentView === 'week') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      if (currentView === 'week') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const mainClasses = `flex-1 transition-sidebar min-h-screen bg-white main-content ${
    actualIsCollapsed ? 'sidebar-collapsed' : ''
  }`;

  return (
    <main className={mainClasses}>
      <div className="flex h-screen">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-[#9747ff] text-white rounded-full shadow-lg hover:bg-[#8636ee] transition-all"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-[282px] flex-shrink-0 overflow-y-auto border-r border-gray-200 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <CalendarSidebar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            eventFiltersState={eventFiltersState}
            myCalendarsState={myCalendarsState}
            onEventFilterToggle={handleEventFilterToggle}
            onCalendarToggle={handleCalendarToggle}
            onOpenAutomation={() => setShowAutomationPanel(true)}
            onOpenAddCalendar={() => setShowAddCalendarPanel(true)}
          />
        </div>

        {/* Sidebar - Mobile */}
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowMobileSidebar(false)}
            />
            
            {/* Sidebar Panel */}
            <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[282px] bg-[#f6f6f6] z-50 shadow-xl transform transition-transform">
              {/* Close Button */}
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X size={24} className="text-[#2a2a2f]" />
              </button>

              <CalendarSidebar
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  setShowMobileSidebar(false);
                }}
                eventFiltersState={eventFiltersState}
                myCalendarsState={myCalendarsState}
                onEventFilterToggle={handleEventFilterToggle}
                onCalendarToggle={handleCalendarToggle}
                onOpenAutomation={() => {
                  setShowAutomationPanel(true);
                  setShowMobileSidebar(false);
                }}
                onOpenAddCalendar={() => {
                  setShowAddCalendarPanel(true);
                  setShowMobileSidebar(false);
                }}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white w-full">
          <CalendarHeader
            currentView={currentView}
            onViewChange={setCurrentView}
            onCreateNew={handleCreateNew}
            currentDate={selectedDate}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
          />

          <div className="flex-1 overflow-auto px-4 py-0 lg:px-4 lg:py-0 bg-white w-full">
            {currentView === 'week' ? (
              <WeekView
                startDate={weekStart}
                events={filteredEvents}
                onDateChange={setSelectedDate}
              />
            ) : (
              <ListView events={filteredEvents} />
            )}
          </div>
        </div>
      </div>

      {/* Automation Settings Panel */}
      <AutomationSettingsPanel
        isOpen={showAutomationPanel}
        onClose={() => setShowAutomationPanel(false)}
      />

      {/* Add Calendar Sidepane */}
      <AddCalendarSidepane
        isOpen={showAddCalendarPanel}
        onClose={() => setShowAddCalendarPanel(false)}
        onAddCalendar={(url, name) => {
          // Handle calendar addition logic here
          console.log('Adding calendar:', name, url);
          // You can update myCalendars state or make an API call here
        }}
      />
    </main>
  );
}

