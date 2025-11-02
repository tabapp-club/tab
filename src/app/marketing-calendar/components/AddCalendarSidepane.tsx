"use client";

import React, { useState } from 'react';
import { X, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AddCalendarSidepaneProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCalendar?: (url: string, name: string) => void;
}

export default function AddCalendarSidepane({ 
  isOpen, 
  onClose,
  onAddCalendar 
}: AddCalendarSidepaneProps) {
  const [calendarUrl, setCalendarUrl] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Check if it's a valid calendar URL (supports common calendar formats)
      const validProtocols = ['http:', 'https:', 'webcal:'];
      return validProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate URL
    if (!calendarUrl.trim()) {
      setError('Please enter a calendar URL');
      return;
    }

    if (!validateUrl(calendarUrl)) {
      setError('Please enter a valid URL (must start with http://, https://, or webcal://)');
      return;
    }

    // Validate name
    if (!calendarName.trim()) {
      setError('Please enter a calendar name');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to add calendar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback if provided
      if (onAddCalendar) {
        onAddCalendar(calendarUrl, calendarName);
      }

      setSuccess(true);
      
      // Reset form and close after a delay
      setTimeout(() => {
        setCalendarUrl('');
        setCalendarName('');
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to add calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCalendarUrl('');
    setCalendarName('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-[600px] sm:max-w-xl md:w-[700px] md:max-w-2xl p-0 overflow-y-auto bg-[#f6f6f6] [&>button]:hidden"
      >
        <SheetHeader className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-[#202021] font-manrope flex items-center gap-2">
              <Link2 size={24} className="text-[#9747ff]" />
              Add Calendar by URL
            </SheetTitle>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-[#2a2a2f]" />
            </button>
          </div>
        </SheetHeader>

        <div className="px-6 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#2a2a2f] font-manrope mb-2">
                How to add a calendar by URL
              </h3>
              <ul className="text-xs text-gray-600 font-manrope space-y-1 list-disc list-inside">
                <li>Get the calendar URL from your calendar service (Google Calendar, Outlook, etc.)</li>
                <li>For Google Calendar: Go to Settings → Calendar Settings → Copy the public iCal URL</li>
                <li>For Outlook: Go to Calendar → Share → Copy the calendar link</li>
                <li>Paste the URL below and give your calendar a name</li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Calendar Name */}
              <div>
                <label 
                  htmlFor="calendar-name"
                  className="text-sm font-medium text-[#2a2a2f] font-manrope block mb-2"
                >
                  Calendar Name
                </label>
                <input
                  id="calendar-name"
                  type="text"
                  value={calendarName}
                  onChange={(e) => {
                    setCalendarName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Team Calendar, Personal Calendar"
                  className="w-full px-4 py-3 text-sm font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded-lg hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Calendar URL */}
              <div>
                <label 
                  htmlFor="calendar-url"
                  className="text-sm font-medium text-[#2a2a2f] font-manrope block mb-2"
                >
                  Calendar URL
                </label>
                <input
                  id="calendar-url"
                  type="url"
                  value={calendarUrl}
                  onChange={(e) => {
                    setCalendarUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://calendar.google.com/calendar/ical/..."
                  className="w-full px-4 py-3 text-sm font-normal text-[#2a2a2f] font-manrope border border-gray-300 rounded-lg hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747ff] focus:border-transparent font-mono"
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 font-manrope">
                  Supported formats: HTTP, HTTPS, and WebCal URLs
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-manrope">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-manrope">
                    Calendar added successfully!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white text-[#2a2a2f] border border-gray-300 rounded-[99px] hover:bg-gray-50 transition-all font-medium text-sm font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !calendarUrl.trim() || !calendarName.trim()}
                  className="flex-1 px-4 py-3 bg-[#9747ff] text-white rounded-[99px] hover:bg-[#8636ee] transition-all font-medium text-sm font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Adding...' : 'Add Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

