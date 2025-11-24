'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';

// Event Tag Types
export enum EventTag {
  ENQUIRY_CREATED = 'ENQUIRY_CREATED',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  VISIT_COMPLETED = 'VISIT_COMPLETED',
  CONSULTATION_DONE = 'CONSULTATION_DONE',
  TREATMENT_RECOMMENDED = 'TREATMENT_RECOMMENDED',
  TREATMENT_STARTED = 'TREATMENT_STARTED',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  TREATMENT_COMPLETED = 'TREATMENT_COMPLETED',
  FOLLOWUP_DUE = 'FOLLOWUP_DUE',
  FOLLOWUP_CALL = 'FOLLOWUP_CALL',
  FOLLOWUP_MESSAGE = 'FOLLOWUP_MESSAGE',
  FOLLOWUP_OUTCOME = 'FOLLOWUP_OUTCOME',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  NOTE_ADDED = 'NOTE_ADDED',
}

// Payment Mode Types
export enum PaymentMode {
  CASH = 'Cash',
  UPI = 'UPI',
  CARD = 'Card',
  EMI = 'EMI',
  BANK_TRANSFER = 'Bank Transfer',
  CHEQUE = 'Cheque',
}

// Treatment Category Types
export type TreatmentCategory = 'Skin' | 'Hair' | 'Laser' | 'Medical' | 'Cosmetic' | 'PRP' | string;

// Timeline Event Interface
export interface TimelineEvent {
  id: string;
  tag: EventTag | string;
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled' | 'in-progress';
  treatmentCategories?: TreatmentCategory[];
  paymentInfo?: {
    amount: number;
    mode: PaymentMode | string;
    invoiceId?: string;
    billNumber?: string;
    outstandingBalance?: number;
  };
  invoiceInfo?: {
    invoiceId?: string;
    billNumber?: string;
    invoiceUrl?: string;
    prescriptionUrl?: string;
    hasAttachments: boolean;
  };
  customMetadata?: Record<string, string>;
  notes?: string;
}

// Action Types
export type ActionType = 
  | 'call' 
  | 'whatsapp' 
  | 'sms' 
  | 'book-appointment' 
  | 'send-reminder' 
  | 'log-followup' 
  | 'send-feedback' 
  | 'offer-crosssell';

export interface SuggestedAction {
  type: ActionType;
  label: string;
  icon?: string;
}

interface PatientTimelineProps {
  customerId: string;
  events?: TimelineEvent[];
  onEventCreate?: (event: Omit<TimelineEvent, 'id'>) => void;
  onEventUpdate?: (eventId: string, updates: Partial<TimelineEvent>) => void;
  onAction?: (eventId: string, actionType: ActionType) => void;
}

// Tag Display Names & Icons
const tagConfig: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  [EventTag.ENQUIRY_CREATED]: { label: 'Enquiry', icon: '💬', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  [EventTag.APPOINTMENT_BOOKED]: { label: 'Appointment', icon: '📅', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  [EventTag.APPOINTMENT_CANCELLED]: { label: 'Cancelled', icon: '❌', color: 'text-red-700', bgColor: 'bg-red-50' },
  [EventTag.VISIT_COMPLETED]: { label: 'Visit', icon: '✅', color: 'text-green-700', bgColor: 'bg-green-50' },
  [EventTag.CONSULTATION_DONE]: { label: 'Consultation', icon: '🩺', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  [EventTag.TREATMENT_RECOMMENDED]: { label: 'Recommended', icon: '💡', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  [EventTag.TREATMENT_STARTED]: { label: 'Treatment Started', icon: '🚀', color: 'text-cyan-700', bgColor: 'bg-cyan-50' },
  [EventTag.SESSION_COMPLETED]: { label: 'Session', icon: '✨', color: 'text-teal-700', bgColor: 'bg-teal-50' },
  [EventTag.TREATMENT_COMPLETED]: { label: 'Completed', icon: '🎉', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  [EventTag.FOLLOWUP_DUE]: { label: 'Follow-up Due', icon: '⏰', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  [EventTag.FOLLOWUP_CALL]: { label: 'Follow-up Call', icon: '📞', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  [EventTag.FOLLOWUP_MESSAGE]: { label: 'Follow-up Message', icon: '💬', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  [EventTag.FOLLOWUP_OUTCOME]: { label: 'Follow-up Outcome', icon: '📊', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  [EventTag.PAYMENT_RECEIVED]: { label: 'Payment', icon: '💰', color: 'text-green-700', bgColor: 'bg-green-50' },
  [EventTag.NOTE_ADDED]: { label: 'Note', icon: '📝', color: 'text-gray-700', bgColor: 'bg-gray-50' },
};

// Get contextually relevant footer actions based on event tag, status, and available data
const getFooterActions = (event: TimelineEvent): SuggestedAction[] => {
  const actions: SuggestedAction[] = [];
  const { tag, status, invoiceInfo, paymentInfo } = event;

  // Send Reminder - for appointments (booked or pending)
  if (
    (tag === EventTag.APPOINTMENT_BOOKED && status === 'pending') ||
    (tag === EventTag.APPOINTMENT_BOOKED && status !== 'cancelled') ||
    (status === 'pending' && (tag === EventTag.FOLLOWUP_DUE || tag === EventTag.TREATMENT_STARTED))
  ) {
    actions.push({ type: 'send-reminder', label: 'Send Reminder', icon: '🔔' });
  }

  // Send Follow-up - for completed treatments, consultations, or follow-up due
  if (
    tag === EventTag.FOLLOWUP_DUE ||
    tag === EventTag.TREATMENT_COMPLETED ||
    tag === EventTag.CONSULTATION_DONE ||
    tag === EventTag.SESSION_COMPLETED ||
    (tag === EventTag.VISIT_COMPLETED && status === 'completed')
  ) {
    actions.push({ type: 'log-followup', label: 'Send Follow-up', icon: '📞' });
  }

  // Send Invoice/Prescription - for consultations, treatments, or payment events with invoice info
  if (
    invoiceInfo &&
    (tag === EventTag.CONSULTATION_DONE ||
     tag === EventTag.TREATMENT_STARTED ||
     tag === EventTag.SESSION_COMPLETED ||
     tag === EventTag.TREATMENT_COMPLETED ||
     tag === EventTag.VISIT_COMPLETED ||
     tag === EventTag.PAYMENT_RECEIVED)
  ) {
    if (invoiceInfo.invoiceId && invoiceInfo.prescriptionUrl) {
      actions.push({ type: 'send-feedback', label: 'Send Invoice & Prescription', icon: '📄💊' });
    } else if (invoiceInfo.invoiceId) {
      actions.push({ type: 'send-feedback', label: 'Send Invoice', icon: '📄' });
    } else if (invoiceInfo.prescriptionUrl) {
      actions.push({ type: 'send-feedback', label: 'Send Prescription', icon: '💊' });
    }
  }

  // Send Documents - for any event with attachments
  if (invoiceInfo?.hasAttachments) {
    actions.push({ type: 'send-feedback', label: 'Send Documents', icon: '📎' });
  }

  // Book Appointment - for enquiries or completed treatments
  if (tag === EventTag.ENQUIRY_CREATED || tag === EventTag.TREATMENT_COMPLETED) {
    actions.push({ type: 'book-appointment', label: 'Book Appointment', icon: '📅' });
  }

  // Send Payment Receipt - for payment events
  if (tag === EventTag.PAYMENT_RECEIVED && paymentInfo) {
    actions.push({ type: 'send-feedback', label: 'Send Receipt', icon: '🧾' });
  }

  // Call Patient - for enquiries, pending appointments, or follow-ups
  if (
    tag === EventTag.ENQUIRY_CREATED ||
    (tag === EventTag.APPOINTMENT_BOOKED && status === 'pending') ||
    tag === EventTag.FOLLOWUP_DUE
  ) {
    actions.push({ type: 'call', label: 'Call Patient', icon: '📞' });
  }

  // Send Feedback Form - for completed treatments
  if (tag === EventTag.TREATMENT_COMPLETED || tag === EventTag.SESSION_COMPLETED) {
    actions.push({ type: 'send-feedback', label: 'Send Feedback Form', icon: '📝' });
  }

  // Reschedule - for cancelled or pending appointments
  if (tag === EventTag.APPOINTMENT_CANCELLED || (tag === EventTag.APPOINTMENT_BOOKED && status === 'pending')) {
    actions.push({ type: 'book-appointment', label: 'Reschedule', icon: '🔄' });
  }

  return actions;
};

// Generate mock events
const generateMockEvents = (customerId: string): TimelineEvent[] => {
  const now = new Date();
  return [
    {
      id: '1',
      tag: EventTag.ENQUIRY_CREATED,
      title: 'Initial Enquiry',
      description: 'Patient enquired about acne treatment options via phone',
      timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      treatmentCategories: ['Skin', 'Medical'],
      notes: 'Patient showed interest in acne treatment. Recommended consultation with Dr. Sharma.',
    },
    {
      id: '2',
      tag: EventTag.APPOINTMENT_BOOKED,
      title: 'Appointment Scheduled',
      description: 'Consultation appointment booked for acne treatment',
      timestamp: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      treatmentCategories: ['Skin'],
    },
    {
      id: '3',
      tag: EventTag.CONSULTATION_DONE,
      title: 'Consultation Completed',
      description: 'Dr. Sharma conducted initial consultation. Recommended chemical peel treatment (3 sessions).',
      timestamp: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      treatmentCategories: ['Skin', 'Cosmetic'],
      invoiceInfo: {
        invoiceId: 'INV-2024-001',
        billNumber: 'BL-2024-001',
        hasAttachments: true,
        prescriptionUrl: '/prescriptions/pres-001.pdf',
      },
      notes: 'Patient has moderate acne. Recommended 3 sessions of chemical peel with 2-week intervals.',
    },
    {
      id: '4',
      tag: EventTag.PAYMENT_RECEIVED,
      title: 'Payment Received',
      description: 'Payment received for consultation and first treatment session',
      timestamp: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      paymentInfo: {
        amount: 5000,
        mode: PaymentMode.UPI,
        invoiceId: 'INV-2024-001',
        billNumber: 'BL-2024-001',
        outstandingBalance: 10000,
      },
      invoiceInfo: {
        invoiceId: 'INV-2024-001',
        billNumber: 'BL-2024-001',
        invoiceUrl: '/invoices/inv-001.pdf',
        hasAttachments: true,
      },
    },
    {
      id: '5',
      tag: EventTag.TREATMENT_STARTED,
      title: 'Treatment Started',
      description: 'First session of chemical peel treatment initiated',
      timestamp: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      treatmentCategories: ['Skin', 'Cosmetic'],
      notes: 'Session 1 of 3 completed. Patient responded well. No adverse reactions.',
    },
    {
      id: '6',
      tag: EventTag.SESSION_COMPLETED,
      title: 'Session 2 Completed',
      description: 'Second session of chemical peel treatment completed successfully',
      timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      treatmentCategories: ['Skin', 'Cosmetic'],
      notes: 'Good progress observed. Significant improvement in acne. One more session remaining.',
    },
    {
      id: '7',
      tag: EventTag.FOLLOWUP_DUE,
      title: 'Follow-up Due',
      description: 'Follow-up appointment due after treatment completion',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      treatmentCategories: ['Skin'],
    },
  ];
};

// Group events by date and sort them (most recent first)
const groupEventsByDate = (events: TimelineEvent[]) => {
  const groups: Record<string, TimelineEvent[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  events.forEach(event => {
    const eventDate = new Date(event.timestamp);
    let groupKey: string;

    if (eventDate >= today) {
      groupKey = 'Today';
    } else if (eventDate >= yesterday) {
      groupKey = 'Yesterday';
    } else if (eventDate >= thisWeek) {
      groupKey = 'This Week';
    } else if (eventDate >= thisMonth) {
      groupKey = 'This Month';
    } else {
      groupKey = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(event);
  });

  // Sort events within each group by timestamp (most recent first)
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  return groups;
};

export default function PatientTimeline({
  customerId,
  events: initialEvents,
  onEventCreate,
  onEventUpdate,
  onAction,
}: PatientTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    initialEvents || generateMockEvents(customerId)
  );
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort events (most recent first)
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tag.toLowerCase().includes(query) ||
        event.notes?.toLowerCase().includes(query)
      );
    }

    // Tag filter
    if (selectedTags.size > 0) {
      filtered = filtered.filter(event => selectedTags.has(event.tag));
    }

    // Sort by timestamp (most recent first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return filtered;
  }, [events, searchQuery, selectedTags]);

  // Group filtered events and ensure proper display order (most recent first)
  const groupedEvents = useMemo(() => {
    const groups = groupEventsByDate(filteredEvents);
    
    // Define group order for proper sorting (most recent first)
    const groupOrder: Record<string, number> = {
      'Today': 0,
      'Yesterday': 1,
      'This Week': 2,
      'This Month': 3,
    };
    
    // Get the most recent event timestamp from each group to sort month groups
    const getGroupSortKey = (groupName: string, events: TimelineEvent[]): number => {
      if (groupOrder[groupName] !== undefined) {
        return groupOrder[groupName];
      }
      // For month groups, use the most recent event timestamp (negative for descending sort)
      if (events.length > 0) {
        return -new Date(events[0].timestamp).getTime();
      }
      return 999999;
    };
    
    // Sort groups: predefined groups first, then by most recent event timestamp
    const sortedEntries = Object.entries(groups).sort(([keyA, eventsA], [keyB, eventsB]) => {
      const sortKeyA = getGroupSortKey(keyA, eventsA);
      const sortKeyB = getGroupSortKey(keyB, eventsB);
      return sortKeyA - sortKeyB;
    });
    
    return Object.fromEntries(sortedEntries);
  }, [filteredEvents]);

  const toggleExpand = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const handleAction = (eventId: string, actionType: ActionType, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onAction) {
      onAction(eventId, actionType);
    } else {
      console.log(`Action ${actionType} triggered for event ${eventId}`);
      if (actionType === 'log-followup' || actionType === 'call') {
        const newEvent: TimelineEvent = {
          id: `event-${Date.now()}`,
          tag: EventTag.FOLLOWUP_CALL,
          title: 'Follow-up Call',
          description: `Follow-up call logged via ${actionType}`,
          timestamp: new Date().toISOString(),
          status: 'completed',
        };
        setEvents(prev => [newEvent, ...prev]);
      }
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'in-progress':
        return { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return null;
    }
  };

  const tagConfigForEvent = (tag: string) => {
    return tagConfig[tag] || { label: tag, icon: '📌', color: 'text-gray-700', bgColor: 'bg-gray-50' };
  };

  const allTags = Object.keys(tagConfig);

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-xl border border-[#e9e9e9] p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row: Title and Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-[#2a2a2f]">Patient Journey Timeline</h3>
              <p className="text-[12px] font-normal text-[#626266] mt-1">
                Track all patient interactions, treatments, and follow-ups
              </p>
            </div>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="px-4 py-2 bg-[#9747FF] text-white rounded hover:bg-[#9747FF]/90 transition-colors text-[14px] font-medium flex items-center gap-2 shadow-sm"
            >
              <span className="text-lg">+</span>
              <span>Add Event</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="group bg-[#f6f6f6] border border-[#e9e9e9] hover:border-[#d1d5db] focus-within:border-[#9747FF] focus-within:ring-2 focus-within:ring-[#9747FF]/20 flex flex-row h-10 items-center justify-start p-px relative rounded transition-all duration-200">
            <div className="flex items-center justify-center h-full w-10 shrink-0 text-[#757575] group-focus-within:text-[#9747FF] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, description, or notes..."
              className="flex-1 h-full bg-transparent border-none outline-none text-[#2a2a2f] text-[14px] placeholder:text-[#757575] font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-[#757575] hover:text-[#2a2a2f]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-medium text-[#626266]">Filter:</span>
            {allTags.slice(0, 8).map(tag => {
              const config = tagConfig[tag];
              const isSelected = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? `${config.bgColor} ${config.color} border-current`
                      : 'bg-white text-[#626266] border-[#e9e9e9] hover:border-[#9747FF] hover:text-[#9747FF]'
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
            {selectedTags.size > 0 && (
              <button
                onClick={() => setSelectedTags(new Set())}
                className="px-3 py-1 text-[11px] font-medium rounded-full border border-[#e9e9e9] bg-white text-[#626266] hover:border-red-300 hover:text-red-600"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e9e9e9] p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h4 className="text-[16px] font-semibold text-[#2a2a2f] mb-2">
            {searchQuery || selectedTags.size > 0 ? 'No events found' : 'No timeline events yet'}
          </h4>
          <p className="text-[14px] text-[#626266] mb-6">
            {searchQuery || selectedTags.size > 0
              ? 'Try adjusting your search or filters'
              : 'Start tracking patient interactions by adding your first event'}
          </p>
          {!searchQuery && selectedTags.size === 0 && (
            <button
              onClick={() => setIsAddingEvent(true)}
              className="px-6 py-2.5 bg-[#9747FF] text-white rounded hover:bg-[#9747FF]/90 transition-colors text-[14px] font-medium"
            >
              Add First Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([groupName, groupEvents]) => (
            <div key={groupName}>
              {/* Date Group Header */}
              <div className="sticky top-0 z-10 bg-[#f6f6f6] -mx-6 px-6 py-3 mb-4 border-b border-[#e9e9e9]">
                <h4 className="text-[14px] font-semibold text-[#2a2a2f]">
                  {groupName} · {groupEvents.length} {groupEvents.length === 1 ? 'event' : 'events'}
                </h4>
              </div>

              {/* Timeline Events Container */}
              <div className="relative space-y-6 pl-[60px]">
                {/* Vertical Gradient Line */}
                <div 
                  className="absolute top-0 bottom-0 w-[4px] rounded-full" 
                  style={{ 
                    left: '18px',
                    background: 'linear-gradient(to bottom, #9747FF 0%, #a855f7 50%, #c084fc 100%)'
                  }}
                ></div>

                {groupEvents.map((event, index) => {
                  const isExpanded = expandedEvents.has(event.id);
                  const timeDisplay = formatDateTime(event.timestamp);
                  const footerActions = getFooterActions(event);
                  const statusBadge = getStatusBadge(event.status);
                  const config = tagConfigForEvent(event.tag);

                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline Dot - Centered on line */}
                      {/* Line at 18px (spans 18-22px, center: 20px) relative to timeline container */}
                      {/* This event wrapper is offset by pl-[60px] = 60px */}
                      {/* To position dot center at 20px: left = 20px - 20px (radius) - 60px (padding) = -60px */}
                      <div 
                        className="absolute top-2 z-10"
                        style={{ left: '-60px' }} 
                      >
                        <div className={`w-[40px] h-[40px] rounded-full border-[3px] border-solid border-white shadow-lg flex items-center justify-center ${
                          event.status === 'completed' 
                            ? 'bg-gray-300' 
                            : event.status === 'pending'
                            ? 'bg-[#fbbf24]'
                            : event.status === 'in-progress'
                            ? 'bg-[#3b82f6] animate-pulse'
                            : 'bg-[#9ca3af]'
                        }`}>
                          <span className="text-[16px] leading-[16px] flex items-center justify-center">{config.icon}</span>
                        </div>
                      </div>

                      {/* Event Card */}
                      <div className={`bg-white rounded-xl border transition-all duration-200 ${
                        isExpanded 
                          ? 'border-[#9747FF] shadow-lg shadow-[#9747FF]/10' 
                          : 'border-[#e9e9e9] hover:border-[#9747FF]/50 hover:shadow-md'
                      }`}>
                        {/* Card Header - Always Visible */}
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => toggleExpand(event.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Tags and Status with Date/Time */}
                              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${config.bgColor} ${config.color} border border-current/20`}>
                                    {config.icon} {config.label}
                                  </span>
                                  {statusBadge && (
                                    <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full border ${statusBadge.color}`}>
                                      {statusBadge.label}
                                    </span>
                                  )}
                                  {event.treatmentCategories && event.treatmentCategories.length > 0 && (
                                    <span className="px-2.5 py-1 text-[10px] font-normal rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                      {event.treatmentCategories.slice(0, 2).join(', ')}
                                      {event.treatmentCategories.length > 2 && ` +${event.treatmentCategories.length - 2}`}
                                    </span>
                                  )}
                                </div>
                                {/* Chevron/Arrow and Date/Time - Right Aligned */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Date and Time */}
                                  <div className="flex items-center gap-1.5 text-[11px] font-normal text-[#626266]">
                                    {typeof timeDisplay === 'string' ? (
                                      <span>{timeDisplay}</span>
                                    ) : (
                                      <>
                                        <span>{timeDisplay.date}</span>
                                        <span>•</span>
                                        <span>{timeDisplay.time}</span>
                                      </>
                                    )}
                                  </div>
                                  {/* Expand Icon */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpand(event.id);
                                    }}
                                    className="text-[#626266] hover:text-[#9747FF] transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="text-[15px] font-semibold text-[#2a2a2f] mb-1.5">
                                {event.title}
                              </h4>

                              {/* Description */}
                              <p className={`text-[13px] font-normal text-[#626266] ${
                                !isExpanded ? 'line-clamp-2' : ''
                              }`}>
                                {event.description}
                              </p>

                              {/* Footer: Payment Info and Action Buttons */}
                              <div className="flex items-center justify-between mt-3 pt-3">
                                <div className="flex items-center gap-2 flex-1">
                                  {event.paymentInfo && (
                                    <div className="flex items-center gap-2 text-[11px] font-normal text-[#626266]">
                                      <span className="font-semibold text-green-600">
                                        ₹{event.paymentInfo.amount.toLocaleString()}
                                      </span>
                                    </div>
                                  )}

                                  {/* Footer Action Buttons - Left Aligned */}
                                  {footerActions.length > 0 && !isExpanded && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {footerActions.slice(0, 3).map((action) => (
                                        <button
                                          key={`${action.type}-${action.label}`}
                                          onClick={(e) => handleAction(event.id, action.type, e)}
                                          className="h-9 px-4 text-[12px] font-medium rounded border border-[#9747FF] bg-white text-[#9747FF] hover:bg-[#9747FF]/10 hover:border-[#9747FF] active:bg-[#9747FF]/20 active:border-[#8537ef] focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:ring-offset-1 transition-all flex items-center gap-1.5 whitespace-nowrap"
                                        >
                                          {action.icon && <span>{action.icon}</span>}
                                          <span>{action.label}</span>
                                        </button>
                                      ))}
                                      {footerActions.length > 3 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(event.id);
                                          }}
                                          className="h-9 px-4 text-[12px] font-medium rounded border border-[#9747FF] bg-white text-[#9747FF] hover:bg-[#9747FF]/10 hover:border-[#9747FF] active:bg-[#9747FF]/20 active:border-[#8537ef] focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:ring-offset-1 transition-all"
                                        >
                                          +{footerActions.length - 3} more
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-[#e9e9e9] bg-gray-50/50 p-4 space-y-4 animate-in slide-in-from-top-2">
                            {/* Payment Info */}
                            {event.paymentInfo && (
                              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">💰</span>
                                  <p className="text-[13px] font-semibold text-emerald-900">Payment Information</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-[12px]">
                                  <div>
                                    <span className="text-emerald-700">Amount:</span>
                                    <span className="ml-2 font-semibold text-emerald-900">₹{event.paymentInfo.amount.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-emerald-700">Mode:</span>
                                    <span className="ml-2 text-emerald-900">{event.paymentInfo.mode}</span>
                                  </div>
                                  {event.paymentInfo.invoiceId && (
                                    <div>
                                      <span className="text-emerald-700">Invoice:</span>
                                      <span className="ml-2 text-emerald-900">{event.paymentInfo.invoiceId}</span>
                                    </div>
                                  )}
                                  {event.paymentInfo.outstandingBalance !== undefined && (
                                    <div>
                                      <span className="text-emerald-700">Outstanding:</span>
                                      <span className="ml-2 font-semibold text-emerald-900">₹{event.paymentInfo.outstandingBalance.toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Invoice/Prescription */}
                            {event.invoiceInfo && (
                              <div>
                                <p className="text-[11px] font-semibold text-[#626266] mb-2 uppercase tracking-wide">Documents</p>
                                <div className="space-y-2">
                                  {event.invoiceInfo.invoiceId && (
                                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e9e9e9]">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">📄</span>
                                        <span className="text-[12px] font-medium text-[#2a2a2f]">Invoice {event.invoiceInfo.invoiceId}</span>
                                      </div>
                                      {event.invoiceInfo.invoiceUrl && (
                                        <a
                                          href={event.invoiceInfo.invoiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[11px] font-medium text-[#9747FF] hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          View PDF
                                        </a>
                                      )}
                                    </div>
                                  )}
                                  {event.invoiceInfo.prescriptionUrl && (
                                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e9e9e9]">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">💊</span>
                                        <span className="text-[12px] font-medium text-[#2a2a2f]">Prescription</span>
                                      </div>
                                      <a
                                        href={event.invoiceInfo.prescriptionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-medium text-[#9747FF] hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        View PDF
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {event.notes && (
                              <div>
                                <p className="text-[11px] font-semibold text-[#626266] mb-2 uppercase tracking-wide">Notes</p>
                                <p className="text-[13px] font-normal text-[#2a2a2f] bg-white p-3 rounded-lg border border-[#e9e9e9]">
                                  {event.notes}
                                </p>
                              </div>
                            )}

                             {/* Footer Actions - All Available */}
                             {footerActions.length > 0 && (
                               <div>
                                 <p className="text-[11px] font-semibold text-[#626266] mb-2 uppercase tracking-wide">Available Actions</p>
                                 <div className="flex flex-wrap gap-2">
                                   {footerActions.map((action) => (
                                     <button
                                       key={`${action.type}-${action.label}`}
                                       onClick={(e) => handleAction(event.id, action.type, e)}
                                       className="h-9 px-4 text-[12px] font-medium rounded border border-[#9747FF] bg-white text-[#9747FF] hover:bg-[#9747FF]/10 hover:border-[#9747FF] active:bg-[#9747FF]/20 active:border-[#8537ef] focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:ring-offset-1 transition-all flex items-center gap-1.5"
                                     >
                                       {action.icon && <span>{action.icon}</span>}
                                       <span>{action.label}</span>
                                     </button>
                                   ))}
                                 </div>
                               </div>
                             )}

                            {/* Edit Button */}
                            <div className="pt-2 border-t border-[#e9e9e9]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEventId(event.id);
                                }}
                                className="text-[12px] font-medium text-[#9747FF] hover:underline"
                              >
                                ✏️ Edit Event
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {(isAddingEvent || editingEventId) && (
        <EventFormModal
          event={editingEventId ? events.find(e => e.id === editingEventId) : undefined}
          onClose={() => {
            setIsAddingEvent(false);
            setEditingEventId(null);
          }}
          onSave={(eventData) => {
            if (editingEventId) {
              setEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, ...eventData } : e));
              if (onEventUpdate) {
                onEventUpdate(editingEventId, eventData);
              }
              setEditingEventId(null);
            } else {
              const newEvent: TimelineEvent = {
                id: `event-${Date.now()}`,
                ...eventData,
              };
              setEvents(prev => [newEvent, ...prev]);
              if (onEventCreate) {
                onEventCreate(newEvent);
              }
              setIsAddingEvent(false);
            }
          }}
        />
      )}
    </div>
  );
}

// Event Form Modal Component
interface EventFormModalProps {
  event?: TimelineEvent;
  onClose: () => void;
  onSave: (eventData: Omit<TimelineEvent, 'id'>) => void;
}

function EventFormModal({ event, onClose, onSave }: EventFormModalProps) {
  const [formData, setFormData] = useState<Omit<TimelineEvent, 'id'>>({
    tag: event?.tag || EventTag.NOTE_ADDED,
    title: event?.title || '',
    description: event?.description || '',
    timestamp: event?.timestamp || new Date().toISOString(),
    status: event?.status || 'completed',
    treatmentCategories: event?.treatmentCategories || [],
    paymentInfo: event?.paymentInfo,
    invoiceInfo: event?.invoiceInfo,
    customMetadata: event?.customMetadata || {},
    notes: event?.notes || '',
  });

  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customCategories, setCustomCategories] = useState<TreatmentCategory[]>([]);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const allEventTags = Object.values(EventTag);
  const defaultTreatmentCategoryOptions: TreatmentCategory[] = ['Skin', 'Hair', 'Laser', 'Medical', 'Cosmetic', 'PRP'];
  const allTreatmentCategoryOptions = [...defaultTreatmentCategoryOptions, ...customCategories];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setIsTagDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    if (isTagDropdownOpen || isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTagDropdownOpen, isCategoryDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addCustomTag = () => {
    const trimmedTag = customTagInput.trim();
    if (trimmedTag && !allEventTags.includes(trimmedTag as EventTag)) {
      // Save custom event type to localStorage
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('custom_event_types');
          const customEventTypes: string[] = stored ? JSON.parse(stored) : [];
          if (!customEventTypes.includes(trimmedTag)) {
            customEventTypes.push(trimmedTag);
            localStorage.setItem('custom_event_types', JSON.stringify(customEventTypes));
            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('eventTypesUpdated'));
          }
        } catch (error) {
          console.error('Error saving custom event type:', error);
        }
      }
      setFormData(prev => ({ ...prev, tag: trimmedTag }));
      setCustomTagInput('');
      setIsTagDropdownOpen(false);
    }
  };

  const toggleTreatmentCategory = (category: TreatmentCategory) => {
    setFormData(prev => {
      const categories = prev.treatmentCategories || [];
      if (categories.includes(category)) {
        return { ...prev, treatmentCategories: categories.filter(c => c !== category) };
      } else {
        return { ...prev, treatmentCategories: [...categories, category] };
      }
    });
  };

  const addCustomCategory = () => {
    const trimmedCategory = customCategoryInput.trim();
    if (trimmedCategory && !allTreatmentCategoryOptions.includes(trimmedCategory)) {
      setCustomCategories(prev => [...prev, trimmedCategory]);
      setFormData(prev => ({
        ...prev,
        treatmentCategories: [...(prev.treatmentCategories || []), trimmedCategory]
      }));
      setCustomCategoryInput('');
      setShowAddCategoryInput(false);
    }
  };

  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = new Date(e.target.value).toISOString();
    setFormData(prev => ({ ...prev, timestamp: newDateTime }));
  };

  const tagConfig = tagConfigForEvent(formData.tag);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white rounded-xl border border-[#e9e9e9] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9e9e9] bg-gradient-to-r from-[#9747FF]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#9747FF] flex items-center justify-center text-white text-lg">
              {tagConfig.icon}
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#2a2a2f]">
                {event ? 'Edit Event' : 'Add New Event'}
              </h3>
              <p className="text-[12px] text-[#626266] mt-0.5">
                {event ? 'Update event details' : 'Create a new timeline event'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#626266] hover:text-[#2a2a2f] hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e9]">
                <span className="text-[14px] font-semibold text-[#2a2a2f]">Basic Information</span>
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-[#2a2a2f]">
                  Event Type <span className="text-red-500">*</span>
                </Label>
                <div className="relative" ref={tagDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-[4px] text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:ring-offset-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>{tagConfig.icon}</span>
                      <span>{tagConfig.label}</span>
                    </span>
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isTagDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#e9e9e9] rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
                      {allEventTags.map(tag => {
                        const config = tagConfigForEvent(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, tag }));
                              setIsTagDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </button>
                        );
                      })}
                      <div className="border-t border-[#e9e9e9] p-3 bg-gray-50">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            placeholder="Custom tag..."
                            className="flex-1 text-xs h-8"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                          />
                          <Button
                            type="button"
                            onClick={addCustomTag}
                            size="sm"
                            className="h-8 px-3 text-xs bg-[#9747FF] hover:bg-[#9747FF]/90"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-[#2a2a2f]">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Enter event title"
                  className="text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-[#2a2a2f]">
                  Description <span className="text-red-500">*</span>
                </Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9747FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Enter event description"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-[#2a2a2f]">Status</Label>
                <Select
                  value={formData.status || 'completed'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Treatment Categories Section */}
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#2a2a2f]">
                Treatment Categories <span className="text-[11px] font-normal text-[#626266]">(Optional)</span>
              </Label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-[4px] text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:ring-offset-2"
                >
                  <span className="flex items-center gap-2 flex-wrap">
                    {formData.treatmentCategories && formData.treatmentCategories.length > 0 ? (
                      <span className="text-sm text-[#2a2a2f]">
                        {formData.treatmentCategories.length} {formData.treatmentCategories.length === 1 ? 'category' : 'categories'} selected
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Select treatment categories...</span>
                    )}
                  </span>
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#e9e9e9] rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
                    {allTreatmentCategoryOptions.map((category: TreatmentCategory) => {
                      const isSelected = formData.treatmentCategories?.includes(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleTreatmentCategory(category)}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                            isSelected ? 'bg-[#9747FF]/10' : ''
                          }`}
                        >
                          <span className={`w-4 h-4 border rounded-[4px] flex items-center justify-center ${
                            isSelected 
                              ? 'bg-[#9747FF] border-[#9747FF]' 
                              : 'border-[#e9e9e9]'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span>{category}</span>
                        </button>
                      );
                    })}
                    <div className="border-t border-[#e9e9e9] p-3 bg-gray-50">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="Custom category..."
                          className="flex-1 text-xs h-8"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomCategory();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addCustomCategory}
                          size="sm"
                          disabled={!customCategoryInput.trim()}
                          className="h-8 px-3 text-xs bg-[#9747FF] hover:bg-[#9747FF]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Selected Categories Display */}
              {formData.treatmentCategories && formData.treatmentCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.treatmentCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[4px] bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => toggleTreatmentCategory(category)}
                        className="hover:text-[#9747FF]/80 focus:outline-none"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Information Section */}
            {(formData.tag === EventTag.PAYMENT_RECEIVED || formData.paymentInfo) && (
              <div className="space-y-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-200/50">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/50">
                  <span className="text-lg">💰</span>
                  <span className="text-[14px] font-semibold text-emerald-900">Payment Information</span>
                  <span className="text-[11px] text-emerald-700">(Optional)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-emerald-900">Amount (₹)</Label>
                    <Input
                      type="number"
                      value={formData.paymentInfo?.amount || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        paymentInfo: { ...prev.paymentInfo, amount: parseFloat(e.target.value) || 0, mode: prev.paymentInfo?.mode || PaymentMode.CASH }
                      }))}
                      placeholder="0.00"
                      className="text-sm border-emerald-200 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-emerald-900">Payment Mode</Label>
                    <Select
                      value={formData.paymentInfo?.mode || PaymentMode.CASH}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        paymentInfo: { ...prev.paymentInfo, mode: value, amount: prev.paymentInfo?.amount || 0 }
                      }))}
                    >
                      <SelectTrigger className="text-sm border-emerald-200 focus:ring-emerald-500 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentMode).map(mode => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[12px] font-medium text-emerald-900">Invoice ID</Label>
                    <Input
                      type="text"
                      value={formData.paymentInfo?.invoiceId || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        paymentInfo: { 
                          ...prev.paymentInfo, 
                          invoiceId: e.target.value,
                          amount: prev.paymentInfo?.amount || 0,
                          mode: prev.paymentInfo?.mode || PaymentMode.CASH
                        }
                      }))}
                      placeholder="INV-2024-001"
                      className="text-sm border-emerald-200 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e9]">
                <span className="text-[14px] font-semibold text-[#2a2a2f]">Additional Notes</span>
                <span className="text-[11px] text-[#626266]">(Optional)</span>
              </div>
              <div className="space-y-2">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9747FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Add any additional notes or comments about this event..."
                />
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e9e9e9]">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-white text-sm rounded"
              >
                {event ? 'Update Event' : 'Add Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function for tag config
function tagConfigForEvent(tag: string) {
  return tagConfig[tag] || { label: tag, icon: '📌', color: 'text-gray-700', bgColor: 'bg-gray-50' };
}
