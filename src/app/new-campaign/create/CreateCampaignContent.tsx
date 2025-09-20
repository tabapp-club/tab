"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { CampaignStepper } from "@/components/campaign/CampaignStepper";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignHeader } from "@/components/campaign/CampaignHeader";





const CalendarIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.54991 3C8.54991 2.80109 8.47089 2.61032 8.33024 2.46967C8.18958 2.32902 7.99882 2.25 7.79991 2.25C7.60099 2.25 7.41023 2.32902 7.26958 2.46967C7.12892 2.61032 7.04991 2.80109 7.04991 3V4.58C5.60991 4.695 4.66591 4.977 3.97191 5.672C3.27691 6.366 2.99491 7.311 2.87891 8.75H22.7209C22.6049 7.31 22.3229 6.366 21.6279 5.672C20.9339 4.977 19.9889 4.695 18.5499 4.579V3C18.5499 2.80109 18.4709 2.61032 18.3302 2.46967C18.1896 2.32902 17.9988 2.25 17.7999 2.25C17.601 2.25 17.4102 2.32902 17.2696 2.46967C17.1289 2.61032 17.0499 2.80109 17.0499 3V4.513C16.3849 4.5 15.6389 4.5 14.7999 4.5H10.7999C9.96091 4.5 9.21491 4.5 8.54991 4.513V3Z" fill="#A1A1A1"/>
<path fillRule="evenodd" clipRule="evenodd" d="M2.7998 12.5C2.7998 11.661 2.7998 10.915 2.8128 10.25H22.7868C22.7998 10.915 22.7998 11.661 22.7998 12.5V14.5C22.7998 18.271 22.7998 20.157 21.6278 21.328C20.4558 22.499 18.5708 22.5 14.7998 22.5H10.7998C7.0288 22.5 5.1428 22.5 3.9718 21.328C2.8008 20.156 2.7998 18.271 2.7998 14.5V12.5ZM17.7998 14.5C18.065 14.5 18.3194 14.3946 18.5069 14.2071C18.6944 14.0196 18.7998 13.7652 18.7998 13.5C18.7998 13.2348 18.6944 12.9804 18.5069 12.7929C18.3194 12.6054 18.065 12.5 17.7998 12.5C17.5346 12.5 17.2802 12.6054 17.0927 12.7929C16.9052 12.9804 16.7998 13.2348 16.7998 13.5C16.7998 13.7652 16.9052 14.0196 17.0927 14.2071C17.2802 14.3946 17.5346 14.5 17.7998 14.5ZM17.7998 18.5C18.065 18.5 18.3194 18.3946 18.5069 18.2071C18.6944 18.0196 18.7998 17.7652 18.7998 17.5C18.7998 17.2348 18.6944 16.9804 18.5069 16.7929C18.3194 16.6054 18.065 16.5 17.7998 16.5C17.5346 16.5 17.2802 16.6054 17.0927 16.7929C16.9052 16.9804 16.7998 17.2348 16.7998 17.5C16.7998 17.7652 16.9052 18.0196 17.0927 18.2071C17.2802 18.3946 17.5346 18.5 17.7998 18.5ZM13.7998 13.5C13.7998 13.7652 13.6944 14.0196 13.5069 14.2071C13.3194 14.3946 13.065 14.5 12.7998 14.5C12.5346 14.5 12.2802 14.3946 12.0927 14.2071C11.9052 14.0196 11.7998 13.7652 11.7998 13.5C11.7998 13.2348 11.9052 12.9804 12.0927 12.7929C12.2802 12.6054 12.5346 12.5 12.7998 12.5C13.065 12.5 13.3194 12.6054 13.5069 12.7929C13.6944 12.9804 13.7998 13.2348 13.7998 13.5ZM13.7998 17.5C13.7998 17.7652 13.6944 18.0196 13.5069 18.2071C13.3194 18.3946 13.065 18.5 12.7998 18.5C12.5346 18.5 12.2802 18.3946 12.0927 18.2071C11.9052 18.0196 11.7998 17.7652 11.7998 17.5C11.7998 17.2348 11.9052 16.9804 12.0927 16.7929C12.2802 16.6054 12.5346 16.5 12.7998 16.5C13.065 16.5 13.3194 16.6054 13.5069 16.7929C13.6944 16.9804 13.7998 17.2348 13.7998 17.5ZM7.7998 14.5C8.06502 14.5 8.31938 14.3946 8.50691 14.2071C8.69445 14.0196 8.7998 13.7652 8.7998 13.5C8.7998 13.2348 8.69445 12.9804 8.50691 12.7929C8.31938 12.6054 8.06502 12.5 7.7998 12.5C7.53459 12.5 7.28023 12.6054 7.0927 12.7929C6.90516 12.9804 6.7998 13.2348 6.7998 13.5C6.7998 13.7652 6.90516 14.0196 7.0927 14.2071C7.28023 14.3946 7.53459 14.5 7.7998 14.5ZM7.7998 18.5C8.06502 18.5 8.31938 18.3946 8.50691 18.2071C8.69445 18.0196 8.7998 17.7652 8.7998 17.5C8.7998 17.2348 8.69445 16.9804 8.50691 16.7929C8.31938 16.6054 8.06502 16.5 7.7998 16.5C7.53459 16.5 7.28023 16.6054 7.0927 16.7929C6.90516 16.9804 6.7998 17.2348 6.7998 17.5C6.7998 17.7652 6.90516 18.0196 7.0927 18.2071C7.28023 18.3946 7.53459 18.5 7.7998 18.5Z" fill="#A1A1A1"/>
</svg>

);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StepperStep = ({
  title,
  icon,
  isActive = false,
  isCompleted = false,
  isCurrent = false,
  stepIndex = 0,
  totalSteps = 5,
  timeEstimate = "",
  description = ""
}: {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  stepIndex?: number;
  totalSteps?: number;
  timeEstimate?: string;
  description?: string;
}) => {
  const getStepStyles = () => {
    if (isCurrent) {
      return "bg-[rgba(120,86,255,0.1)] text-[#7856ff]";
    }
    if (isCompleted) {
      return "bg-[rgba(4,180,64,0.1)] text-[#04b440]";
    }
    return "bg-[rgba(161,161,161,0.1)] text-[#a1a1a1]";
  };

  const getTextColor = () => {
    if (isCurrent) {
      return "text-[#7856ff]";
    }
    if (isCompleted) {
      return "text-[#04b440]";
    }
    return "text-[#a1a1a1]";
  };

  const getSubTextColor = () => {
    if (isCurrent) {
      return "text-[#7856ff]/70";
    }
    if (isCompleted) {
      return "text-[#04b440]/70";
    }
    return "text-[#a1a1a1]/70";
  };

  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-center justify-center min-h-px min-w-px p-[8px] relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full">
        <div className={`box-border content-stretch flex flex-col gap-2.5 items-center justify-center p-0 relative rounded-[20px] shrink-0 size-10 ${getStepStyles()}`}>
          <div className="relative shrink-0 size-6">
            {icon}
          </div>
        </div>
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center p-0 relative self-stretch shrink-0">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
          </div>
          {(timeEstimate || description) && (
            <div className={`flex flex-col items-center justify-center text-[12px] font-semibold leading-[14px] ${getSubTextColor()}`}>
              {description && (
                <span className="text-center">{description}</span>
              )}
              {timeEstimate && (
                <span className="text-center mt-1">⏱️ {timeEstimate}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const StepperProgressBar = ({ currentStep = 2, totalSteps = 5 }: { currentStep?: number; totalSteps?: number }) => {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-md overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-[#7856ff] to-[#8B6AFF] transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};







export function CreateCampaignContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get('type') || 'advertise';

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleProceedToNextStep = () => {
    router.push(`/new-campaign/schedule?type=${campaignType}`, { scroll: false });
  };

  const handleBack = () => {
    router.push(`/new-campaign/platform-budget?type=${campaignType}`, { scroll: false });
  };

  const handleClose = () => {
    router.push('/campaigns', { scroll: false });
  };

  return (
      <main className={`flex-1 transition-sidebar overflow-y-auto ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      <CampaignHeader onBack={() => router.push('/campaigns')} />

      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6] pt-16 lg:pt-4 relative">
        <CampaignStepper currentStep={4} />

          {/* Main Title */}
          <div className="mb-6 hidden lg:block">
            <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
              Campaign Creation
            </h1>
            <p className="text-[#a1a1a1] text-[14px] mt-0.5">
              This step will be configured in the future
            </p>
                  </div>

          {/* Placeholder Content */}
          <div className="bg-white border border-[#e9e9e9] rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                            </div>
            <h3 className="text-[16px] font-semibold text-[#2a2a2f] mb-2">
              Campaign Creation Coming Soon
            </h3>
            <p className="text-[#a1a1a1] text-[14px] max-w-md mx-auto">
              Advanced campaign creation tools with templates, design options, and customization features will be available in future updates.
            </p>
          </div>

        <CampaignFooter
          onClose={handleClose}
          onNext={handleProceedToNextStep}
          onPrevious={handleBack}
          nextLabel="Proceed to next step"
          showPrevious={true}
        />
      </div>
    </main>
  );
}
