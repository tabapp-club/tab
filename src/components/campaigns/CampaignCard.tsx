'use client';

import { useState, useRef, useEffect } from 'react';
import { CampaignData } from './CampaignsClient';

interface CampaignCardProps {
  campaign: CampaignData;
  isHighlighted?: boolean;
}

export function CampaignCard({ campaign, isHighlighted = false }: CampaignCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTitleEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    // Birthday, anniversary, celebration
    if (lowerTitle.includes('birthday') || lowerTitle.includes('anniversary') || lowerTitle.includes('celebration')) {
      return '🎉';
    }
    
    // Feedback, survey, review
    if (lowerTitle.includes('feedback') || lowerTitle.includes('survey') || lowerTitle.includes('review') || lowerTitle.includes('rating')) {
      return '💬';
    }
    
    // Sale, discount, offer, promotion, deal
    if (lowerTitle.includes('sale') || lowerTitle.includes('discount') || lowerTitle.includes('offer') || lowerTitle.includes('promotion') || lowerTitle.includes('deal') || lowerTitle.includes('special')) {
      return '🎁';
    }
    
    // Welcome, new user, onboarding
    if (lowerTitle.includes('welcome') || lowerTitle.includes('new user') || lowerTitle.includes('onboarding')) {
      return '👋';
    }
    
    // Follow-up, reminder
    if (lowerTitle.includes('follow-up') || lowerTitle.includes('followup') || lowerTitle.includes('reminder')) {
      return '🔔';
    }
    
    // Inactive, dormant, re-engage, win-back
    if (lowerTitle.includes('inactive') || lowerTitle.includes('dormant') || lowerTitle.includes('re-engage') || lowerTitle.includes('win-back') || lowerTitle.includes('winback')) {
      return '🔄';
    }
    
    // Thank you, appreciation, gratitude
    if (lowerTitle.includes('thank') || lowerTitle.includes('appreciation') || lowerTitle.includes('gratitude')) {
      return '🙏';
    }
    
    // Announcement, news, update
    if (lowerTitle.includes('announcement') || lowerTitle.includes('news') || lowerTitle.includes('update')) {
      return '📢';
    }
    
    // Retention, loyalty
    if (lowerTitle.includes('retention') || lowerTitle.includes('loyalty')) {
      return '💜';
    }
    
    // Engagement, interaction
    if (lowerTitle.includes('engagement') || lowerTitle.includes('interaction')) {
      return '🎯';
    }
    
    // Low value, upsell, upgrade
    if (lowerTitle.includes('low value') || lowerTitle.includes('upsell') || lowerTitle.includes('upgrade')) {
      return '📈';
    }
    
    // Abandoned cart
    if (lowerTitle.includes('abandoned') || lowerTitle.includes('cart')) {
      return '🛒';
    }
    
    // Event, webinar, workshop
    if (lowerTitle.includes('event') || lowerTitle.includes('webinar') || lowerTitle.includes('workshop')) {
      return '📅';
    }
    
    // Default
    return '📋';
  };

  const getStatusColor = (status: CampaignData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-[#9747FF]/10 text-[#9747FF] border-[#9747FF]/20';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getSentPercentage = (): number => {
    if (!campaign.audience || campaign.audience === 0) return 0;
    const percentage = (campaign.sent / campaign.audience) * 100;
    return isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
  };

  const getOpenedPercentage = (): number => {
    if (!campaign.sent || campaign.sent === 0) return 0;
    const percentage = (campaign.opened / campaign.sent) * 100;
    return isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
  };

  const getClickedPercentage = (): number => {
    if (!campaign.sent || campaign.sent === 0) return 0;
    const percentage = (campaign.clicked / campaign.sent) * 100;
    return isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
  };

  const formatPercentage = (value: number): string => {
    if (isNaN(value) || !isFinite(value) || value < 0) {
      return '0%';
    }
    const rounded = Math.max(0, Math.round(value));
    return `${rounded}%`;
  };

  return (
    <>
      <div
        id={`campaign-${campaign.id}`}
        className={`bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 min-w-0 relative scroll-mt-24 ${
          isHighlighted ? 'ring-2 ring-[#9747FF] ring-offset-2' : ''
        }`}
        tabIndex={-1}
      >
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="p-4">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl">
                  {getTitleEmoji(campaign.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {campaign.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {capitalizeFirstLetter(campaign.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-900">{formatNumber(campaign.audience)}</div>
                <div className="text-xs text-blue-600 mt-0.5">Audience</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-900">{formatCurrency(campaign.budget)}</div>
                <div className="text-xs text-purple-600 mt-0.5">Budget</div>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-gray-50">
                <div className="text-sm font-semibold text-gray-900">{formatPercentage(getSentPercentage())}</div>
                <div className="text-xs text-gray-600 mt-0.5">Sent</div>
              </div>
              <div className="text-center p-2 bg-gray-50">
                <div className="text-sm font-semibold text-gray-900">{formatPercentage(getOpenedPercentage())}</div>
                <div className="text-xs text-gray-600 mt-0.5">Opened</div>
              </div>
              <div className="text-center p-2 bg-gray-50">
                <div className="text-sm font-semibold text-gray-900">{formatPercentage(getClickedPercentage())}</div>
                <div className="text-xs text-gray-600 mt-0.5">Clicked</div>
              </div>
            </div>

            {/* Dates Row */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Created: {campaign.createdDate}</span>
              <span>Ends: {campaign.endDate}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Left Side - Campaign Information */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-2xl">
                    {getTitleEmoji(campaign.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {campaign.name}
                      </h3>
                      <span className={`px-1 py-0.5 text-xs font-medium rounded border ${getStatusColor(campaign.status)}`}>
                        {capitalizeFirstLetter(campaign.status)}
                      </span>
                    </div>
                    {/* Dates under the title */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Created: {campaign.createdDate}</span>
                      <span>Ends: {campaign.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - All Metrics in Single Line */}
              <div className="flex items-center">
                {/* Audience */}
                <div className="text-center px-4 py-1 min-w-[60px]">
                  <div className="text-base text-gray-900">
                    {formatNumber(campaign.audience)}
                  </div>
                  <div className="text-xs text-gray-500">Audience</div>
                </div>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-200"></div>
                
                {/* Budget */}
                <div className="text-center px-4 py-1 min-w-[60px]">
                  <div className="text-base text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </div>
                  <div className="text-xs text-gray-500">Budget</div>
                </div>
                
                {/* Sent */}
                <div className="text-center px-4 py-1 bg-blue-50 min-w-[50px]">
                  <div className="text-base text-blue-900">{formatPercentage(getSentPercentage())}</div>
                  <div className="text-xs text-blue-600">Sent</div>
                </div>
                
                {/* Opened */}
                <div className="text-center px-4 py-1 bg-green-50 min-w-[50px]">
                  <div className="text-base text-green-900">{formatPercentage(getOpenedPercentage())}</div>
                  <div className="text-xs text-green-600">Opened</div>
                </div>
                
                {/* Clicked */}
                <div className="text-center px-4 py-1 bg-purple-50 min-w-[50px]">
                  <div className="text-base text-purple-900">{formatPercentage(getClickedPercentage())}</div>
                  <div className="text-xs text-purple-600">Clicked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Action Icons
const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2.5C3.5 2.5 0.5 5.5 0.5 7s3 4.5 6.5 4.5 6.5-2 6.5-4.5-3-4.5-6.5-4.5z" stroke="currentColor" strokeWidth="1"/>
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 1.5a2 2 0 012.83 2.83L4.5 13.17l-3.67.33.33-3.67L10 1.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DuplicateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 4.5h5.5v5.5M2.5 6.5h5.5v5.5h-5.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 3.5L2.5 3.5M5.5 1.5h3M9.5 5.5v6h-5v-6M6.5 7.5v2M7.5 7.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
