"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { MobileMenuToggle } from "@/components/MobileMenuToggle";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#7856ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const progressSteps = [
  { id: 1, title: 'Choose campaign type', completed: true },
  { id: 2, title: 'Create campaign', completed: true },
  { id: 3, title: 'Choose Audience', completed: true },
  { id: 4, title: 'Schedule Date & Time', completed: true }
];

// Animated Step Component
const AnimatedStep = ({ step, index, isLast }: { step: any; index: number; isLast: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Stagger animation for each step
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (step.completed) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 300 + index * 150);
      return () => clearTimeout(timer);
    }
  }, [step.completed, index]);

  // Simulate loading animation for current step
  useEffect(() => {
    if (!step.completed && index === 3) { // Current step (Schedule)
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step.completed, index]);

  return (
    <div className={`flex items-center flex-1 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
          {step.completed ? (
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7856ff]/10 flex items-center justify-center transition-all duration-500 ease-out ${
              isCompleted ? 'scale-110' : 'scale-100'
            }`}>
              <div className={`transition-all duration-300 ease-out ${
                isCompleted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}>
                <CheckIcon />
              </div>
            </div>
          ) : isLoading ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#7856ff] flex items-center justify-center transition-all duration-300">
              <div className="w-4 h-4 border-2 border-[#7856ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#e9e9e9] flex items-center justify-center transition-all duration-300">
              <span className="text-sm font-medium text-[#626266]">{step.id}</span>
            </div>
          )}
        </div>
        <span className={`text-sm sm:text-base font-semibold text-[#2a2a2f] tracking-tight transition-all duration-300 ${
          step.completed ? 'text-[#7856ff]' : isLoading ? 'text-[#7856ff]' : 'text-[#2a2a2f]'
        }`}>
          {step.title}
        </span>
      </div>
      {!isLast && (
        <div className="hidden sm:block flex-1 mx-6 relative">
          <div className="h-px bg-[#e9e9e9] w-full"></div>
          {step.completed && (
            <div className={`absolute top-0 left-0 h-full bg-[#7856ff] transition-all duration-1000 ease-out ${
              isCompleted ? 'w-full' : 'w-0'
            }`}></div>
          )}
          {isLoading && (
            <div className="absolute top-0 left-0 h-full bg-[#7856ff] animate-pulse">
              <div className="h-full bg-gradient-to-r from-[#7856ff] via-[#9b7cff] to-[#7856ff] animate-shimmer"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed, isMobile } = useSidebar();
  const { showSuccess, showError, showWarning } = usePopup();
  const campaignType = searchParams.get('type') || 'advertise';
  const selectedMedium = searchParams.get('medium') || '';

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // State for scheduling options
  const [startOption, setStartOption] = useState<'immediate' | 'specific'>('immediate');
  const [endOption, setEndOption] = useState<'automatic' | 'specific'>('automatic');
  const [repeatOption, setRepeatOption] = useState<'repeatedly' | 'once' | 'limited'>('repeatedly');
  const [repeatCount, setRepeatCount] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Check if tab is selected in audience page - parse the comma-separated mediums
  const selectedMediums = selectedMedium ? selectedMedium.split(',') : [];
  const isTabSelected = selectedMediums.includes('tab');

  // Loading state for publish button
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

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
      router.push('/campaigns');
    }, 2000);
  };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">
                Schedule Campaign
              </h1>
              <p className="text-sm sm:text-base text-[#626266] mt-2 sm:mt-3">
                Set when your campaign will start and end
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handlePublishCampaign}
                disabled={isPublishing || isPublished}
                className={`px-6 py-3 text-white rounded-lg font-medium transition-all duration-500 shadow-lg ${
                  isPublishing
                    ? 'bg-[#7856ff] opacity-75 cursor-not-allowed scale-95'
                    : isPublished
                    ? 'bg-green-500 cursor-not-allowed scale-105'
                    : 'bg-[#7856ff] hover:bg-[#6a4fd8] hover:scale-105 active:scale-95'
                }`}
              >
                {isPublishing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </div>
                ) : isPublished ? (
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Published!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                      <path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Publish Campaign</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>
        {/* Progress Indicator */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#fff] border border-[#fff] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            {/* <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaign Progress
            </h2> */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              {progressSteps.map((step, index) => (
                <AnimatedStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === progressSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
        <div className="max-w-6xl mx-auto space-y-6">
                      {/* Start and End Date Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Start Date and Time */}
              <div className="rounded-lg bg-white border border-[#e9e9e9] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
                <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
                  Start Date and Time
                </h3>
                <p className="text-sm sm:text-base text-[#626266] mb-4 sm:mb-6">
                  Specify when the campaign starts
                </p>

                <div className="space-y-4">
                  {/* Immediate Option */}
                  <div className="flex items-center gap-3">
                                         <input
                       type="radio"
                       id="start-immediate"
                       name="start-option"
                       checked={startOption === 'immediate'}
                       onChange={() => setStartOption('immediate')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                    <label htmlFor="start-immediate" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                      As soon as campaign published
                    </label>
                  </div>

                  {/* Specific Date/Time Option */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                                           <input
                       type="radio"
                       id="start-specific"
                       name="start-option"
                       checked={startOption === 'specific'}
                       onChange={() => setStartOption('specific')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                      <label htmlFor="start-specific" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                        At specific date and time
                      </label>
                    </div>

                                         {startOption === 'specific' && (
                       <div className="pl-7">
                         <div className="bg-white border border-[#e9e9e9] rounded-lg p-4 space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="flex flex-col gap-2">
                               <label className="text-sm font-medium text-[#626266] flex items-center gap-2">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                   <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M6 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M10 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                 </svg>
                                 Start Date
                               </label>
                               <div className="relative">
                                 <input
                                   type="date"
                                   value={startDate}
                                   onChange={(e) => setStartDate(e.target.value)}
                                   className="w-full px-4 py-3 pl-10 border border-[#e9e9e9] rounded-lg text-sm focus:outline-none focus:border-[#7856ff] focus:ring-1 focus:ring-[#7856ff] bg-white hover:border-[#7856ff]/50 transition-colors"
                                   min={new Date().toISOString().split('T')[0]}
                                 />
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                     <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M6 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M10 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                   </svg>
                                 </div>
                               </div>
                             </div>
                             <div className="flex flex-col gap-2">
                               <label className="text-sm font-medium text-[#626266] flex items-center gap-2">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                   <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                 </svg>
                                 Start Time
                               </label>
                               <div className="relative">
                                 <input
                                   type="time"
                                   value={startTime}
                                   onChange={(e) => setStartTime(e.target.value)}
                                   className="w-full px-4 py-3 pl-10 border border-[#e9e9e9] rounded-lg text-sm focus:outline-none focus:border-[#7856ff] focus:ring-1 focus:ring-[#7856ff] bg-white hover:border-[#7856ff]/50 transition-colors"
                                 />
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                     <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                   </svg>
                                 </div>
                               </div>
                             </div>
                           </div>
                           {startDate && startTime && (
                             <div className="mt-3 p-3 bg-[#7856ff]/5 border border-[#7856ff]/20 rounded-lg">
                               <p className="text-sm text-[#7856ff] font-medium">
                                 Campaign will start on {new Date(startDate).toLocaleDateString()} at {startTime}
                               </p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            </div>

                          {/* End Date and Time */}
              <div className="rounded-lg bg-white border border-[#e9e9e9] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
                <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
                  End Date and Time
                </h3>
                <p className="text-sm sm:text-base text-[#626266] mb-4 sm:mb-6">
                  Specify when the campaign ends
                </p>

                <div className="space-y-4">
                  {/* Automatic End Option */}
                  <div className="flex items-center gap-3">
                                         <input
                       type="radio"
                       id="end-automatic"
                       name="end-option"
                       checked={endOption === 'automatic'}
                       onChange={() => setEndOption('automatic')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                    <label htmlFor="end-automatic" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                      As soon as campaign ended
                    </label>
                  </div>

                  {/* Specific End Date/Time Option */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                                           <input
                       type="radio"
                       id="end-specific"
                       name="end-option"
                       checked={endOption === 'specific'}
                       onChange={() => setEndOption('specific')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                      <label htmlFor="end-specific" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                        At specific date and time
                      </label>
                    </div>

                                         {endOption === 'specific' && (
                       <div className="pl-7">
                         <div className="bg-white border border-[#e9e9e9] rounded-lg p-4 space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="flex flex-col gap-2">
                               <label className="text-sm font-medium text-[#626266] flex items-center gap-2">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                   <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M6 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M10 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                 </svg>
                                 End Date
                               </label>
                               <div className="relative">
                                 <input
                                   type="date"
                                   value={endDate}
                                   onChange={(e) => setEndDate(e.target.value)}
                                   className="w-full px-4 py-3 pl-10 border border-[#e9e9e9] rounded-lg text-sm focus:outline-none focus:border-[#7856ff] focus:ring-1 focus:ring-[#7856ff] bg-white hover:border-[#7856ff]/50 transition-colors"
                                   min={startDate || new Date().toISOString().split('T')[0]}
                                 />
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                     <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M6 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M10 2V4" stroke="currentColor" strokeWidth="1.5"/>
                                   </svg>
                                 </div>
                               </div>
                             </div>
                             <div className="flex flex-col gap-2">
                               <label className="text-sm font-medium text-[#626266] flex items-center gap-2">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                   <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                   <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                 </svg>
                                 End Time
                               </label>
                               <div className="relative">
                                 <input
                                   type="time"
                                   value={endTime}
                                   onChange={(e) => setEndTime(e.target.value)}
                                   className="w-full px-4 py-3 pl-10 border border-[#e9e9e9] rounded-lg text-sm focus:outline-none focus:border-[#7856ff] focus:ring-1 focus:ring-[#7856ff] bg-white hover:border-[#7856ff]/50 transition-colors"
                                 />
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#7856ff]">
                                     <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                     <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                   </svg>
                                 </div>
                               </div>
                             </div>
                           </div>
                           {endDate && endTime && (
                             <div className="mt-3 p-3 bg-[#7856ff]/5 border border-[#7856ff]/20 rounded-lg">
                               <p className="text-sm text-[#7856ff] font-medium">
                                 Campaign will end on {new Date(endDate).toLocaleDateString()} at {endTime}
                               </p>
                             </div>
                           )}
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
              <div className="rounded-lg bg-white border border-[#e9e9e9] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
                <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
                  Repeat Campaign
                </h3>
                <p className="text-sm sm:text-base text-[#626266] mb-4 sm:mb-6">
                  Choose how often a user will see this campaign
                </p>

                <div className="space-y-4">
                  {/* Repeatedly Option */}
                  <div className="flex items-center gap-3">
                                         <input
                       type="radio"
                       id="repeat-repeatedly"
                       name="repeat-option"
                       checked={repeatOption === 'repeatedly'}
                       onChange={() => setRepeatOption('repeatedly')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                    <label htmlFor="repeat-repeatedly" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                      Allow user to view campaign repeatedly
                    </label>
                  </div>

                  {/* Once Option */}
                  <div className="flex items-center gap-3">
                                         <input
                       type="radio"
                       id="repeat-once"
                       name="repeat-option"
                       checked={repeatOption === 'once'}
                       onChange={() => setRepeatOption('once')}
                       className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                     />
                    <label htmlFor="repeat-once" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                      Show campaign to user only once
                    </label>
                  </div>

                  {/* Limited Times Option */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                                             <input
                         type="radio"
                         id="repeat-limited"
                         name="repeat-option"
                         checked={repeatOption === 'limited'}
                         onChange={() => setRepeatOption('limited')}
                         className="w-4 h-4 text-[#7856ff] focus:ring-[#7856ff] accent-[#7856ff]"
                       />
                      <label htmlFor="repeat-limited" className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                        Allow user to view campaign up to
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={repeatCount}
                        onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
                        className="w-16 px-3 py-2 border border-[#e9e9e9] rounded-lg text-sm focus:outline-none focus:border-[#7856ff] focus:ring-1 focus:ring-[#7856ff]"
                        min="1"
                        max="10"
                      />
                      <span className="text-sm sm:text-base font-medium text-[#2a2a2f]">
                        times
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
