"use client";

import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent, getEventCountSummary, getEventTypeLabel, getInactiveCustomerCountForDate, getBirthdayCustomersForDate } from '../mockData';
import { CampaignDetailsSidepane } from '@/components/campaigns/CampaignDetailsSidepane';
import { RecommendedCampaign } from '@/components/campaigns/RecommendedCampaigns';

interface WeekViewProps {
  startDate: Date;
  events: CalendarEvent[];
  onDateChange?: (date: Date) => void;
}

export default function WeekView({ startDate, events, onDateChange }: WeekViewProps) {
  const [campaignSidePaneOpen, setCampaignSidePaneOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RecommendedCampaign | null>(null);

  // Map birthday data to campaign format
  const mapBirthdayToCampaign = useCallback((date: Date): RecommendedCampaign => {
    const birthdayCustomers = getBirthdayCustomersForDate(date);
    const count = birthdayCustomers.length;
    
    return {
      id: `birthday-${date.toISOString()}`,
      title: 'Birthday Wishes',
      count,
      description: `This month's birthdays - time-sensitive opportunity for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      expectedCampaignCost: '₹6.5K',
      expectedConversion: '28%',
      expectedRevenue: '₹55K',
      urgency: 'high' as const,
      priority: false,
      estimatedImpact: 'Strong emotional connection'
    };
  }, []);

  // Map inactive customers data to campaign format
  const mapInactiveToCampaign = useCallback((date: Date): RecommendedCampaign => {
    const count = getInactiveCustomerCountForDate(date);
    
    return {
      id: `inactive-${date.toISOString()}`,
      title: 'Inactive Users',
      count,
      description: `Re-engage dormant customers with offers and personalized content for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      expectedCampaignCost: '₹9K',
      expectedConversion: '20%',
      expectedRevenue: '₹35K',
      urgency: 'high' as const,
      priority: true,
      estimatedImpact: 'Revenue recovery opportunity'
    };
  }, []);
  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  // Day names
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Hours for the day (7 AM to 10 PM)
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  // Navigation functions
  const goToPreviousWeek = () => {
    if (onDateChange) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() - 7);
      onDateChange(newDate);
    }
  };

  const goToNextWeek = () => {
    if (onDateChange) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + 7);
      onDateChange(newDate);
    }
  };

  // Format time
  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Handle birthday badge click
  const handleBirthdayClick = (date: Date) => {
    const campaign = mapBirthdayToCampaign(date);
    setSelectedCampaign(campaign);
    setCampaignSidePaneOpen(true);
  };

  // Handle inactive campaign badge click
  const handleInactiveClick = (date: Date) => {
    const campaign = mapInactiveToCampaign(date);
    setSelectedCampaign(campaign);
    setCampaignSidePaneOpen(true);
  };

  // Handle campaign sidepane close
  const handleCampaignSidePaneClose = useCallback(() => {
    setCampaignSidePaneOpen(false);
    setSelectedCampaign(null);
  }, []);

  // Get event summary badges
  const getEventBadges = (date: Date) => {
    const typeEmoji: Record<string, string> = {
      'birthday': '🎂',
      'national-festival': '🎉',
      'regional-festival': '🎊',
      'global-thematic': '🌐',
      'appointment': '🗓️',
      'meeting': '🤝',
      'follow-up': '🔁',
      'inactive-quarterly': '💤',
    };
    const dayEvents = getEventsForDay(date);
    const summary = getEventCountSummary(date);
    const badges = [];

    // Create badges for each event type
    for (const [type, count] of Object.entries(summary)) {
      if (count > 0) {
        // For single events, show the event title; for multiple, show count
        if (count === 1) {
          const event = dayEvents.find(e => e.type === type);
          let labelBase = event?.title || getEventTypeLabel(type, count);
          if (type === 'inactive-quarterly') {
            const inactiveCount = getInactiveCustomerCountForDate(date);
            labelBase = `Inactive (${inactiveCount})`;
          }
          const emoji = typeEmoji[type] || '';
          badges.push({ 
            label: `${emoji} ${labelBase}`.trim(), 
            count,
            type,
            date 
          });
        } else {
          const emoji = typeEmoji[type] || '';
          const baseLabel = type === 'inactive-quarterly'
            ? `Inactive (${count})`
            : getEventTypeLabel(type, count);
          badges.push({ 
            label: `${emoji} ${baseLabel}`.trim(), 
            count,
            type,
            date 
          });
        }
      }
    }

    return badges;
  };

  return (
    <div className="flex-1 border-t border-[#e9e9e9]">
      {/* Week Days Header */}
      <div className="border-b border-[#e9e9e9] bg-white sticky top-0 z-10 mt-4">
        <div className="flex h-[114px]">
          {/* Left Navigation - Time column placeholder */}
          <div className="w-12 flex-shrink-0 flex items-center justify-center">
            <button
              onClick={goToPreviousWeek}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} className="text-[#2a2a2f]" strokeWidth={2} />
            </button>
          </div>

          {/* Day columns */}
          {weekDays.map((date, index) => {
            const badges = getEventBadges(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`flex-1 border-r border-[#e9e9e9] last:border-r-0 px-2 py-1 ${index === 0 ? 'border-l' : ''}`}
              >
                <div className="flex flex-col h-full">
                  {/* Day name and date */}
                  <div className="mb-2 px-2">
                    <div className="text-[10px] font-bold text-zinc-500 font-manrope tracking-tight leading-[12px]">
                      {dayNames[index]}
                    </div>
                    <div className={`text-[22px] font-medium font-manrope leading-[32px] ${isToday ? 'text-[#9747ff]' : 'text-black'}`}>
                      {date.getDate()}
                    </div>
                  </div>

                  {/* Event badges */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-1">
                      {badges.slice(0, 2).map((badge, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (badge.type === 'birthday') {
                              handleBirthdayClick(badge.date);
                            } else if (badge.type === 'inactive-quarterly') {
                              handleInactiveClick(badge.date);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-normal font-manrope border-[0.5px] border-[#9747ff] text-[#2a2a2f] bg-white leading-[12px] tracking-tight transition-colors ${
                            badge.type === 'birthday' || badge.type === 'inactive-quarterly' ? 'hover:bg-[#9747ff] hover:text-white cursor-pointer' : ''
                          }`}
                        >
                          {badge.label}
                        </button>
                      ))}
                      {badges.length > 2 && (
                        <div className="px-3 py-1 rounded-full text-[10px] font-normal font-manrope bg-[#9747ff] text-white leading-[12px] tracking-tight">
                          +{badges.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Right Navigation - Time column placeholder to match grid */}
          <div className="w-12 flex-shrink-0 flex items-center justify-center">
            <button
              onClick={goToNextWeek}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Next week"
            >
              <ChevronRight size={20} className="text-[#2a2a2f]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Time Grid */}
      <div className="overflow-auto max-h-[calc(100vh-300px)] mt-6">
        {hours.map((hour, hourIndex) => (
          <div key={hour} className="flex h-[72px]">
            {/* Time label - left */}
            <div className="w-12 flex-shrink-0 text-xs font-medium text-zinc-500 pt-0 font-manrope leading-[16px]">
              {formatTime(hour)}
            </div>

            {/* Day columns with 30-minute blocks */}
            <div className="flex-1 flex border-t border-[#e9e9e9]">
              {weekDays.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`flex-1 flex flex-col border-r border-[#e0e0e0] last:border-r-0 relative ${dayIndex === 0 ? 'border-l' : ''}`}
                >
                  {/* First 30-minute block */}
                  <div className="h-9 border-b border-[#f7f7f7] hover:bg-blue-50 transition-colors cursor-pointer" />
                  {/* Second 30-minute block */}
                  <div className="h-9 hover:bg-blue-50 transition-colors cursor-pointer" />
                </div>
              ))}
            </div>

            {/* Time label - right */}
            <div className="w-12 flex-shrink-0 text-xs font-medium text-zinc-500 pt-0 font-manrope leading-[16px]">
              {formatTime(hour)}
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Details Sidepane */}
      <CampaignDetailsSidepane
        isOpen={campaignSidePaneOpen}
        onClose={handleCampaignSidePaneClose}
        campaign={selectedCampaign}
      />
    </div>
  );
}

