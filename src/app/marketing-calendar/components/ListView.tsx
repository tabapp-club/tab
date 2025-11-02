"use client";

import React, { useState, useCallback } from 'react';
import { Calendar, Clock, MapPin, Users, MoreVertical } from 'lucide-react';
import { CalendarEvent, getEventTypeLabel, getInactiveCustomerCountForDate, getBirthdayCustomersForDate } from '../mockData';
import { CampaignDetailsSidepane } from '@/components/campaigns/CampaignDetailsSidepane';
import { RecommendedCampaign } from '@/components/campaigns/RecommendedCampaigns';

interface ListViewProps {
  events: CalendarEvent[];
}

export default function ListView({ events }: ListViewProps) {
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

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'birthday') {
      const campaign = mapBirthdayToCampaign(event.date);
      setSelectedCampaign(campaign);
      setCampaignSidePaneOpen(true);
    } else if (event.type === 'inactive-quarterly') {
      const campaign = mapInactiveToCampaign(event.date);
      setSelectedCampaign(campaign);
      setCampaignSidePaneOpen(true);
    }
  };

  // Handle campaign sidepane close
  const handleCampaignSidePaneClose = useCallback(() => {
    setCampaignSidePaneOpen(false);
    setSelectedCampaign(null);
  }, []);

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = event.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'national-festival':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'regional-festival':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'global-thematic':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'birthday':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'inactive-quarterly':
        return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'follow-up':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'appointment':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'meeting':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'birthday':
        return '🎂';
      case 'national-festival':
        return '🎉';
      case 'regional-festival':
        return '🎊';
      case 'global-thematic':
        return '🌐';
      case 'inactive-quarterly':
        return '💤';
      case 'appointment':
        return '🗓️';
      case 'meeting':
        return '🤝';
      case 'follow-up':
        return '🔁';
      default:
        return '';
    }
  };

  // Format date for header
  const formatDateHeader = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex-1 border-t border-[#e9e9e9] mt-4">
      <div className="overflow-auto max-h-[calc(100vh-250px)] pt-6">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-manrope">
              No events scheduled
            </h3>
            <p className="text-sm text-gray-500 font-manrope">
              Create your first event to get started
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(dateKey => {
              const date = new Date(dateKey);
              const dayEvents = groupedEvents[dateKey];
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={dateKey} className="space-y-3">
                  {/* Date Header */}
                  <div className={`flex items-center gap-3 pb-3 border-b sticky top-0 bg-white z-10
                    ${isToday ? 'border-[#9747ff]' : 'border-gray-200'}
                  `}>
                    <div className={`text-sm font-bold font-manrope tracking-tight
                      ${isToday ? 'text-[#9747ff]' : 'text-gray-900'}
                    `}>
                      {formatDateHeader(date)}
                    </div>
                    <div className="text-xs text-gray-500 font-manrope tracking-tight">
                      {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#9747ff] hover:bg-purple-50 transition-all group ${
                          event.type === 'birthday' || event.type === 'inactive-quarterly' ? 'cursor-pointer' : ''
                        }`}
                      >
                        {/* Event Time */}
                        {event.time && (
                          <div className="flex-shrink-0 w-20">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 font-manrope tracking-tight">
                              <Clock size={14} />
                              <span>{event.time}</span>
                            </div>
                            {event.duration && (
                              <div className="text-xs text-gray-500 font-manrope mt-1 tracking-tight">
                                {event.duration} min
                              </div>
                            )}
                          </div>
                        )}

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          {/* Title and Type Badge */}
                          <div className="flex items-start gap-2 mb-2">
                            <h4 className="text-base font-semibold text-gray-900 font-manrope flex-1 tracking-tight">
                              {event.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${getEventTypeColor(event.type)} font-manrope tracking-tight`}>
                              {(() => {
                                const emoji = getTypeEmoji(event.type);
                                const label = event.type === 'inactive-quarterly'
                                  ? `Inactive (${getInactiveCustomerCountForDate(event.date)})`
                                  : getEventTypeLabel(event.type, 1).replace(/^\d+\s/, '');
                                return `${emoji} ${label}`.trim();
                              })()}
                            </span>
                          </div>

                          {/* Description */}
                          {event.description && (
                            <p className="text-sm text-gray-600 mb-2 font-manrope tracking-tight">
                              {event.description}
                            </p>
                          )}

                          {/* Additional Info */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {event.location && (
                              <div className="flex items-center gap-1.5 font-manrope">
                                <MapPin size={12} />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1.5 font-manrope">
                                <Users size={12} />
                                <span>{event.attendees.join(', ')}</span>
                              </div>
                            )}
                            {event.calendar && (
                              <div className="flex items-center gap-1.5 font-manrope">
                                <Calendar size={12} />
                                <span>{event.calendar}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <button className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-100">
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

