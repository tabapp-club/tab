import { EventTag } from '@/components/PatientTimeline';

const EVENT_TYPES_STORAGE_KEY = 'custom_event_types';

/**
 * Get all event types (default + custom)
 */
export function getAllEventTypes(): string[] {
  const defaultEventTags = Object.values(EventTag);
  
  if (typeof window === 'undefined') {
    return defaultEventTags;
  }

  try {
    const stored = localStorage.getItem(EVENT_TYPES_STORAGE_KEY);
    const customEventTypes = stored ? JSON.parse(stored) : [];
    
    // Combine default and custom, removing duplicates
    const allTypes = [...defaultEventTags, ...customEventTypes];
    return Array.from(new Set(allTypes));
  } catch (error) {
    console.error('Error loading custom event types:', error);
    return defaultEventTags;
  }
}

/**
 * Add a custom event type
 */
export function addCustomEventType(eventType: string): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(EVENT_TYPES_STORAGE_KEY);
    const customEventTypes: string[] = stored ? JSON.parse(stored) : [];
    
    // Don't add if it already exists or is a default EventTag
    if (!customEventTypes.includes(eventType) && !Object.values(EventTag).includes(eventType as EventTag)) {
      customEventTypes.push(eventType);
      localStorage.setItem(EVENT_TYPES_STORAGE_KEY, JSON.stringify(customEventTypes));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('eventTypesUpdated'));
    }
  } catch (error) {
    console.error('Error saving custom event type:', error);
  }
}

/**
 * Get event type label (from tagConfig or return the type itself)
 */
export function getEventTypeLabel(eventType: string): string {
  // Import tagConfig from PatientTimeline
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

  return tagConfig[eventType]?.label || eventType;
}

