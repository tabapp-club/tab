"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { CampaignStepper } from "@/components/campaign/CampaignStepper";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignHeader } from "@/components/campaign/CampaignHeader";
import { DashboardDatePicker } from "@/components/ui/DashboardDatePicker";
import { DashboardTimePicker } from "@/components/ui/DashboardTimePicker";






const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="#04b440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);




export function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed, isMobile } = useSidebar();
  const { showSuccess, showError, showWarning } = usePopup();
  const campaignType = searchParams.get('type') || 'advertise';
  const selectedMedium = searchParams.get('medium') || '';
  const selectedPlatforms = searchParams.get('platforms') || '';

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // State for scheduling options
  const [startOption, setStartOption] = useState<'immediate' | 'specific'>('immediate');
  const [endOption, setEndOption] = useState<'automatic' | 'specific'>('automatic');
  const [repeatOption, setRepeatOption] = useState<'repeatedly' | 'once' | 'limited'>('repeatedly');
  const [repeatCount, setRepeatCount] = useState(5);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState('');

  // Check if tab is selected - first try platforms parameter, then fallback to medium
  const platforms = selectedPlatforms ? selectedPlatforms.split(',') : [];
  const mediums = selectedMedium ? selectedMedium.split(',') : [];
  const isTabSelected = platforms.includes('tab') || mediums.includes('tab');

  // Loading state for publish button
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Load data from session storage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('scheduleData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setStartOption(data.startOption || 'immediate');
        setEndOption(data.endOption || 'automatic');
        setRepeatOption(data.repeatOption || 'repeatedly');
        setRepeatCount(data.repeatCount || 5);
        setStartDate(data.startDate ? new Date(data.startDate) : undefined);
        setStartTime(data.startTime || '');
        setEndDate(data.endDate ? new Date(data.endDate) : undefined);
        setEndTime(data.endTime || '');
      } catch (error) {
        console.error('Error loading schedule data from session storage:', error);
      }
    }
  }, []);

  // Save data to session storage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      startOption,
      endOption,
      repeatOption,
      repeatCount,
      startDate: startDate?.toISOString(),
      startTime,
      endDate: endDate?.toISOString(),
      endTime
    };
    sessionStorage.setItem('scheduleData', JSON.stringify(dataToSave));
  }, [startOption, endOption, repeatOption, repeatCount, startDate, startTime, endDate, endTime]);

  const handlePublishCampaign = async () => {
    // Validate required fields
    if (startOption === 'specific' && (!startDate || !startTime)) {
      showError(
        'Missing Start Date/Time',
        'Please select a start date and time for your campaign.'
      );
      return;
    }

    if (endOption === 'specific' && (!endDate || !endTime)) {
      showError(
        'Missing End Date/Time',
        'Please select an end date and time for your campaign.'
      );
      return;
    }

    // Start loading animation
    setIsPublishing(true);

    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success state
    setIsPublishing(false);
    setIsPublished(true);

    showSuccess(
      'Campaign Published Successfully!',
      'Your campaign has been scheduled and will be launched according to your settings.'
    );

    // Navigate after success animation
    setTimeout(() => {
      router.push('/campaigns', { scroll: false });
    }, 2000);
  };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      <CampaignHeader onBack={() => router.push('/campaigns')} />

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6]">


        <CampaignStepper currentStep={5} />

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
              Schedule Your Campaign
            </h1>
            <p className="text-[#a1a1a1] text-[14px]">
              Set the timing and frequency for your campaign launch
            </p>
          </div>

          {/* Campaign Timeline Section */}
          <div className="space-y-6">
            {/* Date Configuration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Start Date Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200" style={{ borderWidth: '1px' }}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">Start Date & Time</h3>
                    <p className="text-[14px] text-gray-600">Choose when your campaign should begin</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Immediate Start Option */}
                  <label className="flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    startOption === 'immediate' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="start-option"
                      value="immediate"
                      checked={startOption === 'immediate'}
                      onChange={() => setStartOption('immediate')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Start Immediately</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-600">Campaign will start as soon as it&apos;s published</p>
                    </div>
                  </label>

                  {/* Specific Start Option */}
                  <label className="flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    startOption === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="start-option"
                      value="specific"
                      checked={startOption === 'specific'}
                      onChange={() => setStartOption('specific')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Schedule for Later</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Custom</span>
                      </div>
                      <p className="text-sm text-gray-600">Set a specific date and time to start</p>
                    </div>
                  </label>

                  {/* Date/Time Inputs */}
                  {startOption === 'specific' && (
                    <div className="ml-7 p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <DashboardDatePicker
                            selected={startDate}
                            onSelect={setStartDate}
                            placeholder="Select start date"
                            minDate={new Date()}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <DashboardTimePicker
                            selected={startTime}
                            onSelect={setStartTime}
                            placeholder="Select start time"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* End Date Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200" style={{ borderWidth: '1px' }}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">End Date & Time</h3>
                    <p className="text-[14px] text-gray-600">Choose when your campaign should end</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Automatic End Option */}
                  <label className="flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    endOption === 'automatic' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="end-option"
                      value="automatic"
                      checked={endOption === 'automatic'}
                      onChange={() => setEndOption('automatic')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">End Automatically</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-600">Campaign will end when budget is exhausted or target reached</p>
                    </div>
                  </label>

                  {/* Specific End Option */}
                  <label className="flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    endOption === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="end-option"
                      value="specific"
                      checked={endOption === 'specific'}
                      onChange={() => setEndOption('specific')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Set End Date</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Custom</span>
                      </div>
                      <p className="text-sm text-gray-600">Set a specific date and time to end</p>
                    </div>
                  </label>

                  {/* Date/Time Inputs */}
                  {endOption === 'specific' && (
                    <div className="ml-7 p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <DashboardDatePicker
                            selected={endDate}
                            onSelect={setEndDate}
                            placeholder="Select end date"
                            minDate={startDate || new Date()}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <DashboardTimePicker
                            selected={endTime}
                            onSelect={setEndTime}
                            placeholder="Select end time"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Repeat Campaign Section - Only for Tab campaigns */}
          {isTabSelected && (
            <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200" style={{ borderWidth: '1px' }}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">Campaign Frequency</h3>
                    <p className="text-[14px] text-gray-600">Control how often users see this campaign</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Allow Repeatedly */}
                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    repeatOption === 'repeatedly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="repeat-option"
                      value="repeatedly"
                      checked={repeatOption === 'repeatedly'}
                      onChange={() => setRepeatOption('repeatedly')}
                      className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Allow Repeated Views</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Flexible</span>
                      </div>
                      <p className="text-sm text-gray-600">Users can see this campaign multiple times</p>
                    </div>
                  </label>

                  {/* Show Once */}
                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    repeatOption === 'once' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="repeat-option"
                      value="once"
                      checked={repeatOption === 'once'}
                      onChange={() => setRepeatOption('once')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Show Once Only</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-600">Each user sees this campaign only once</p>
                    </div>
                  </label>

                  {/* Limited Views */}
                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    repeatOption === 'limited' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }">
                    <input
                      type="radio"
                      name="repeat-option"
                      value="limited"
                      checked={repeatOption === 'limited'}
                      onChange={() => setRepeatOption('limited')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Limited Views</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Custom</span>
                      </div>
                      <p className="text-sm text-gray-600">Set maximum number of times a user can see this campaign</p>
                    </div>
                  </label>

                  {/* Limited Views Input */}
                  {repeatOption === 'limited' && (
                    <div className="ml-7 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">Show campaign up to</span>
                        <div className="relative">
                          <select
                            value={repeatCount}
                            onChange={(e) => setRepeatCount(parseInt(e.target.value))}
                            className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">times per user</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <CampaignFooter
          onClose={() => router.push('/campaigns', { scroll: false })}
          onNext={handlePublishCampaign}
          onPrevious={() => {
            // Preserve query parameters when going back
            const searchParams = new URLSearchParams(window.location.search);
            const campaignType = searchParams.get('type') || 'advertise';
            router.push(`/new-campaign/create?type=${campaignType}`, { scroll: false });
          }}
          nextLabel={isPublishing ? "Publishing..." : isPublished ? "Published!" : "Publish"}
          nextDisabled={isPublishing || isPublished}
          showPrevious={true}
        />
      </div>
    </main>
  );
}
