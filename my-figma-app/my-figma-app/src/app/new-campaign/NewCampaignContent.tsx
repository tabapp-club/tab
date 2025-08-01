"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import Image from "next/image";

interface CampaignType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  people: string;
  type: 'advertise' | 'engagement' | 'retention' | 'feedback';
  benefits: string[];
  category: string;
}

const AdvertiseIcon = () => (
  <div className="relative w-11 h-11">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const EngagementIcon = () => (
  <div className="relative w-11 h-11">
    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const RetentionIcon = () => (
  <div className="relative w-11 h-11">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const FeedbackIcon = () => (
  <div className="relative w-11 h-11">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4.5C9.62132 4.5 10.125 3.99632 10.125 3.375C10.125 2.75368 9.62132 2.25 9 2.25C8.37868 2.25 7.875 2.75368 7.875 3.375C7.875 3.99632 8.37868 4.5 9 4.5Z" fill="#78829D"/>
    <path d="M9 9C9.62132 9 10.125 8.49632 10.125 7.875C10.125 7.25368 9.62132 6.75 9 6.75C8.37868 6.75 7.875 7.25368 7.875 7.875C7.875 8.49632 8.37868 9 9 9Z" fill="#78829D"/>
    <path d="M9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375C10.125 11.7537 9.62132 11.25 9 11.25C8.37868 11.25 7.875 11.7537 7.875 12.375C7.875 12.9963 8.37868 13.5 9 13.5Z" fill="#78829D"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="2"/>
    <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const campaignTypes: CampaignType[] = [
  {
    id: 'advertise',
    title: 'Professional Advertising Campaign',
    description: 'Create compelling, professional advertisements to reach new customers and grow your brand presence.',
    icon: <AdvertiseIcon />,
    people: '10,000+ businesses',
    type: 'advertise',
    benefits: ['Reach new customers', 'Increase brand awareness', 'Drive sales growth'],
    category: 'Growth'
  },
  {
    id: 'engagement',
    title: 'Customer Engagement Strategy',
    description: 'Build stronger customer relationships with personalized, professional engagement strategies.',
    icon: <EngagementIcon />,
    people: '8,500+ businesses',
    type: 'engagement',
    benefits: ['Improve customer relationships', 'Increase customer satisfaction', 'Boost repeat purchases'],
    category: 'Relationship'
  },
  {
    id: 'retention',
    title: 'Customer Retention Program',
    description: 'Keep existing customers engaged with professional loyalty programs and retention strategies.',
    icon: <RetentionIcon />,
    people: '6,200+ businesses',
    type: 'retention',
    benefits: ['Reduce customer churn', 'Increase customer lifetime value', 'Build brand loyalty'],
    category: 'Loyalty'
  },
  {
    id: 'feedback',
    title: 'Customer Feedback & Survey',
    description: 'Collect valuable customer insights through professional surveys to improve your products and services.',
    icon: <FeedbackIcon />,
    people: '4,800+ businesses',
    type: 'feedback',
    benefits: ['Gather customer insights', 'Improve products/services', 'Make data-driven decisions'],
    category: 'Insights'
  }
];

export function NewCampaignContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleCampaignTypeSelect = (campaignType: CampaignType) => {
    setSelectedCampaignType(campaignType);
  };

  const handleProceedToNextStep = () => {
    if (selectedCampaignType) {
      router.push(`/new-campaign/create?type=${selectedCampaignType.type}`);
    }
  };

  const getCampaignTips = (type: string) => {
    const tips = {
      advertise: 'Perfect for businesses looking to expand their customer base and increase brand visibility.',
      engagement: 'Ideal for building stronger relationships with existing customers and improving satisfaction.',
      retention: 'Best for reducing customer churn and increasing customer lifetime value.',
      feedback: 'Great for gathering insights to improve your products and services.'
    };
    return tips[type as keyof typeof tips] || '';
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
                Create New Campaign
              </h1>
              <p className="text-sm sm:text-base text-[#626266] mt-2 sm:mt-3">
                Choose the type of campaign that best fits your business goals
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProceedToNextStep}
                disabled={!selectedCampaignType}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCampaignType
                    ? 'bg-[#7856ff] text-white hover:bg-[#6a4fd8] shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedCampaignType
                  ? `Create ${selectedCampaignType.title.split(' ')[0]} Campaign`
                  : 'Select a campaign type'
                }
              </button>
            </div>
          </div>
        </header>

        {/* Contextual Tip - Moved Above Campaign Cards */}
        {selectedCampaignType && (
          <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-purple-50 border border-purple-200 box-border overflow-hidden">
            <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L7.09 4.26L10.5 4.5L7.75 7.24L8.59 10.5L6 8.5L3.41 10.5L4.25 7.24L1.5 4.5L4.91 4.26L6 1Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-900 mb-1">Pro Tip</h4>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    {getCampaignTips(selectedCampaignType.type)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Campaign Selection Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#ffffff] border border-[#ffffff] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Choose your campaign type
            </h2>

            {/* Campaign Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {campaignTypes.map((campaignType) => (
                <div
                  key={campaignType.id}
                  className={`relative bg-white rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 ${
                    selectedCampaignType?.id === campaignType.id
                      ? 'border-[#7856ff] ring-2 ring-[#7856ff]/20'
                      : 'border-[#e9e9e9] hover:border-[#7856ff]/50'
                  }`}
                  onClick={() => handleCampaignTypeSelect(campaignType)}
                >
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start mb-4">
                      <div className="flex items-center gap-3">
                        {campaignType.icon}
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base font-semibold text-[#2a2a2f] leading-tight">
                            {campaignType.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#626266] mt-1 leading-relaxed">
                            {campaignType.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-[#7856ff]/10 text-[#7856ff] rounded-md">
                        {campaignType.category}
                      </span>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-[#2a2a2f] mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {campaignType.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-[#626266]">
                            <div className="w-1.5 h-1.5 bg-[#7856ff] rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Statistics */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-[#2a2a2f]">
                        {campaignType.people}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-[#626266]">Popular</span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedCampaignType?.id === campaignType.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-[#7856ff] rounded-full flex items-center justify-center">
                          <CheckIcon />
                        </div>
                      </div>
                    )}
                  </div>


                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
