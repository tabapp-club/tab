"use client";

import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  MessageCircle, 
  Calendar, 
  Target,
  Gift,
  Bell,
  Clock,
  Mail,
  Smartphone,
  Settings as SettingsIcon,
  Info
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AutomationSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AutomationSettingsPanel({ isOpen, onClose }: AutomationSettingsPanelProps) {
  // Birthday Reminder Settings
  const [birthdayEnabled, setBirthdayEnabled] = useState(true);
  const [birthdayOnSameDay, setBirthdayOnSameDay] = useState(true);
  const [birthdayReminder30Days, setBirthdayReminder30Days] = useState(true);
  const [birthdayReminder15Days, setBirthdayReminder15Days] = useState(true);
  const [birthdayReminder7Days, setBirthdayReminder7Days] = useState(true);
  const [birthdayMessageChannel, setBirthdayMessageChannel] = useState('whatsapp');

  // Followups Settings
  const [followupsEnabled, setFollowupsEnabled] = useState(true);
  const [followupAfter1Day, setFollowupAfter1Day] = useState(true);
  const [followupAfter3Days, setFollowupAfter3Days] = useState(true);
  const [followupAfter7Days, setFollowupAfter7Days] = useState(true);
  const [followupAfter14Days, setFollowupAfter14Days] = useState(false);
  const [followupAfter30Days, setFollowupAfter30Days] = useState(false);
  const [followupMessageChannel, setFollowupMessageChannel] = useState('email');
  const [followupCondition, setFollowupCondition] = useState('no-response');

  // Event Based Campaigns Settings
  const [eventCampaignsEnabled, setEventCampaignsEnabled] = useState(true);
  const [eventBefore7Days, setEventBefore7Days] = useState(true);
  const [eventBefore3Days, setEventBefore3Days] = useState(true);
  const [eventBefore1Day, setEventBefore1Day] = useState(true);
  const [eventOnDay, setEventOnDay] = useState(true);
  const [eventAfter1Day, setEventAfter1Day] = useState(false);
  const [eventMessageChannel, setEventMessageChannel] = useState('whatsapp');
  const [eventTypes, setEventTypes] = useState<string[]>(['appointment', 'meeting', 'webinar']);

  // Targeted Campaigns Settings
  const [targetedCampaignsEnabled, setTargetedCampaignsEnabled] = useState(true);
  const [targetingCriteria, setTargetingCriteria] = useState<string[]>(['inactive', 'high-value']);
  const [targetedCampaignFrequency, setTargetedCampaignFrequency] = useState('weekly');
  const [targetedCampaignChannel, setTargetedCampaignChannel] = useState('email');
  const [targetedCampaignTime, setTargetedCampaignTime] = useState('10:00');

  const [expandedSection, setExpandedSection] = useState<string | null>('birthday');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleEventType = (type: string) => {
    setEventTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTargetingCriteria = (criteria: string) => {
    setTargetingCriteria(prev =>
      prev.includes(criteria) ? prev.filter(c => c !== criteria) : [...prev, criteria]
    );
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    checked, 
    onChange,
    id,
    label
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    id?: string;
    label?: string;
  }) => (
    <button
      type="button"
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:ring-offset-2 ${
        checked
          ? 'bg-[#9747ff]'
          : 'bg-gray-300'
      }`}
      aria-label={label}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Toggle Field Component
  const ToggleField = ({ 
    label, 
    checked, 
    onChange, 
    description 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <div className="flex items-start justify-between gap-4 py-3 px-1 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 min-w-0">
        <label 
          htmlFor={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-[#2a2a2f] font-manrope cursor-pointer block"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 font-manrope mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        id={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
        label={label}
      />
    </div>
  );

  // Select Field Component
  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options,
    icon,
    description
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
    description?: string;
  }) => (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <label className="text-sm font-medium text-[#2a2a2f] font-manrope">
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-gray-500 font-manrope mb-2">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm font-normal text-[#2a2a2f] font-manrope border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 5%22><path fill=%22%23666%22 d=%22M2 0L0 2h4zm0 5L0 3h4z%22/></svg>')] bg-[length:12px] bg-no-repeat bg-[right_0.75rem_center] pr-10"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  // Time Field Component
  const TimeField = ({ 
    label, 
    value, 
    onChange,
    icon,
    description
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    description?: string;
  }) => (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <label className="text-sm font-medium text-[#2a2a2f] font-manrope">
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-gray-500 font-manrope mb-2">{description}</p>
      )}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm font-normal text-[#2a2a2f] font-manrope border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20 transition-all outline-none"
      />
    </div>
  );

  // Section Header Component
  const SectionHeader = ({
    icon,
    title,
    description,
    enabled,
    onToggle,
    expanded,
    onToggleExpand
  }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    enabled: boolean;
    onToggle: () => void;
    expanded: boolean;
    onToggleExpand: () => void;
  }) => (
    <div className="bg-gradient-to-r from-[#9747ff]/5 to-transparent border-b border-gray-100">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-3 flex-1 text-left group"
        >
          <div className={`p-2 rounded-lg transition-colors ${
            enabled ? 'bg-[#9747ff]/10 text-[#9747ff]' : 'bg-gray-100 text-gray-400'
          }`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[#202021] font-manrope group-hover:text-[#9747ff] transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 font-manrope mt-0.5">{description}</p>
            )}
          </div>
          {expanded ? (
            <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
          )}
        </button>
        <div className="ml-4" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            checked={enabled}
            onChange={onToggle}
            label={`Toggle ${title}`}
          />
        </div>
      </div>
    </div>
  );

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving automation settings');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-[600px] sm:max-w-xl md:w-[720px] md:max-w-3xl p-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-white [&>button]:hidden"
      >
        {/* Header */}
        <SheetHeader className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#9747ff]/10 rounded-xl">
                <Zap size={22} className="text-[#9747ff]" strokeWidth={2.5} />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-[#202021] font-manrope">
                  Automation Settings
                </SheetTitle>
                <p className="text-xs text-gray-500 font-manrope mt-0.5">
                  Configure automated customer communications
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-[#2a2a2f]" />
            </button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Birthday Reminders Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionHeader
              icon={<Gift size={18} />}
              title="Birthday Reminders"
              description="Automatically send birthday wishes to customers"
              enabled={birthdayEnabled}
              onToggle={() => setBirthdayEnabled(!birthdayEnabled)}
              expanded={expandedSection === 'birthday'}
              onToggleExpand={() => toggleSection('birthday')}
            />

            {expandedSection === 'birthday' && (
              <div className="px-5 py-4 space-y-4">
                {birthdayEnabled ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#2a2a2f] font-manrope flex items-center gap-2">
                        <Bell size={14} className="text-gray-400" />
                        Reminder Schedule
                      </h4>
                      <p className="text-xs text-gray-500 font-manrope mb-3">
                        Choose when to send birthday reminders
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-1">
                      <ToggleField
                        label="Send on birthday (same day)"
                        checked={birthdayOnSameDay}
                        onChange={setBirthdayOnSameDay}
                        description="Send birthday wishes on the actual birthday"
                      />
                      <ToggleField
                        label="30 days before"
                        checked={birthdayReminder30Days}
                        onChange={setBirthdayReminder30Days}
                        description="Send reminder notification 30 days before birthday"
                      />
                      <ToggleField
                        label="15 days before"
                        checked={birthdayReminder15Days}
                        onChange={setBirthdayReminder15Days}
                        description="Send reminder notification 15 days before birthday"
                      />
                      <ToggleField
                        label="7 days before"
                        checked={birthdayReminder7Days}
                        onChange={setBirthdayReminder7Days}
                        description="Send reminder notification 7 days before birthday"
                      />
                    </div>

                    <SelectField
                      label="Message Channel"
                      value={birthdayMessageChannel}
                      onChange={setBirthdayMessageChannel}
                      icon={<Smartphone size={14} />}
                      description="Select the primary channel for birthday messages"
                      options={[
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'sms', label: 'SMS' },
                        { value: 'email', label: 'Email' },
                        { value: 'all', label: 'All Channels' }
                      ]}
                    />
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Info size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-manrope">
                      Enable birthday reminders to configure settings
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Followups Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionHeader
              icon={<MessageCircle size={18} />}
              title="Follow-ups"
              description="Automated follow-up messages to engage customers"
              enabled={followupsEnabled}
              onToggle={() => setFollowupsEnabled(!followupsEnabled)}
              expanded={expandedSection === 'followups'}
              onToggleExpand={() => toggleSection('followups')}
            />

            {expandedSection === 'followups' && (
              <div className="px-5 py-4 space-y-4">
                {followupsEnabled ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#2a2a2f] font-manrope flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        Follow-up Schedule
                      </h4>
                      <p className="text-xs text-gray-500 font-manrope mb-3">
                        Set when to send follow-up messages after initial contact
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-1">
                      <ToggleField
                        label="After 1 day"
                        checked={followupAfter1Day}
                        onChange={setFollowupAfter1Day}
                        description="Send follow-up message 1 day after initial contact"
                      />
                      <ToggleField
                        label="After 3 days"
                        checked={followupAfter3Days}
                        onChange={setFollowupAfter3Days}
                        description="Send follow-up message 3 days after initial contact"
                      />
                      <ToggleField
                        label="After 7 days"
                        checked={followupAfter7Days}
                        onChange={setFollowupAfter7Days}
                        description="Send follow-up message 7 days after initial contact"
                      />
                      <ToggleField
                        label="After 14 days"
                        checked={followupAfter14Days}
                        onChange={setFollowupAfter14Days}
                        description="Send follow-up message 14 days after initial contact"
                      />
                      <ToggleField
                        label="After 30 days"
                        checked={followupAfter30Days}
                        onChange={setFollowupAfter30Days}
                        description="Send follow-up message 30 days after initial contact"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <SelectField
                        label="Message Channel"
                        value={followupMessageChannel}
                        onChange={setFollowupMessageChannel}
                        icon={<Mail size={14} />}
                        options={[
                          { value: 'email', label: 'Email' },
                          { value: 'whatsapp', label: 'WhatsApp' },
                          { value: 'sms', label: 'SMS' },
                          { value: 'all', label: 'All Channels' }
                        ]}
                      />

                      <SelectField
                        label="Trigger Condition"
                        value={followupCondition}
                        onChange={setFollowupCondition}
                        icon={<SettingsIcon size={14} />}
                        options={[
                          { value: 'no-response', label: 'No Response Received' },
                          { value: 'after-meeting', label: 'After Meeting/Appointment' },
                          { value: 'after-inquiry', label: 'After Inquiry' },
                          { value: 'after-purchase', label: 'After Purchase' },
                          { value: 'always', label: 'Always Send' }
                        ]}
                      />
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Info size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-manrope">
                      Enable follow-ups to configure settings
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Based Campaigns Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionHeader
              icon={<Calendar size={18} />}
              title="Event-Based Campaigns"
              description="Automated messages based on calendar events"
              enabled={eventCampaignsEnabled}
              onToggle={() => setEventCampaignsEnabled(!eventCampaignsEnabled)}
              expanded={expandedSection === 'event-campaigns'}
              onToggleExpand={() => toggleSection('event-campaigns')}
            />

            {expandedSection === 'event-campaigns' && (
              <div className="px-5 py-4 space-y-4">
                {eventCampaignsEnabled ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#2a2a2f] font-manrope flex items-center gap-2">
                        <Bell size={14} className="text-gray-400" />
                        Campaign Schedule
                      </h4>
                      <p className="text-xs text-gray-500 font-manrope mb-3">
                        When to send messages relative to event dates
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-1">
                      <ToggleField
                        label="7 days before event"
                        checked={eventBefore7Days}
                        onChange={setEventBefore7Days}
                        description="Send reminder 7 days before the event"
                      />
                      <ToggleField
                        label="3 days before event"
                        checked={eventBefore3Days}
                        onChange={setEventBefore3Days}
                        description="Send reminder 3 days before the event"
                      />
                      <ToggleField
                        label="1 day before event"
                        checked={eventBefore1Day}
                        onChange={setEventBefore1Day}
                        description="Send reminder 1 day before the event"
                      />
                      <ToggleField
                        label="On event day"
                        checked={eventOnDay}
                        onChange={setEventOnDay}
                        description="Send confirmation message on the event day"
                      />
                      <ToggleField
                        label="1 day after event"
                        checked={eventAfter1Day}
                        onChange={setEventAfter1Day}
                        description="Send follow-up message 1 day after the event"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#2a2a2f] font-manrope flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        Event Types
                      </h4>
                      <p className="text-xs text-gray-500 font-manrope mb-3">
                        Select which event types to include in campaigns
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-1">
                      <ToggleField
                        label="Appointments"
                        checked={eventTypes.includes('appointment')}
                        onChange={() => toggleEventType('appointment')}
                        description="Include appointment events"
                      />
                      <ToggleField
                        label="Meetings"
                        checked={eventTypes.includes('meeting')}
                        onChange={() => toggleEventType('meeting')}
                        description="Include meeting events"
                      />
                      <ToggleField
                        label="Webinars"
                        checked={eventTypes.includes('webinar')}
                        onChange={() => toggleEventType('webinar')}
                        description="Include webinar events"
                      />
                      <ToggleField
                        label="Workshops"
                        checked={eventTypes.includes('workshop')}
                        onChange={() => toggleEventType('workshop')}
                        description="Include workshop events"
                      />
                    </div>

                    <SelectField
                      label="Message Channel"
                      value={eventMessageChannel}
                      onChange={setEventMessageChannel}
                      icon={<Smartphone size={14} />}
                      options={[
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'sms', label: 'SMS' },
                        { value: 'email', label: 'Email' },
                        { value: 'all', label: 'All Channels' }
                      ]}
                    />
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Info size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-manrope">
                      Enable event-based campaigns to configure settings
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Targeted Campaigns Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionHeader
              icon={<Target size={18} />}
              title="Targeted Campaigns"
              description="Personalized campaigns for specific customer segments"
              enabled={targetedCampaignsEnabled}
              onToggle={() => setTargetedCampaignsEnabled(!targetedCampaignsEnabled)}
              expanded={expandedSection === 'targeted-campaigns'}
              onToggleExpand={() => toggleSection('targeted-campaigns')}
            />

            {expandedSection === 'targeted-campaigns' && (
              <div className="px-5 py-4 space-y-4">
                {targetedCampaignsEnabled ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#2a2a2f] font-manrope flex items-center gap-2">
                        <Target size={14} className="text-gray-400" />
                        Targeting Criteria
                      </h4>
                      <p className="text-xs text-gray-500 font-manrope mb-3">
                        Select customer segments to target
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-1">
                      <ToggleField
                        label="Inactive Customers"
                        checked={targetingCriteria.includes('inactive')}
                        onChange={() => toggleTargetingCriteria('inactive')}
                        description="Target customers who haven't engaged recently"
                      />
                      <ToggleField
                        label="High-Value Customers"
                        checked={targetingCriteria.includes('high-value')}
                        onChange={() => toggleTargetingCriteria('high-value')}
                        description="Target customers with high purchase value"
                      />
                      <ToggleField
                        label="At-Risk Customers"
                        checked={targetingCriteria.includes('at-risk')}
                        onChange={() => toggleTargetingCriteria('at-risk')}
                        description="Target customers showing signs of churn"
                      />
                      <ToggleField
                        label="New Customers"
                        checked={targetingCriteria.includes('new')}
                        onChange={() => toggleTargetingCriteria('new')}
                        description="Target newly acquired customers"
                      />
                      <ToggleField
                        label="VIP Customers"
                        checked={targetingCriteria.includes('vip')}
                        onChange={() => toggleTargetingCriteria('vip')}
                        description="Target VIP/loyalty program members"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <SelectField
                        label="Campaign Frequency"
                        value={targetedCampaignFrequency}
                        onChange={setTargetedCampaignFrequency}
                        icon={<Clock size={14} />}
                        options={[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'bi-weekly', label: 'Bi-Weekly' },
                          { value: 'monthly', label: 'Monthly' }
                        ]}
                      />

                      <SelectField
                        label="Message Channel"
                        value={targetedCampaignChannel}
                        onChange={setTargetedCampaignChannel}
                        icon={<Mail size={14} />}
                        options={[
                          { value: 'email', label: 'Email' },
                          { value: 'whatsapp', label: 'WhatsApp' },
                          { value: 'sms', label: 'SMS' },
                          { value: 'all', label: 'All Channels' }
                        ]}
                      />
                    </div>

                    <TimeField
                      label="Preferred Send Time"
                      value={targetedCampaignTime}
                      onChange={setTargetedCampaignTime}
                      icon={<Clock size={14} />}
                      description="Schedule campaigns for optimal engagement"
                    />
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Info size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-manrope">
                      Enable targeted campaigns to configure settings
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-lg px-6 py-4 mt-auto">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-[#2a2a2f] font-manrope border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#9747ff] text-white rounded-lg hover:bg-[#8636ee] transition-all font-semibold text-sm font-manrope shadow-sm hover:shadow-md"
            >
              Save Settings
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
