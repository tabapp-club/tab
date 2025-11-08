'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export interface RecommendedCampaign {
  id: string;
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  expectedCampaignCost: string;
  expectedConversion: string;
  expectedRevenue: string;
  urgency: 'high' | 'medium' | 'low';
  priority: boolean;
  estimatedImpact: string;
}

interface RecommendedCampaignsProps {
  onSendNow?: (campaign: RecommendedCampaign) => void;
}

const RecommendedCampaigns = ({ onSendNow }: RecommendedCampaignsProps) => {
  const router = useRouter();

  const recommendations: RecommendedCampaign[] = [
    {
      id: 'inactive-users',
      title: 'Inactive Users',
      count: 280,
      description: 'Re-engage users who haven\'t interacted in 30+ days',
      icon: <InactiveUsersIcon />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      expectedCampaignCost: '₹8.5K',
      expectedConversion: '18%',
      expectedRevenue: '₹42K',
      urgency: 'high',
      priority: true,
      estimatedImpact: 'High revenue recovery'
    },
    {
      id: 'followup-messages',
      title: 'Follow-up Messages',
      count: 450,
      description: 'Critical follow-ups pending - risk of losing engagement',
      icon: <FollowUpIcon />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      expectedCampaignCost: '₹12K',
      expectedConversion: '32%',
      expectedRevenue: '₹68K',
      urgency: 'high',
      priority: true,
      estimatedImpact: 'Immediate conversion boost'
    },
    {
      id: 'birthday-wishes',
      title: 'Birthday Wishes',
      count: 300,
      description: 'This month\'s birthdays - time-sensitive opportunity',
      icon: <BirthdayIcon />,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      expectedCampaignCost: '₹6.5K',
      expectedConversion: '28%',
      expectedRevenue: '₹55K',
      urgency: 'high',
      priority: false,
      estimatedImpact: 'Strong emotional connection'
    },
    {
      id: 'low-value-users',
      title: 'Low Value Users',
      count: 906,
      description: 'Upsell opportunity to increase lifetime value',
      icon: <LowValueIcon />,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      expectedCampaignCost: '₹18K',
      expectedConversion: '15%',
      expectedRevenue: '₹1.2L',
      urgency: 'medium',
      priority: false,
      estimatedImpact: 'Significant revenue growth'
    },
  ];

  const handleCampaignClick = (campaign: RecommendedCampaign) => {
    // Navigate to send campaign page
    router.push(`/send-campaign?id=${campaign.id}`);
  };

  const handleSendNowClick = (e: React.MouseEvent, campaign: RecommendedCampaign) => {
    e.stopPropagation(); // Prevent card click from firing
    // Navigate to send campaign page
    if (onSendNow) {
      onSendNow(campaign);
    } else {
      router.push(`/send-campaign?id=${campaign.id}`);
    }
  };

  return (
    <div 
      className="w-full rounded-lg p-[0.5px]"
      style={{
        background: 'linear-gradient(to bottom, rgba(151, 71, 255, 0.2), rgba(151, 71, 255, 0.05), #f6f6f6)'
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-purple-50/40 rounded-lg p-4 sm:p-5 lg:p-6">
      {/* Section Title */}
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#2a2a2f]">
          Recommended Campaigns
        </h2>
        <p className="text-sm text-[#626266] mt-1">
          Actionable campaigns to boost engagement and revenue
        </p>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recommendations.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => handleCampaignClick(campaign)}
              className="bg-white p-4 min-w-[280px] flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              style={{ 
                border: '0.5px solid #9747FF',
                borderRadius: '16px',
                boxShadow: '0 4px 0 0 #9747FF'
              }}
            >
              {/* Top Section with Background */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-lg -m-4 p-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3 mt-0 relative">
                  <div className={`w-12 h-12 ${campaign.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <div className={campaign.iconColor}>
                      {campaign.icon}
                    </div>
                  </div>
                  {/* Urgency Indicator */}
                  {campaign.urgency === 'high' && (
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                      URGENT
                    </div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1 mb-2">
                    <p className="text-3xl font-bold text-gray-900">{campaign.count.toLocaleString()}</p>
                    <span className="text-xs text-gray-500">users</span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-[#2a2a2f] mb-1">{campaign.title}</h3>
                  <p className="text-xs text-[#626266] line-clamp-2">{campaign.description}</p>
                </div>
              </div>
              
              <div className="min-w-0">
                
                {/* Key Metrics */}
                <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Expected Campaign Cost</span>
                    <span className="text-sm font-bold text-orange-600">{campaign.expectedCampaignCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Expected Conversion</span>
                    <span className="text-sm font-semibold text-purple-600">{campaign.expectedConversion}</span>
                  </div>
                </div>
                
                {/* Impact Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-purple-600">
                    {campaign.estimatedImpact}
                  </span>
                  <button 
                    onClick={(e) => handleSendNowClick(e, campaign)}
                    className="flex items-center gap-1 text-xs font-semibold border border-[#9747FF] text-[#9747FF] bg-white hover:bg-[#9747FF]/10 rounded px-2.5 py-1 transition-colors whitespace-nowrap"
                  >
                    Send Now
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => handleCampaignClick(campaign)}
              className="bg-white p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden"
              style={{ 
                border: '0.5px solid #9747FF',
                borderRadius: '16px',
                boxShadow: '0 4px 0 0 #9747FF'
              }}
            >
              {/* Top Section with Background */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-lg -m-5 p-5 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4 mt-0 relative">
                  <div className={`w-14 h-14 ${campaign.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <div className={campaign.iconColor}>
                      {campaign.icon}
                    </div>
                  </div>
                  {/* Urgency Indicator */}
                  {campaign.urgency === 'high' && (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      URGENT
                    </div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">{campaign.count.toLocaleString()}</p>
                    <span className="text-sm text-gray-500">users</span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-[#2a2a2f] mb-1.5">{campaign.title}</h3>
                  <p className="text-sm text-[#626266] line-clamp-2 min-h-[40px]">{campaign.description}</p>
                </div>
              </div>
              
              <div className="min-w-0">
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-0.5">Expected Cost</p>
                    <p className="text-sm font-bold text-orange-600">{campaign.expectedCampaignCost}</p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-xs text-gray-600 mb-0.5">Expected Conversion</p>
                    <p className="text-sm font-bold text-purple-600">{campaign.expectedConversion}</p>
                  </div>
                </div>
                
                {/* Impact & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-600">
                    {campaign.estimatedImpact}
                  </span>
                  <button 
                    onClick={(e) => handleSendNowClick(e, campaign)}
                    className="flex items-center gap-1.5 text-sm font-semibold border border-[#9747FF] text-[#9747FF] bg-white hover:bg-[#9747FF]/10 rounded px-3 py-1.5 group-hover:gap-2 transition-all whitespace-nowrap"
                  >
                    Send Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-100/0 group-hover:from-purple-50/30 group-hover:to-purple-100/20 pointer-events-none transition-opacity duration-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

// Icon Components
const InactiveUsersIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FollowUpIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BirthdayIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LowValueIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export { RecommendedCampaigns };

