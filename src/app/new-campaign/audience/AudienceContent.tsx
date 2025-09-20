"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { CampaignStepper } from "@/components/campaign/CampaignStepper";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaign } from "@/contexts/CampaignContext";
import CustomCheckbox from "@/components/ui/CustomCheckbox";




export function AudienceContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get('type') || 'advertise';
  const source = searchParams.get('source') || '';
  const { user } = useAuth();
  const { updateCampaignType, updateSource } = useCampaign();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  console.log('AudienceContent: Component rendering', { campaignType, user: !!user });

  // Handle source information and campaign type on component mount
  useEffect(() => {
    // Update campaign type in context only if it's different
    updateCampaignType(campaignType);
    
    // Handle source information if coming from dashboard
    if (source === 'dashboard') {
      // Get source data from localStorage
      const sourceData = localStorage.getItem('campaign_source');
      if (sourceData) {
        try {
          const parsedSourceData = JSON.parse(sourceData);
          updateSource({
            origin: parsedSourceData.source,
            campaignType: parsedSourceData.campaignType,
            timestamp: parsedSourceData.timestamp
          });
        } catch (error) {
          console.error('Error parsing source data:', error);
        }
      }
    }
  }, [campaignType, source]); // Remove updateCampaignType and updateSource from dependencies

  // Simple audience selection state
  const [audienceType, setAudienceType] = useState<'all' | 'custom' | 'ai_inactive' | 'ai_vip' | 'ai_cart'>('all');

  // Custom filter state
  const [customFilters, setCustomFilters] = useState({
    customerType: [] as string[],
    customerStatus: [] as string[],
    numberOfVisits: {
      min: 0,
      max: 100
    },
    category: [] as string[],
    customerBehaviour: {
      purchaseHistory: [] as string[],
      engagementLevel: '' as string,
      visitFrequency: '' as string,
      lastActivity: '' as string,
      lifetimeValue: '' as string
    }
  });

  const [expandedFilters, setExpandedFilters] = useState<string[]>(['customerType']);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Fetch data from Data Centre structure
  const filterOptions = {
    customerType: [
      { id: 'retained', label: 'Retained', description: 'Long-term customers' },
      { id: 'new', label: 'New', description: 'Recently acquired customers' }
    ],
    customerStatus: [
      { id: 'active', label: 'Active', description: 'Currently engaged customers' },
      { id: 'inactive', label: 'Inactive', description: 'Not recently engaged' }
    ],

    numberOfVisits: {
      ranges: [
        { id: '1', label: '1 visit', min: 1, max: 1 },
        { id: '2-5', label: '2-5 visits', min: 2, max: 5 },
        { id: '6-10', label: '6-10 visits', min: 6, max: 10 },
        { id: '11-20', label: '11-20 visits', min: 11, max: 20 },
        { id: '21-50', label: '21-50 visits', min: 21, max: 50 },
        { id: '50+', label: '50+ visits', min: 51, max: 999 }
      ]
    },
    category: [
      { id: 'electronics', label: 'Electronics', description: 'Tech products' },
      { id: 'clothing', label: 'Clothing', description: 'Apparel and fashion' },
      { id: 'home_garden', label: 'Home & Garden', description: 'Home improvement' },
      { id: 'automotive', label: 'Automotive', description: 'Vehicle related' },
      { id: 'health_beauty', label: 'Health & Beauty', description: 'Wellness products' },
      { id: 'sports', label: 'Sports', description: 'Athletic equipment' },
      { id: 'books', label: 'Books', description: 'Literature and education' },
      { id: 'movies', label: 'Movies', description: 'Entertainment media' },
      { id: 'music', label: 'Music', description: 'Audio content' },
      { id: 'food_drink', label: 'Food & Drink', description: 'Culinary products' }
    ],
    customerBehaviour: {
      purchaseHistory: [
        { id: 'last_30_days', label: 'Last 30 days', description: 'Recent purchases' },
        { id: 'last_3_months', label: 'Last 3 months', description: 'Quarterly activity' },
        { id: 'last_6_months', label: 'Last 6 months', description: 'Semi-annual activity' },
        { id: 'last_year', label: 'Last year', description: 'Annual activity' },
        { id: 'more_than_year', label: 'More than 1 year', description: 'Historical activity' }
      ],
      engagementLevel: [
        { id: 'high', label: 'High', description: 'Very engaged customers' },
        { id: 'medium', label: 'Medium', description: 'Moderately engaged' },
        { id: 'low', label: 'Low', description: 'Minimally engaged' }
      ],
      visitFrequency: [
        { id: 'daily', label: 'Daily', description: 'Visit every day' },
        { id: 'weekly', label: 'Weekly', description: 'Visit weekly' },
        { id: 'monthly', label: 'Monthly', description: 'Visit monthly' },
        { id: 'quarterly', label: 'Quarterly', description: 'Visit quarterly' },
        { id: 'yearly', label: 'Yearly', description: 'Visit yearly' }
      ],
      lastActivity: [
        { id: 'today', label: 'Today', description: 'Active today' },
        { id: 'this_week', label: 'This week', description: 'Active this week' },
        { id: 'this_month', label: 'This month', description: 'Active this month' },
        { id: 'last_month', label: 'Last month', description: 'Active last month' },
        { id: 'older', label: 'Older', description: 'Not recently active' }
      ],
      lifetimeValue: [
        { id: 'high_value', label: 'High Value', description: '₹500+ total spent' },
        { id: 'medium_value', label: 'Medium Value', description: '₹100-₹500 spent' },
        { id: 'low_value', label: 'Low Value', description: 'Under ₹100 spent' },
        { id: 'new_customer', label: 'New Customer', description: 'No purchase history' }
      ]
    }
  };

  const updateFilter = (section: keyof typeof customFilters, key: string, value: any) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateArrayFilter = (section: keyof typeof customFilters, value: string) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].includes(value)
          ? prev[section].filter(item => item !== value)
          : [...prev[section], value]
        : prev[section]
    }));
  };

  const updateRangeFilter = (section: keyof typeof customFilters, key: string, value: number) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const toggleFilter = (section: string) => {
    setExpandedFilters(prev =>
      prev.includes(section) ? [] : [section] // Only allow one accordion open at a time
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    // Count customerType
    count += customFilters.customerType.length;

    // Count customerStatus
    count += customFilters.customerStatus.length;

    // Count category
    count += customFilters.category.length;

    // Count customerBehaviour
    count += customFilters.customerBehaviour.purchaseHistory.length;
    if (customFilters.customerBehaviour.engagementLevel) count += 1;
    if (customFilters.customerBehaviour.visitFrequency) count += 1;
    if (customFilters.customerBehaviour.lastActivity) count += 1;
    if (customFilters.customerBehaviour.lifetimeValue) count += 1;

    // Count numberOfVisits if range is set
    if (customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) count += 1;

    return count;
  };

  // Get customer count for specific filter sections
  const getFilterSectionCount = (section: string) => {
    switch (section) {
      case 'customerType':
        return customFilters.customerType.length;
      case 'customerStatus':
        return customFilters.customerStatus.length;
      case 'numberOfVisits':
        return (customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) ? 1 : 0;
      case 'category':
        return customFilters.category.length;
      case 'customerBehaviour':
        let behaviourCount = 0;
        behaviourCount += customFilters.customerBehaviour.purchaseHistory.length;
        if (customFilters.customerBehaviour.engagementLevel) behaviourCount += 1;
        if (customFilters.customerBehaviour.visitFrequency) behaviourCount += 1;
        if (customFilters.customerBehaviour.lastActivity) behaviourCount += 1;
        if (customFilters.customerBehaviour.lifetimeValue) behaviourCount += 1;
        return behaviourCount;
      default:
        return 0;
    }
  };

  // Mock data for simplicity
  const totalUsers = 2847;

  // Calculate custom audience size based on filters
  const customAudienceSize = Math.max(1, Math.floor(totalUsers * (0.3 + Math.random() * 0.4)));

  // Stepper data

  const handleProceed = () => {
    const audienceData = {
      type: audienceType,
      totalUsers: audienceType === 'all' ? totalUsers : 0
    };
    sessionStorage.setItem('campaignAudience', JSON.stringify(audienceData));
    router.push(`/new-campaign/platform-budget?type=${campaignType}`);
    };

  const handleClose = () => {
    router.push('/campaigns');
    };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>

      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6]">
        <CampaignStepper currentStep={2} />

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
                  Choose Your Audience
                </h1>
          <p className="text-[#a1a1a1] text-[14px] mt-0.5">
            Select your target audience to maximize campaign impact
          </p>
        </div>

        {/* Audience Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* All Customers Card */}
          <div
            className={`bg-white border rounded-lg p-4 cursor-pointer ${
              audienceType === 'all'
                ? 'border-[#6E4EFF]'
                : 'border-[#e9e9e9]'
            }`}
            onClick={() => setAudienceType('all')}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[16px] font-bold text-[#2a2a2f]">All Customers</h3>
              <div className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                audienceType === 'all' ? 'bg-[#7856ff] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {totalUsers.toLocaleString()} customers
              </div>
            </div>
            <p className="text-[14px] text-[#626266] leading-relaxed mb-3">
              Reach your entire customer base with maximum coverage and comprehensive impact across all segments.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">2,420</div>
                <div className="text-[11px] text-[#626266]">Est. Reach</div>
              </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">85%</div>
                <div className="text-[11px] text-[#626266]">Coverage</div>
            </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">4.2x</div>
                <div className="text-[11px] text-[#626266]">Est. ROI</div>
          </div>
                </div>
              </div>

          {/* Custom Customers Card */}
          <div
            className={`bg-white border rounded-lg p-4 cursor-pointer ${
              audienceType === 'custom'
                ? 'border-[#6E4EFF]'
                : 'border-[#e9e9e9]'
            }`}
            onClick={() => setAudienceType('custom')}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[16px] font-bold text-[#2a2a2f]">Custom Customers</h3>
              <div className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                audienceType === 'custom' ? 'bg-[#7856ff] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                Custom size
              </div>
            </div>
            <p className="text-[14px] text-[#626266] leading-relaxed mb-3">
              Create targeted audiences using advanced filters for precise campaign targeting and higher engagement rates.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">Variable</div>
                <div className="text-[11px] text-[#626266]">Est. Reach</div>
                    </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">95%</div>
                <div className="text-[11px] text-[#626266]">Coverage</div>
                    </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">6.8x</div>
                <div className="text-[11px] text-[#626266]">Est. ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {audienceType === 'all' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-[14px] font-semibold text-blue-800 mb-2">All Customers Campaign</h4>
            <p className="text-[12px] text-blue-700">
              You&apos;re targeting all {totalUsers.toLocaleString()} customers in your database. This provides maximum reach and is perfect for general announcements, promotions, or brand awareness campaigns.
            </p>
          </div>
        )}

        {audienceType === 'custom' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h4 className="text-[14px] font-semibold text-purple-800 mb-2">Custom Audience Campaign</h4>
            <p className="text-[12px] text-purple-700">
              You can create a custom audience using filters in the next step. This allows for more precise targeting and typically results in higher engagement rates.
            </p>
          </div>
        )}

        {/* Custom Filter Interface */}
        {audienceType === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Filters Panel - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e9e9e9] rounded-lg p-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#2a2a2f]">Audience Filters</h3>
                    <p className="text-[#a1a1a1] text-[14px] mt-0.5">Define your target audience using advanced filters for precise campaign targeting</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#626266]">{getActiveFiltersCount()} filters active</span>
                <button
                      onClick={() => setCustomFilters({
                        customerType: [],
                        customerStatus: [],
                        numberOfVisits: { min: 0, max: 100 },
                        category: [],
                        customerBehaviour: {
                          purchaseHistory: [],
                          engagementLevel: '',
                          visitFrequency: '',
                          lastActivity: '',
                          lifetimeValue: ''
                        }
                      })}
                      className="text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* Customer Type Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerType')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#7856ff]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#7856ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Type</h4>
                          {getFilterSectionCount('customerType') > 0 && (
                            <span className="px-2 py-0.5 bg-[#7856ff] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerType')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Retained, new, returning customers</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerType') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedFilters.includes('customerType') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.customerType.map(type => (
                          <label key={type.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.customerType.includes(type.id)}
                                onChange={() => updateArrayFilter('customerType', type.id)}
                              />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{type.label}</div>
                                <div className="text-[11px] text-[#626266]">{type.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {type.id === 'retained' ? '1,847' : '1,000'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Status Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerStatus')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#04b440]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#04b440]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Status</h4>
                          {getFilterSectionCount('customerStatus') > 0 && (
                            <span className="px-2 py-0.5 bg-[#04b440] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerStatus')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Active, inactive, suspended</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerStatus') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                  {expandedFilters.includes('customerStatus') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.customerStatus.map(status => (
                          <label key={status.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.customerStatus.includes(status.id)}
                                onChange={() => updateArrayFilter('customerStatus', status.id)}
                              />
              </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{status.label}</div>
                                <div className="text-[11px] text-[#626266]">{status.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {status.id === 'active' ? '2,420' : '427'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
            </div>



                {/* Number of Visits Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('numberOfVisits')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#ffd700]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Number of Visits</h4>
                          {getFilterSectionCount('numberOfVisits') > 0 && (
                            <span className="px-2 py-0.5 bg-[#ffd700] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('numberOfVisits')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Visit frequency ranges</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('numberOfVisits') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedFilters.includes('numberOfVisits') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.numberOfVisits.ranges.map(range => (
                          <label key={range.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <input
                              type="radio"
                              name="numberOfVisits"
                              checked={customFilters.numberOfVisits.min === range.min && customFilters.numberOfVisits.max === range.max}
                              onChange={() => {
                                updateRangeFilter('numberOfVisits', 'min', range.min);
                                updateRangeFilter('numberOfVisits', 'max', range.max);
                              }}
                              className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{range.label}</div>
            </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {range.id === '1' ? '427' :
                                 range.id === '2-5' ? '1,284' :
                                 range.id === '6-10' ? '856' :
                                 range.id === '11-20' ? '171' :
                                 range.id === '21-50' ? '85' : '28'} customers
                              </span>
          </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('category')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#9c27b0]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#9c27b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Category</h4>
                          {getFilterSectionCount('category') > 0 && (
                            <span className="px-2 py-0.5 bg-[#9c27b0] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('category')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Product categories</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('category') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedFilters.includes('category') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filterOptions.category.map(cat => (
                          <label key={cat.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.category.includes(cat.id)}
                                onChange={() => updateArrayFilter('category', cat.id)}
                              />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{cat.label}</div>
                                <div className="text-[11px] text-[#626266]">{cat.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {cat.id === 'electronics' ? '856' :
                                 cat.id === 'clothing' ? '1,284' :
                                 cat.id === 'home_garden' ? '427' :
                                 cat.id === 'automotive' ? '285' :
                                 cat.id === 'health_beauty' ? '571' :
                                 cat.id === 'sports' ? '342' :
                                 cat.id === 'books' ? '213' :
                                 cat.id === 'movies' ? '156' :
                                 cat.id === 'music' ? '98' : '85'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
            )}
          </div>

                {/* Customer Behaviour Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerBehaviour')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#2196f3]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#2196f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Behaviour</h4>
                          {getFilterSectionCount('customerBehaviour') > 0 && (
                            <span className="px-2 py-0.5 bg-[#2196f3] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerBehaviour')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Purchase history, engagement, activity</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerBehaviour') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                                    {expandedFilters.includes('customerBehaviour') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-6">
                        {/* Purchase History */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Purchase History</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filterOptions.customerBehaviour.purchaseHistory.map(history => (
                              <label key={history.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <div className="relative mt-0.5">
                                  <CustomCheckbox
                                    checked={customFilters.customerBehaviour.purchaseHistory.includes(history.id)}
                                    onChange={() => {
                                      const newHistory = customFilters.customerBehaviour.purchaseHistory.includes(history.id)
                                        ? customFilters.customerBehaviour.purchaseHistory.filter(h => h !== history.id)
                                        : [...customFilters.customerBehaviour.purchaseHistory, history.id];
                                      updateFilter('customerBehaviour', 'purchaseHistory', newHistory);
                                    }}
                                  />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{history.label}</div>
                                    <div className="text-[10px] text-[#626266]">{history.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {history.id === 'last_30_days' ? '1,284' :
                                     history.id === 'last_3_months' ? '1,847' :
                                     history.id === 'last_6_months' ? '2,284' :
                                     history.id === 'last_year' ? '2,847' : '1,000'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Engagement Level */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Engagement Level</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.engagementLevel.map(level => (
                              <label key={level.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="engagementLevel"
                                  checked={customFilters.customerBehaviour.engagementLevel === level.id}
                                  onChange={() => updateFilter('customerBehaviour', 'engagementLevel', level.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{level.label}</div>
                                    <div className="text-[10px] text-[#626266]">{level.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {level.id === 'high' ? '856' :
                                     level.id === 'medium' ? '1,284' : '707'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Visit Frequency */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Visit Frequency</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.visitFrequency.map(frequency => (
                              <label key={frequency.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="visitFrequency"
                                  checked={customFilters.customerBehaviour.visitFrequency === frequency.id}
                                  onChange={() => updateFilter('customerBehaviour', 'visitFrequency', frequency.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{frequency.label}</div>
                                    <div className="text-[10px] text-[#626266]">{frequency.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {frequency.id === 'daily' ? '285' :
                                     frequency.id === 'weekly' ? '856' :
                                     frequency.id === 'monthly' ? '1,284' :
                                     frequency.id === 'quarterly' ? '427' : '571'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Last Activity */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-3">Last Activity</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.lastActivity.map(activity => (
                              <label key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="lastActivity"
                                  checked={customFilters.customerBehaviour.lastActivity === activity.id}
                                  onChange={() => updateFilter('customerBehaviour', 'lastActivity', activity.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{activity.label}</div>
                                    <div className="text-[10px] text-[#626266]">{activity.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {activity.id === 'today' ? '856' :
                                     activity.id === 'this_week' ? '1,284' :
                                     activity.id === 'this_month' ? '1,847' :
                                     activity.id === 'last_month' ? '427' : '71'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Lifetime Value */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-3">Lifetime Value</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            {filterOptions.customerBehaviour.lifetimeValue.map(value => (
                              <label key={value.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="lifetimeValue"
                                  checked={customFilters.customerBehaviour.lifetimeValue === value.id}
                                  onChange={() => updateFilter('customerBehaviour', 'lifetimeValue', value.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{value.label}</div>
                                    <div className="text-[10px] text-[#626266]">{value.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {value.id === 'high_value' ? '427' :
                                     value.id === 'medium_value' ? '1,284' :
                                     value.id === 'low_value' ? '1,847' : '285'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audience Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e9e9e9] rounded-lg overflow-hidden h-full sticky top-6">
                                  <div className="p-6 border-b border-[#e9e9e9]">
                    <h2 className="text-[16px] font-bold text-[#2a2a2f] mb-0.5">Audience Summary</h2>
                    <p className="text-[#a1a1a1] text-[14px] font-normal">Review your audience configuration before proceeding</p>
                  </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {/* Filters Applied */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[14px] font-semibold text-[#2a2a2f]">Filters Applied</h3>
                        <button
                          onClick={() => setFiltersExpanded(!filtersExpanded)}
                          className="flex items-center gap-1 text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:gap-2"
                        >
                          <span>{filtersExpanded ? 'Collapse' : 'Expand'}</span>
                          <svg
                            className={`w-4 h-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${filtersExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>


                                             {/* No Filters Applied - Show when closed or no filters */}
                       {(!filtersExpanded || getActiveFiltersCount() === 0) && (
                         <div className="mb-3">
                           <p className="text-[14px] text-[#626266] font-normal transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                            {getActiveFiltersCount() === 0 ? 'No filters applied' : `${getActiveFiltersCount()} filters applied`}
                          </p>
                        </div>
                      )}

                      {/* Separator */}
                      <div className="w-full h-px bg-[#e9e9e9] mb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                      <div className="space-y-3">
                        {getActiveFiltersCount() === 0 ? null : (
                          <div className={`space-y-3 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${filtersExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {/* Customer Types */}
                            {customFilters.customerType.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Customer Types</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerType.map(typeId => {
                                    const type = filterOptions.customerType.find(t => t.id === typeId);
                                    return (
                                      <div key={typeId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {type ? type.label : typeId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.12).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Customer Status */}
                            {customFilters.customerStatus.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Status Types</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerStatus.map(statusId => {
                                    const status = filterOptions.customerStatus.find(s => s.id === statusId);
                                    return (
                                      <div key={statusId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {status ? status.label : statusId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.15).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Visit Range */}
                            {(customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Visit Range</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• Between {customFilters.numberOfVisits.min} and {customFilters.numberOfVisits.max} visits</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.28).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Categories */}
                            {customFilters.category.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Categories</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.category.map(catId => {
                                    const category = filterOptions.category.find(c => c.id === catId);
                                    return (
                                      <div key={catId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {category ? category.label : catId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.08).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Purchase History */}
                            {customFilters.customerBehaviour.purchaseHistory.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Purchase Periods</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerBehaviour.purchaseHistory.map(periodId => {
                                    const period = filterOptions.customerBehaviour.purchaseHistory.find(p => p.id === periodId);
                                    return (
                                      <div key={periodId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {period ? period.label : periodId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.19).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Engagement Level */}
                            {customFilters.customerBehaviour.engagementLevel && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Engagement</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.engagementLevel}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.45).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Visit Frequency */}
                            {customFilters.customerBehaviour.visitFrequency && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Frequency</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.visitFrequency}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.33).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Last Activity */}
                            {customFilters.customerBehaviour.lastActivity && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Last Activity</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.lastActivity}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.41).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Lifetime Value */}
                            {customFilters.customerBehaviour.lifetimeValue && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Lifetime Value</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.lifetimeValue}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.27).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>



                     {/* Total Customer */}
                     <div className="text-center">
                       <h3 className="text-[14px] font-normal text-[#2a2a2f] mb-3">Total Customer</h3>
                       <div className="text-[24px] font-bold text-[#2a2a2f]">
                         {customAudienceSize.toLocaleString()}
                       </div>
                     </div>

                     {/* Separator */}
                     <div className="w-full h-px bg-[#e9e9e9]"></div>

                                          {/* AI Insights and Performance Metrics */}
                     <div>
                       <h3 className="text-[14px] font-semibold text-[#2a2a2f] mb-3">AI Insights & Performance</h3>
                       <div className="space-y-3">
                         {/* Engagement Prediction */}
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                           <div className="flex items-start gap-2">
                             <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                               </svg>
                             </div>
                             <div>
                               <h4 className="text-[14px] font-semibold text-blue-800 mb-1">Engagement Prediction</h4>
                               <p className="text-[14px] text-blue-700">High engagement expected with 78% open rate and 2.4x higher click-through rates</p>
                             </div>
                           </div>
                         </div>

                         {/* Performance Metrics */}
                         <div className="grid grid-cols-2 gap-3">
                           <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                             <div className="text-[16px] font-bold text-green-600">4.2x</div>
                             <div className="text-[14px] text-green-700">Avg. ROI</div>
                           </div>
                           <div className="text-center p-2 bg-purple-50 border border-purple-200 rounded">
                             <div className="text-[16px] font-bold text-purple-600">67%</div>
                             <div className="text-[14px] text-purple-700">Conversion Rate</div>
                           </div>
                         </div>


                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggested Audience Cards */}
        <div className="pt-6">
          <div className="bg-white border border-[#e9e9e9] rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[18px] font-semibold text-[#2a2a2f]">AI Suggested Audiences</h3>
            <div className="px-3 py-1 bg-[#7856ff]/10 text-[#7856ff] text-[12px] font-medium rounded-full">
              Recommended
            </div>
          </div>
          <p className="text-[#a1a1a1] text-[14px] mb-6">
            AI-powered audience recommendations based on your customer data and campaign goals
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Card 1: Inactive Users Reactivation */}
            <div
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_inactive'
                  ? 'border-[#ff6b35] bg-gradient-to-br from-[#ff6b35]/5 to-[#ff8a65]/5'
                  : 'border-gray-200 hover:border-[#ff6b35]/50 hover:bg-gradient-to-br hover:from-[#ff6b35]/2 hover:to-[#ff8a65]/2'
              }`}
              onClick={() => setAudienceType('ai_inactive')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_inactive' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff6b35] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">Inactive Users Reactivation</h4>
                    <span className="px-2 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-semibold rounded-full">
                      High Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: Critical</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Target users inactive for 30+ days with personalized reactivation campaigns.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#ff6b35]">45K</div>
                  <div className="text-[10px] text-[#626266]">Target Users</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">67%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">2.8x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_inactive'
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#ff6b35] group-hover:text-white'
              }`}>
                {audienceType === 'ai_inactive' ? 'Selected' : 'Select Audience'}
              </div>
            </div>

            {/* AI Card 2: VIP Customer Retention */}
            <div
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_vip'
                  ? 'border-[#9c27b0] bg-gradient-to-br from-[#9c27b0]/5 to-[#ba68c8]/5'
                  : 'border-gray-200 hover:border-[#9c27b0]/50 hover:bg-gradient-to-br hover:from-[#9c27b0]/2 hover:to-[#ba68c8]/2'
              }`}
              onClick={() => setAudienceType('ai_vip')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_vip' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9c27b0] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">VIP Customer Retention</h4>
                    <span className="px-2 py-1 bg-[#9c27b0]/10 text-[#9c27b0] text-[10px] font-semibold rounded-full">
                      Premium
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: High</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Re-engage high-value customers with exclusive offers and personalized experiences.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#9c27b0]">8.5K</div>
                  <div className="text-[10px] text-[#626266]">VIP Users</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">78%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">3.2x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_vip'
                  ? 'bg-[#9c27b0] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#9c27b0] group-hover:text-white'
              }`}>
                {audienceType === 'ai_vip' ? 'Selected' : 'Select Audience'}
              </div>
            </div>

            {/* AI Card 3: New Customers */}
            <div
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_cart'
                  ? 'border-[#10b981] bg-gradient-to-br from-[#10b981]/5 to-[#34d399]/5'
                  : 'border-gray-200 hover:border-[#10b981]/50 hover:bg-gradient-to-br hover:from-[#10b981]/2 hover:to-[#34d399]/2'
              }`}
              onClick={() => setAudienceType('ai_cart')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_cart' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">New Customers</h4>
                    <span className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-semibold rounded-full">
                      Growth
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: High</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Acquire new customers with targeted acquisition campaigns and welcome offers.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#10b981]">15K</div>
                  <div className="text-[10px] text-[#626266]">Potential</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">45%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">2.1x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_cart'
                  ? 'bg-[#10b981] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#10b981] group-hover:text-white'
              }`}>
                {audienceType === 'ai_cart' ? 'Selected' : 'Select Audience'}
              </div>
            </div>
          </div>

          {/* AI Insights Summary */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-blue-800 mb-2">Why These AI Suggestions?</h4>
                <ul className="text-[12px] text-blue-700 space-y-1">
                  <li>• <strong>Inactive Users:</strong> 67% return within 30 days of targeted campaigns, 2.8x higher ROI</li>
                  <li>• <strong>VIP Customers:</strong> 78% reactivation rate, 45% higher average order values</li>
                  <li>• <strong>Cart Abandonment:</strong> 82% recovery rate, 4.5x success with incentives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>

        <CampaignFooter
          onClose={handleClose}
          onNext={handleProceed}
          onPrevious={() => router.push(`/new-campaign?type=${campaignType}`)}
          nextLabel="Proceed to next step"
          showPrevious={true}
          saveMessage={`Audience: ${
                  audienceType === 'all' ? `All ${totalUsers.toLocaleString()} customers` :
                  audienceType === 'custom' ? 'Custom audience' :
                  audienceType === 'ai_inactive' ? 'AI: Inactive Users Reactivation' :
                  audienceType === 'ai_vip' ? 'AI: VIP Customer Retention' :
                  audienceType === 'ai_cart' ? 'AI: Cart Abandonment Recovery' :
                  'Custom audience'
          }`}
        />
      </div>
    </main>
  );
}
