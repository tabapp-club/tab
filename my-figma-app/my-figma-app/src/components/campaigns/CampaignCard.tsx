'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CampaignData } from './CampaignsClient';

// Campaign type icons (reusing from CampaignCards component)
const FeedbackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.3" d="M10.86 2.79C11.25 2.78 11.64 2.88 11.99 3.07C12.34 3.26 12.63 3.54 12.84 3.88C13.05 4.22 13.17 4.61 13.19 5.01C13.22 5.41 13.15 5.81 12.98 6.17C12.81 6.53 12.55 6.84 12.22 7.07C11.89 7.30 11.50 7.43 11.09 7.46C10.68 7.49 10.27 7.42 9.90 7.26C9.53 7.10 9.21 6.85 8.97 6.54C9.25 6.05 9.40 5.49 9.41 4.92C9.42 4.35 9.29 3.79 9.03 3.29C9.20 3.20 9.39 3.15 9.58 3.15L10.86 2.79ZM6.07 1.48C7.77 1.48 9.15 2.86 9.15 4.56C9.15 6.26 7.77 7.64 6.07 7.64C4.37 7.64 2.99 6.26 2.99 4.56C2.99 2.86 4.37 1.48 6.07 1.48Z" fill="#17C653"/>
    <path d="M6.07 8.39C8.59 8.39 10.64 9.76 10.64 11.45C10.64 13.14 8.59 14.51 6.07 14.51C3.55 14.51 1.50 13.14 1.50 11.45C1.50 9.76 3.55 8.39 6.07 8.39ZM10.86 8.32C12.88 8.32 14.51 9.47 14.52 10.77C14.52 12.08 13.01 13.14 11.07 13.21C11.42 12.69 11.61 12.08 11.61 11.45C11.59 10.84 11.41 10.23 11.08 9.71C10.76 9.18 10.31 8.74 9.77 8.44C10.14 8.36 10.52 8.32 10.86 8.32Z" fill="#17C653"/>
  </svg>
);

const RetentionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.48 12.83C8.73 12.83 8.95 12.96 9.17 13.19C9.34 13.33 9.45 13.54 9.45 13.77V17.90C9.44 18.13 9.34 18.35 9.16 18.50C8.98 18.65 8.73 18.71 8.48 18.77C8.22 18.77 7.98 18.67 7.79 18.49C7.60 18.31 7.50 18.07 7.50 17.90V13.77C7.50 13.54 7.61 13.33 7.79 13.19C7.98 12.96 8.22 12.83 8.48 12.83ZM14.66 9.36C14.92 9.36 15.15 9.48 15.35 9.67C15.55 9.86 15.66 10.12 15.66 10.36V17.90C15.66 18.13 15.55 18.37 15.35 18.49C15.15 18.61 14.92 18.77 14.66 18.77C14.40 18.77 14.15 18.61 13.99 18.49C13.81 18.37 13.71 18.13 13.69 17.90V10.36C13.70 10.12 13.81 9.86 13.99 9.67C14.18 9.48 14.41 9.36 14.66 9.36ZM2.20 14.52C2.46 14.52 2.69 14.63 2.89 14.81C2.99 14.96 3.06 15.14 3.06 15.50V17.90C3.05 18.13 2.93 18.35 2.89 18.49C2.69 18.67 2.46 18.77 2.20 18.77C1.95 18.77 1.70 18.61 1.52 18.49C1.33 18.35 1.23 18.11 1.23 17.90V15.50C1.23 15.27 1.33 15.03 1.52 14.81C1.70 14.63 1.95 14.52 2.20 14.52ZM14.66 1.42C14.73 1.42 14.80 1.43 14.85 1.49C14.91 1.54 14.96 1.61 15.01 1.68C15.05 1.76 15.08 1.84 15.09 1.93C15.10 2.01 15.09 2.10 15.06 2.18V5.41C15.07 5.49 15.06 5.58 15.02 5.65C15.00 5.73 14.97 5.80 14.93 5.86C14.89 5.92 14.83 5.98 14.76 6.01C14.70 6.04 14.62 6.06 14.55 6.06C14.47 6.06 14.40 6.04 14.33 6.01C14.26 6.00 14.19 5.95 14.13 5.88C14.07 5.81 14.02 5.73 14.00 5.65C13.98 5.57 13.97 5.49 13.98 5.41V5.08C10.97 10.52 2.81 10.72 2.54 10.72H2.53C2.34 10.72 2.16 10.65 2.02 10.52C1.88 10.39 1.78 10.21 1.76 10.02C1.74 9.91 1.75 9.79 1.78 9.69C1.81 9.58 1.86 9.48 1.93 9.39C1.99 9.31 2.07 9.24 2.16 9.19C2.25 9.15 2.35 9.12 2.45 9.12C2.61 9.12 8.05 8.55 12.62 3.36H11.82C11.67 3.36 11.52 3.31 11.41 3.21C11.31 3.10 11.25 2.96 11.25 2.81C11.25 2.66 11.31 2.52 11.41 2.42C11.52 2.31 11.67 2.26 11.82 2.26H14.66Z" fill="#8B16FF"/>
  </svg>
);

const EngagementIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.43 1.48C10.59 1.48 10.74 1.54 10.85 1.66L11.78 2.59C11.90 2.71 11.96 2.85 11.96 2.99C11.96 3.17 11.90 3.32 11.78 3.43L11.78 3.43H13.11C13.71 3.43 14.19 3.92 14.19 4.52V5.61C14.19 6.21 13.71 6.69 13.11 6.69H9.95V10.02C9.95 10.13 9.92 10.24 9.86 10.35C9.80 10.45 9.71 10.53 9.61 10.58C9.51 10.64 9.39 10.66 9.27 10.65C9.16 10.64 9.05 10.62 8.95 10.56L8.45 10.22C8.32 10.13 8.16 10.09 7.99 10.09C7.84 10.09 7.68 10.14 7.54 10.22L7.04 10.56C6.95 10.62 6.84 10.64 6.72 10.65C6.61 10.66 6.49 10.64 6.39 10.58C6.29 10.53 6.20 10.45 6.14 10.35C6.08 10.24 6.04 10.13 6.04 10.02V6.69H2.89C2.29 6.69 1.80 6.21 1.80 5.61V4.52C1.80 3.92 2.29 3.43 2.89 3.43H4.21C4.10 3.32 4.04 3.17 4.04 2.99C4.04 2.86 4.10 2.71 4.21 2.59L5.14 1.66C5.26 1.54 5.41 1.48 5.57 1.48C5.72 1.48 5.87 1.54 5.99 1.66L7.77 3.43H8.23L10.01 1.66C10.13 1.54 10.28 1.48 10.43 1.48Z" fill="#F8285A"/>
    <path opacity="0.3" d="M2.78 5.06H13.22V12.64C13.22 12.89 13.17 13.13 13.07 13.36C13.00 13.59 12.84 13.79 12.66 13.97C12.49 14.14 12.28 14.28 12.05 14.37C11.82 14.47 11.58 14.51 11.34 14.51H4.66C4.16 14.51 3.68 14.31 3.33 13.97C2.98 13.62 2.78 13.14 2.78 12.64V5.06Z" fill="#F8285A"/>
  </svg>
);

const AdvertiseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.3" d="M13.34 1.35L10.98 1.77C9.79 2.09 8.70 2.73 7.84 3.61C6.46 5.05 4.92 8.13 4.31 9.42C4.23 9.59 4.20 9.79 4.24 9.96C4.27 10.13 4.37 10.31 4.50 10.44L5.87 11.77C6.00 11.91 6.18 12.00 6.36 12.02C6.54 12.04 6.73 12.01 6.89 11.92C8.89 10.92 10.75 9.69 12.46 8.25C13.36 7.40 13.97 6.31 14.20 5.13L14.63 2.68C14.66 2.50 14.66 2.32 14.60 2.14C14.55 1.97 14.46 1.81 14.33 1.68C14.20 1.55 14.05 1.45 13.87 1.39C13.70 1.34 13.52 1.32 13.34 1.35V1.35ZM11.76 6.14C11.58 6.33 11.35 6.46 11.09 6.52C10.83 6.58 10.56 6.56 10.32 6.46C10.07 6.35 9.86 6.20 9.71 5.98C9.56 5.77 9.47 5.51 9.47 5.25C9.46 4.98 9.53 4.72 9.68 4.50C9.82 4.28 10.02 4.11 10.27 4.00C10.51 3.89 10.78 3.86 11.04 3.91C11.30 3.96 11.54 4.08 11.73 4.26C11.97 4.51 12.12 4.84 12.13 5.19C12.14 5.54 12.01 5.88 11.76 6.14Z" fill="#1B84FF"/>
    <path d="M6.25 5.78L4.40 9.25L1.35 9.18C1.35 9.18 3.90 5.28 6.25 5.78ZM10.73 9.61L7.40 11.64L7.60 14.67C7.60 14.67 11.34 11.92 10.73 9.61ZM10.79 3.90C10.53 3.90 10.27 3.99 10.05 4.12C9.83 4.27 9.66 4.48 9.56 4.72C9.46 4.96 9.44 5.23 9.49 5.49C9.54 5.75 9.66 5.98 9.85 6.17C10.04 6.36 10.27 6.48 10.53 6.54C10.79 6.59 11.06 6.56 11.30 6.46C11.54 6.36 11.75 6.19 11.90 5.97C12.05 5.75 12.13 5.49 12.13 5.23C12.13 4.87 11.99 4.52 11.73 4.27C11.48 4.01 11.14 3.87 10.79 3.90V3.90Z" fill="#1B84FF"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6C10.69 6 11.25 5.44 11.25 4.75C11.25 4.06 10.69 3.5 10 3.5C9.31 3.5 8.75 4.06 8.75 4.75C8.75 5.44 9.31 6 10 6Z" fill="#a1a1a1"/>
    <path d="M10 11.25C10.69 11.25 11.25 10.69 11.25 10C11.25 9.31 10.69 8.75 10 8.75C9.31 8.75 8.75 9.31 8.75 10C8.75 10.69 9.31 11.25 10 11.25Z" fill="#a1a1a1"/>
    <path d="M10 16.5C10.69 16.5 11.25 15.94 11.25 15.25C11.25 14.56 10.69 14 10 14C9.31 14 8.75 14.56 8.75 15.25C8.75 15.94 9.31 16.5 10 16.5Z" fill="#a1a1a1"/>
  </svg>
);

interface CampaignCardProps {
  campaign: CampaignData;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const handleMoreClick = () => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 120, // 120px is approximate dropdown width
      });
    }
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown]);

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

  const getTypeIcon = (type: CampaignData['type']) => {
    switch (type) {
      case 'feedback':
        return <FeedbackIcon />;
      case 'retention':
        return <RetentionIcon />;
      case 'engagement':
        return <EngagementIcon />;
      case 'advertise':
        return <AdvertiseIcon />;
      default:
        return <EngagementIcon />;
    }
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
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: CampaignData['type']) => {
    switch (type) {
      case 'feedback':
        return 'text-green-600';
      case 'retention':
        return 'text-purple-600';
      case 'engagement':
        return 'text-pink-600';
      case 'advertise':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const dropdownMenu = showDropdown && (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        zIndex: 9999,
      }}
      className="bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px]"
    >
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <ViewIcon />
        View Details
      </button>
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <EditIcon />
        Edit Campaign
      </button>
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <DuplicateIcon />
        Duplicate
      </button>
      <hr className="my-1" />
      <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
        <DeleteIcon />
        Delete
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all duration-200 min-w-0 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className={getTypeColor(campaign.type)}>
                {getTypeIcon(campaign.type)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {campaign.name}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {campaign.type.replace(/([A-Z])/g, ' $1')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
            <button
              ref={moreButtonRef}
              onClick={handleMoreClick}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreIcon />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(campaign.audience)}
            </div>
            <div className="text-xs text-gray-500">Audience</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-bold text-gray-900">
              {campaign.conversion.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Conversion</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(campaign.budget)}
            </div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(campaign.spent)}
            </div>
            <div className="text-xs text-gray-500">Spent</div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Sent</span>
            <span className="font-medium">{formatNumber(campaign.sent)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Opened</span>
            <span className="font-medium">{formatNumber(campaign.opened)} ({campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : '0'}%)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Clicked</span>
            <span className="font-medium">{formatNumber(campaign.clicked)} ({campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : '0'}%)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>Created: {campaign.createdDate}</span>
          <span>Ends: {campaign.endDate}</span>
        </div>
      </div>

      {/* Render dropdown using portal */}
      {showDropdown && dropdownMenu && createPortal(dropdownMenu, document.body)}
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
