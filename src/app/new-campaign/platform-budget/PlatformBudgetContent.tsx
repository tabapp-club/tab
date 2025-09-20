"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { CampaignStepper } from "@/components/campaign/CampaignStepper";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignHeader } from "@/components/campaign/CampaignHeader";
import { useCampaign, BudgetAllocation } from "@/contexts/CampaignContext";

import CustomCheckbox from "@/components/ui/CustomCheckbox";

// Custom Dropdown Components matching Data Center design
const DurationDropdown = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');

  const durationOptions = [
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 21, label: '21 days' },
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' }
  ];

  const selectedOption = durationOptions.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = (durationOptions.length * 40) + 60;

        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('up');
        } else {
          setDropdownPosition('down');
        }
      }
    };

    if (isOpen) {
      handleDropdownPosition();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white h-12 px-4 py-3 border border-[#e9e9e9] rounded-lg flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF]"
      >
        <span className="text-[14px] text-[#2a2a2f]">
          {selectedOption?.label || 'Select duration'}
        </span>
        <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
          <ChevronDownIcon />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border border-[#e9e9e9] rounded-lg z-50 w-full max-h-[300px] overflow-y-auto`}
          style={{ zIndex: 9999 }}
        >
          <div className="py-2">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-[#7856ff]/5 text-[#7856ff]' : 'text-[#2a2a2f]'
                }`}
              >
                <span className="text-[14px]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StrategyDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');

  const strategyOptions = [
    { value: 'equal', label: 'Equal Distribution' },
    { value: 'performance', label: 'Performance Based' },
    { value: 'cost', label: 'Cost Based' },
    { value: 'manual', label: 'Manual Allocation' }
  ];

  const selectedOption = strategyOptions.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = (strategyOptions.length * 40) + 60;

        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('up');
        } else {
          setDropdownPosition('down');
        }
      }
    };

    if (isOpen) {
      handleDropdownPosition();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white h-12 px-4 py-3 border border-[#e9e9e9] rounded-lg flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF]"
      >
        <span className="text-[14px] text-[#2a2a2f]">
          {selectedOption?.label || 'Select strategy'}
        </span>
        <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
          <ChevronDownIcon />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 bg-white border border-[#e9e9e9] rounded-lg z-50 w-full max-h-[300px] overflow-y-auto`}
          style={{ zIndex: 9999 }}
        >
          <div className="py-2">
            {strategyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-[#7856ff]/5 text-[#7856ff]' : 'text-[#2a2a2f]'
                }`}
              >
                <span className="text-[14px]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronDownIcon = () => (
  <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Stepper Component
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
const StepperProgressBar = ({ currentStep = 4, totalSteps = 5 }: { currentStep?: number; totalSteps?: number }) => {
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

export function PlatformBudgetContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get('type') || 'advertise';

  const {
    campaignData,
    selectedPlatforms,
    togglePlatform,
    updateBudget,
    calculateBudgetAllocations
  } = useCampaign();

  // Local state for form inputs
  const [budgetInputs, setBudgetInputs] = useState({
    total: campaignData.budget.total,
    daily: campaignData.budget.daily,
    expectedReach: campaignData.budget.expectedReach,
    allocationStrategy: 'equal' as 'equal' | 'performance' | 'cost' | 'manual',
    duration: 14
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedBudgetType, setSelectedBudgetType] = useState<'conservative' | 'balanced' | 'aggressive' | 'custom'>('balanced');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [platformsExpanded, setPlatformsExpanded] = useState(false);
  const [budgetExpanded, setBudgetExpanded] = useState(false);
  const [audienceExpanded, setAudienceExpanded] = useState(false);

  // Filter options for display
  const filterOptions = {
    customerType: [
      { id: 'retained', label: 'Retained', description: 'Long-term customers' },
      { id: 'new', label: 'New', description: 'Recently acquired customers' }
    ],
    customerStatus: [
      { id: 'active', label: 'Active', description: 'Currently engaged customers' },
      { id: 'inactive', label: 'Inactive', description: 'Not recently engaged' }
    ],
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

  // Helper function to get active filters count
  const getActiveFiltersCount = () => {
    // TODO: Implement filters count when filters are added to CampaignData interface
    return 0;
  };

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;


  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedPlatforms.length === 0) {
      newErrors.platforms = 'Please select at least one platform';
    }

    if (budgetInputs.total <= 0) {
      newErrors.total = 'Total budget must be greater than 0';
    }

    if (budgetInputs.daily <= 0) {
      newErrors.daily = 'Daily budget must be greater than 0';
    }

    if (budgetInputs.daily > budgetInputs.total) {
      newErrors.daily = 'Daily budget cannot exceed total budget';
    }

    if (budgetInputs.expectedReach <= 0) {
      newErrors.expectedReach = 'Expected reach must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle budget input changes
  const handleBudgetChange = (field: string, value: number | string) => {
    setBudgetInputs(prev => ({ ...prev, [field]: value }));
    setSelectedBudgetType('custom');

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Calculate budget allocations with different strategies
  const calculateBudgetAllocationsWithStrategy = () => {
    const selectedPlatformsData = campaignData.platforms.filter(p =>
      selectedPlatforms.includes(p.id)
    );

    if (selectedPlatformsData.length === 0) return;

    const strategy = budgetInputs.allocationStrategy || 'equal';
    let allocations: BudgetAllocation[] = [];

    switch (strategy) {
      case 'equal':
        // Equal distribution across all platforms
        const equalAmount = budgetInputs.total / selectedPlatformsData.length;
        const equalPercentage = 100 / selectedPlatformsData.length;
        allocations = selectedPlatformsData.map(platform => ({
          platformId: platform.id,
          amount: Math.round(equalAmount),
          percentage: Math.round(equalPercentage)
        }));
        break;

      case 'performance':
        // Performance-based allocation (higher rating = more budget)
        const totalRating = selectedPlatformsData.reduce((sum, platform) => sum + platform.rating, 0);
        allocations = selectedPlatformsData.map(platform => {
          const percentage = (platform.rating / totalRating) * 100;
          const amount = (budgetInputs.total * percentage) / 100;
          return {
            platformId: platform.id,
            amount: Math.round(amount),
            percentage: Math.round(percentage)
          };
        });
        break;

      case 'cost':
        // Cost-based allocation (inverse of cost - lower cost gets more budget)
        const totalInverseCost = selectedPlatformsData.reduce((sum, platform) =>
          sum + (1 / platform.costPerMessage), 0
        );
        allocations = selectedPlatformsData.map(platform => {
          const inverseCost = 1 / platform.costPerMessage;
          const percentage = (inverseCost / totalInverseCost) * 100;
          const amount = (budgetInputs.total * percentage) / 100;
          return {
            platformId: platform.id,
            amount: Math.round(amount),
            percentage: Math.round(percentage)
          };
        });
        break;

      case 'manual':
        // Manual allocation - use current allocations or equal distribution
        const currentAllocations = campaignData.budget.allocations;
        if (currentAllocations.length > 0) {
          allocations = currentAllocations;
        } else {
          const equalAmount = budgetInputs.total / selectedPlatformsData.length;
          const equalPercentage = 100 / selectedPlatformsData.length;
          allocations = selectedPlatformsData.map(platform => ({
            platformId: platform.id,
            amount: Math.round(equalAmount),
            percentage: Math.round(equalPercentage)
          }));
        }
        break;

      default:
        // Fallback to equal distribution
        const fallbackAmount = budgetInputs.total / selectedPlatformsData.length;
        const fallbackPercentage = 100 / selectedPlatformsData.length;
        allocations = selectedPlatformsData.map(platform => ({
          platformId: platform.id,
          amount: Math.round(fallbackAmount),
          percentage: Math.round(fallbackPercentage)
        }));
    }

    // Update campaign budget with new allocations
    updateBudget({ allocations });
  };

  // Handle manual allocation changes
  const handleManualAllocationChange = (platformId: string, field: 'amount' | 'percentage', value: number) => {
    const currentAllocations = [...campaignData.budget.allocations];
    const allocationIndex = currentAllocations.findIndex(a => a.platformId === platformId);

    if (allocationIndex === -1) {
      // Create new allocation if it doesn't exist
      const platform = campaignData.platforms.find(p => p.id === platformId);
      if (!platform) return;

      currentAllocations.push({
        platformId,
        amount: field === 'amount' ? value : 0,
        percentage: field === 'percentage' ? value : 0
      });
    } else {
      // Update existing allocation
      if (field === 'amount') {
        currentAllocations[allocationIndex].amount = value;
        // Recalculate percentage based on total budget
        const totalBudget = budgetInputs.total;
        currentAllocations[allocationIndex].percentage = totalBudget > 0 ? Math.round((value / totalBudget) * 100) : 0;
      } else {
        currentAllocations[allocationIndex].percentage = value;
        // Recalculate amount based on percentage
        const totalBudget = budgetInputs.total;
        currentAllocations[allocationIndex].amount = Math.round((value / 100) * totalBudget);
      }
    }

    // Update allocations
    updateBudget({ allocations: currentAllocations });
  };

  // Handle equalize allocation
  const handleEqualizeAllocation = () => {
    const equalAmount = budgetInputs.total / selectedPlatforms.length;
    const equalPercentage = 100 / selectedPlatforms.length;

    const equalizedAllocations = selectedPlatforms.map(platformId => ({
      platformId,
      amount: Math.round(equalAmount),
      percentage: Math.round(equalPercentage)
    }));

    updateBudget({ allocations: equalizedAllocations });
  };

  // Handle reset allocation
  const handleResetAllocation = () => {
    // Reset to equal distribution
    handleEqualizeAllocation();
  };

  // Handle suggested budget selection
  const handleSuggestedBudget = (type: 'conservative' | 'balanced' | 'aggressive') => {
    const budgets = {
      conservative: { total: 2500, daily: 250 },
      balanced: { total: 5000, daily: 500 },
      aggressive: { total: 10000, daily: 1000 }
    };

    const budget = budgets[type];
    setBudgetInputs(prev => ({ ...prev, ...budget }));
    setSelectedBudgetType(type);
    updateBudget(budget);
  };

  // Calculate budget allocations when platforms, budget, or allocation strategy changes
  useEffect(() => {
    calculateBudgetAllocationsWithStrategy();
  }, [selectedPlatforms, budgetInputs.total, budgetInputs.allocationStrategy]);

  // Update campaign budget when inputs change
  useEffect(() => {
    updateBudget(budgetInputs);
  }, [budgetInputs]);

  const handleProceed = () => {
    if (!validateForm()) {
      return;
    }

    // Update final budget data
    updateBudget(budgetInputs);
    calculateBudgetAllocationsWithStrategy();

    router.push(`/new-campaign/create?type=${campaignType}`);
  };

  return (
    <main className="flex-1 transition-sidebar overflow-y-auto main-content">
      <CampaignHeader onBack={() => router.push('/campaigns')} />
      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6] pt-16 lg:pt-4 relative">
        <CampaignStepper currentStep={3} />

        {/* Main Title */}
        <div className="mb-6 hidden lg:block">
          <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
            Choose Your Platform & Set Budget
              </h1>
          <p className="text-[#a1a1a1] text-[14px] mt-[2px]">
            Compare platforms and select the best channels for your campaign
          </p>
            </div>

        {/* Platform Comparison Section */}
        <section className="mb-8">
          <div className="bg-white border border-[#e9e9e9] rounded-lg overflow-hidden">
            {/* Platform Comparison Table */}
            <div className="p-6">
              {errors.platforms && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[14px] text-red-600">{errors.platforms}</p>
          </div>
              )}
              
              {/* Mobile Card Layout */}
              <div className="lg:hidden space-y-4">
                {/* Tab Platform Card */}
                <div className={`border rounded-lg p-4 transition-all ${
                  selectedPlatforms.includes('tab') 
                    ? 'border-[#7856ff] bg-[#7856ff]/5' 
                    : 'border-[#e9e9e9] bg-white hover:border-[#7856ff]/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#7856ff] rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
                          <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-[18px] font-semibold text-[#2a2a2f]">Tab</div>
                        <div className="text-[14px] text-[#a1a1a1]">High engagement</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-[14px] font-semibold text-[#2a2a2f]">4.0/5</div>
                          <div className="text-[12px] text-[#a1a1a1]">• 2.1k reviews</div>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      checked={selectedPlatforms.includes('tab')}
                      onChange={() => togglePlatform('tab')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">₹0.02</div>
                      <div className="text-[12px] text-[#a1a1a1]">per message</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">85%</div>
                      <div className="text-[12px] text-[#a1a1a1]">open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#7856ff]/10 text-[#7856ff]">Rich Media</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#7856ff]/10 text-[#7856ff]">Interactive</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#7856ff]/10 text-[#7856ff]">Analytics</span>
                  </div>
                </div>

                {/* WhatsApp Platform Card */}
                <div className={`border rounded-lg p-4 transition-all ${
                  selectedPlatforms.includes('whatsapp') 
                    ? 'border-[#25D366] bg-[#25D366]/5' 
                    : 'border-[#e9e9e9] bg-white hover:border-[#25D366]/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#25D366] rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-[18px] font-semibold text-[#2a2a2f]">WhatsApp</div>
                        <div className="text-[14px] text-[#a1a1a1]">Global reach</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-[14px] font-semibold text-[#2a2a2f]">4.2/5</div>
                          <div className="text-[12px] text-[#a1a1a1]">• 5.8k reviews</div>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      checked={selectedPlatforms.includes('whatsapp')}
                      onChange={() => togglePlatform('whatsapp')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">₹0.05</div>
                      <div className="text-[12px] text-[#a1a1a1]">per message</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">90%</div>
                      <div className="text-[12px] text-[#a1a1a1]">open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#25D366]/10 text-[#25D366]">Global</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#25D366]/10 text-[#25D366]">Rich Media</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#25D366]/10 text-[#25D366]">Verified</span>
                  </div>
                </div>

                {/* SMS Platform Card */}
                <div className={`border rounded-lg p-4 transition-all ${
                  selectedPlatforms.includes('sms') 
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5' 
                    : 'border-[#e9e9e9] bg-white hover:border-[#FF6B35]/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
                          <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-[18px] font-semibold text-[#2a2a2f]">SMS</div>
                        <div className="text-[14px] text-[#a1a1a1]">Universal delivery</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-[14px] font-semibold text-[#2a2a2f]">3.8/5</div>
                          <div className="text-[12px] text-[#a1a1a1]">• 1.2k reviews</div>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      checked={selectedPlatforms.includes('sms')}
                      onChange={() => togglePlatform('sms')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">₹0.03</div>
                      <div className="text-[12px] text-[#a1a1a1]">per message</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">95%</div>
                      <div className="text-[12px] text-[#a1a1a1]">open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#FF6B35]/10 text-[#FF6B35]">Universal</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#FF6B35]/10 text-[#FF6B35]">Reliable</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#FF6B35]/10 text-[#FF6B35]">Instant</span>
                  </div>
                </div>

                {/* Email Platform Card */}
                <div className={`border rounded-lg p-4 transition-all ${
                  selectedPlatforms.includes('email') 
                    ? 'border-[#4285F4] bg-[#4285F4]/5' 
                    : 'border-[#e9e9e9] bg-white hover:border-[#4285F4]/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#4285F4] rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-[18px] font-semibold text-[#2a2a2f]">Email</div>
                        <div className="text-[14px] text-[#a1a1a1]">Cost effective</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-[14px] font-semibold text-[#2a2a2f]">3.5/5</div>
                          <div className="text-[12px] text-[#a1a1a1]">• 3.4k reviews</div>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      checked={selectedPlatforms.includes('email')}
                      onChange={() => togglePlatform('email')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">₹0.01</div>
                      <div className="text-[12px] text-[#a1a1a1]">per message</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-[16px] font-bold text-[#2a2a2f]">25%</div>
                      <div className="text-[12px] text-[#a1a1a1]">open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#4285F4]/10 text-[#4285F4]">Cost Effective</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#4285F4]/10 text-[#4285F4]">Rich Content</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#4285F4]/10 text-[#4285F4]">Analytics</span>
                  </div>
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="platform-table-header bg-white">
                      <th className="px-4 py-3 text-left text-[14px] font-semibold text-[#2a2a2f]">Platform</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Cost/Message</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Open Rate</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Click Rate</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Rating</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Features</th>
                      <th className="px-4 py-3 text-center text-[14px] font-semibold text-[#2a2a2f]">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e9e9e9]">
                    {/* Tab Platform - Rank 1 */}
                    <tr className="bg-[#7856ff]/5 hover:bg-[#7856ff]/10 transition-colors border-l-4 border-l-[#7856ff]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#7856ff] rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
                              <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold text-[#2a2a2f]">Tab</div>
                            <div className="text-[12px] text-[#a1a1a1]">High engagement</div>
                          </div>
                        </div>
                                             </td>
                       <td className="px-4 py-4 text-center">
                        <div className="text-[#2a2a2f] text-[16px] font-bold">₹0.02</div>
                        <div className="text-[12px] text-[#a1a1a1]">per message</div>
                      </td>
                                             <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">85%</div>
                         <div className="text-[12px] text-[#a1a1a1]">excellent</div>
                       </td>
                       <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">12%</div>
                         <div className="text-[12px] text-[#a1a1a1]">high</div>
                       </td>
                                              <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">4.0/5</div>
                         <div className="text-[10px] text-[#a1a1a1]">2.1k reviews</div>
                       </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Rich Media</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Interactive</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Analytics</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <div className="flex justify-center items-center">
                          <CustomCheckbox
                          checked={selectedPlatforms.includes('tab')}
                          onChange={() => togglePlatform('tab')}
                        />
                        </div>
                      </td>
                    </tr>

                    {/* WhatsApp Platform - Rank 2 */}
                    <tr className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold text-[#2a2a2f]">WhatsApp</div>
                            <div className="text-[12px] text-[#a1a1a1]">Global reach</div>
                          </div>
                        </div>
                                             </td>
                       <td className="px-4 py-4 text-center">
                        <div className="text-[#2a2a2f] text-[16px] font-bold">₹0.05</div>
                        <div className="text-[12px] text-[#a1a1a1]">per message</div>
                      </td>
                                             <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">90%</div>
                         <div className="text-[12px] text-[#a1a1a1]">excellent</div>
                       </td>
                       <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">8%</div>
                         <div className="text-[12px] text-[#a1a1a1]">good</div>
                       </td>
                                              <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">4.2/5</div>
                         <div className="text-[10px] text-[#a1a1a1]">5.8k reviews</div>
                       </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Global</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Rich Media</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Verified</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <div className="flex justify-center items-center">
                          <CustomCheckbox
                          checked={selectedPlatforms.includes('whatsapp')}
                          onChange={() => togglePlatform('whatsapp')}
                        />
                        </div>
                      </td>
                    </tr>

                    {/* SMS Platform - Rank 3 */}
                    <tr className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
                              <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold text-[#2a2a2f]">SMS</div>
                            <div className="text-[12px] text-[#a1a1a1]">Universal delivery</div>
                          </div>
                        </div>
                                             </td>
                       <td className="px-4 py-4 text-center">
                        <div className="text-[#2a2a2f] text-[16px] font-bold">₹0.03</div>
                        <div className="text-[12px] text-[#a1a1a1]">per message</div>
                      </td>
                                             <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">95%</div>
                         <div className="text-[12px] text-[#a1a1a1]">excellent</div>
                       </td>
                       <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">3%</div>
                         <div className="text-[12px] text-[#a1a1a1]">low</div>
                       </td>
                                              <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">3.5/5</div>
                         <div className="text-[10px] text-[#a1a1a1]">1.2k reviews</div>
                       </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Universal</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Instant</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#a1a1a1]/10 text-[#a1a1a1]">Basic</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <div className="flex justify-center items-center">
                          <CustomCheckbox
                          checked={selectedPlatforms.includes('sms')}
                          onChange={() => togglePlatform('sms')}
                        />
                        </div>
                      </td>
                    </tr>

                    {/* Email Platform - Rank 4 */}
                    <tr className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
            </svg>
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold text-[#2a2a2f]">Email</div>
                            <div className="text-[12px] text-[#a1a1a1]">Cost effective</div>
                          </div>
                        </div>
                                             </td>
                       <td className="px-4 py-4 text-center">
                        <div className="text-[#2a2a2f] text-[16px] font-bold">₹0.01</div>
                        <div className="text-[12px] text-[#a1a1a1]">per message</div>
                      </td>
                                             <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">25%</div>
                         <div className="text-[12px] text-[#a1a1a1]">average</div>
                       </td>
                       <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">2.5%</div>
                         <div className="text-[12px] text-[#a1a1a1]">low</div>
                       </td>
                                              <td className="px-4 py-4 text-center">
                         <div className="text-[16px] font-semibold text-[#2a2a2f]">3.8/5</div>
                         <div className="text-[10px] text-[#a1a1a1]">3.4k reviews</div>
                       </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Cost Effective</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Rich Content</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-[#2a2a2f]/10 text-[#2a2a2f]">Analytics</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <div className="flex justify-center items-center">
                          <CustomCheckbox
                          checked={selectedPlatforms.includes('email')}
                          onChange={() => togglePlatform('email')}
              />
            </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
          </div>
            </div>
          </div>
        </section>

        {/* Budget Configuration Section */}
        <section className="mb-8">
          <div className="bg-white border border-[#e9e9e9] rounded-lg overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden p-4 border-b border-[#e9e9e9]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#2a2a2f] mb-1">Budget Configuration</h2>
                  <p className="text-[#a1a1a1] text-[14px]">Set your campaign budget and spending limits</p>
                </div>
                <button
                  onClick={() => setSelectedBudgetType(selectedBudgetType === 'custom' ? 'balanced' : 'custom')}
                  className="h-9 px-4 py-1 rounded font-semibold text-[12px] bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white hover:from-[#5D3EE8] hover:to-[#7A59FF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/50"
                >
                  {selectedBudgetType === 'custom' ? 'AI Budgets' : 'Custom'}
                </button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block p-4 border-b border-[#e9e9e9]">
              <div className="flex items-center justify-between mb-0">
                <div>
                <h2 className="text-[18px] font-semibold text-[#2a2a2f]">Budget Configuration</h2>
                  <p className="text-[#a1a1a1] text-[14px] mt-0">Set your campaign budget and spending limits</p>
                </div>
                <button
                  onClick={() => setSelectedBudgetType(selectedBudgetType === 'custom' ? 'balanced' : 'custom')}
                  className="h-9 px-6 py-1 rounded font-semibold text-[14px] bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] focus:ring-[#6E4EFF]/50 active:scale-[0.98] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap relative overflow-hidden"
                >
                  {selectedBudgetType === 'custom' ? 'Try AI Suggested Budgets' : 'Create Custom Budget'}
                </button>
              </div>
        </div>

            <div className="p-6">
              {/* Budget Section - Toggle between Suggested and Custom */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f]">
                    {selectedBudgetType === 'custom' ? 'Custom Budget' : 'Suggested Budgets'}
                  </h3>
                  {selectedBudgetType !== 'custom' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#04b440] rounded-full"></div>
                      <span className="text-[12px] text-[#04b440] font-medium">Based on your selections</span>
                    </div>
                  )}
                </div>

                {selectedBudgetType === 'custom' ? (
                  // Custom Budget Input Fields
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Total Campaign Budget */}
                      <div>
                        <label className="block text-[14px] font-medium text-[#2a2a2f] mb-2">
                          Total Campaign Budget
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a1] text-[14px]">₹</span>
                          <input
                            type="number"
                            value={budgetInputs.total}
                            onChange={(e) => handleBudgetChange('total', parseFloat(e.target.value) || 0)}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 transition-colors ${
                              errors.total ? 'border-red-500' : 'border-[#e9e9e9] focus:border-[#6E4EFF] hover:border-[#d1d5db]'
                            }`}
                            placeholder="Enter total budget"
                          />
                        </div>
                        {errors.total && (
                          <p className="text-red-500 text-[12px] mt-1">{errors.total}</p>
                        )}
                      </div>

                      {/* Daily Budget Limit */}
                      <div>
                        <label className="block text-[14px] font-medium text-[#2a2a2f] mb-2">
                          Daily Budget Limit
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a1] text-[14px]">₹</span>
                          <input
                            type="number"
                            value={budgetInputs.daily}
                            onChange={(e) => handleBudgetChange('daily', parseFloat(e.target.value) || 0)}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 transition-colors ${
                              errors.daily ? 'border-red-500' : 'border-[#e9e9e9] focus:border-[#6E4EFF] hover:border-[#d1d5db]'
                            }`}
                            placeholder="Enter daily limit"
                          />
                        </div>
                        {errors.daily && (
                          <p className="text-red-500 text-[12px] mt-1">{errors.daily}</p>
                        )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Campaign Duration */}
                      <div>
                        <label className="block text-[14px] font-medium text-[#2a2a2f] mb-2">
                          Campaign Duration (Days)
                        </label>
                        <DurationDropdown
                          value={budgetInputs.duration || 14}
                          onChange={(value) => handleBudgetChange('duration', value)}
                        />
                      </div>

                      {/* Budget Allocation Strategy */}
                      <div>
                        <label className="block text-[14px] font-medium text-[#2a2a2f] mb-2">
                          Budget Allocation Strategy
                        </label>
                        <StrategyDropdown
                          value={budgetInputs.allocationStrategy || 'equal'}
                          onChange={(value) => handleBudgetChange('allocationStrategy', value)}
                        />

                        {/* Strategy Description */}
                        <div className="mt-2 p-3 bg-[#f6f6f6] border border-[#e9e9e9] rounded-lg">
                          <p className="text-[12px] text-[#626266] mb-2">
                            {budgetInputs.allocationStrategy === 'equal' && "Budget distributed equally across all selected platforms"}
                            {budgetInputs.allocationStrategy === 'performance' && "Higher budget allocation to platforms with better performance ratings"}
                            {budgetInputs.allocationStrategy === 'cost' && "More budget allocated to cost-effective platforms"}
                            {budgetInputs.allocationStrategy === 'manual' && "Custom budget allocation based on your preferences"}
                          </p>

                          {/* Manual Allocation Editor */}
                          {budgetInputs.allocationStrategy === 'manual' && (
                            <div className="mt-3 space-y-3 bg-white border border-[#e9e9e9] rounded-lg p-3">
                              <div className="flex items-center justify-between text-[12px] text-[#2a2a2f] font-medium mb-3">
                                <span>Manual Budget Allocation</span>
                                <span className="text-[#2a2a2f]">
                                  Total: ₹{campaignData.budget.allocations.reduce((sum, alloc) => sum + alloc.amount, 0).toLocaleString()}
                                </span>
                              </div>

                              {selectedPlatforms.map(platformId => {
                                const platform = campaignData.platforms.find(p => p.id === platformId);
                                const allocation = campaignData.budget.allocations.find(a => a.platformId === platformId);
                                if (!platform) return null;

                                const currentAmount = allocation?.amount || 0;
                                const currentPercentage = allocation?.percentage || 0;

                                return (
                                  <div key={platformId} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[12px] text-[#2a2a2f] font-medium">{platform.name}</span>
                                      <span className="text-[10px] text-[#a1a1a1]">₹{platform.costPerMessage.toFixed(2)} per message</span>
                      </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[10px] text-[#a1a1a1] mb-1">Amount (₹)</label>
                                        <input
                                          type="number"
                                          value={currentAmount}
                                          onChange={(e) => handleManualAllocationChange(platformId, 'amount', parseFloat(e.target.value) || 0)}
                                          className="w-full px-2 py-1 text-[12px] border border-[#e9e9e9] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF] hover:border-[#d1d5db] transition-colors"
                                          placeholder="0"
                                        />
                    </div>
                                      <div>
                                        <label className="block text-[10px] text-[#a1a1a1] mb-1">Percentage (%)</label>
                                        <input
                                          type="number"
                                          value={currentPercentage}
                                          onChange={(e) => handleManualAllocationChange(platformId, 'percentage', parseFloat(e.target.value) || 0)}
                                          className="w-full px-2 py-1 text-[12px] border border-[#e9e9e9] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF] hover:border-[#d1d5db] transition-colors"
                                          placeholder="0"
                                          max="100"
                                        />
                  </div>
                </div>
                </div>
                                );
                              })}

                              {/* Quick Actions */}
                              <div className="flex gap-2 pt-3 border-t border-[#e9e9e9]">
                                <button
                                  onClick={handleEqualizeAllocation}
                                  className="text-[12px] text-[#6E4EFF] hover:text-[#5A3FE6] font-medium px-3 py-1 rounded hover:bg-[#6E4EFF]/5 transition-colors"
                                >
                                  Equalize All
                                </button>
                                <button
                                  onClick={handleResetAllocation}
                                  className="text-[12px] text-[#a1a1a1] hover:text-[#2a2a2f] font-medium px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                                >
                                  Reset
                                </button>
                              </div>
                  </div>
                          )}

                          {/* Current Allocation Preview (for non-manual strategies) */}
                          {budgetInputs.allocationStrategy !== 'manual' && campaignData.budget.allocations.length > 0 && (
                            <div className="mt-3 bg-white border border-[#e9e9e9] rounded-lg p-3">
                              <div className="space-y-2">
                                {campaignData.budget.allocations.map(allocation => {
                                  const platform = campaignData.platforms.find(p => p.id === allocation.platformId);
                                  if (!platform) return null;

                                  return (
                                    <div key={allocation.platformId} className="flex justify-between text-[12px] py-1">
                                      <span className="text-[#2a2a2f]">{platform.name}:</span>
                                      <span className="text-[#2a2a2f] font-medium">
                                        ₹{allocation.amount.toLocaleString()} ({allocation.percentage}%)
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                </div>
              </div>
                    </div>

                    {/* Back to Suggested Budgets Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => setSelectedBudgetType('balanced')}
                        className="h-9 px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[14px] text-[#6E4EFF] bg-white hover:bg-[#6E4EFF]/5 hover:border-[#6E4EFF]/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF]"
                      >
                        Back to Suggested Budgets
                      </button>
                    </div>
                  </div>
                ) : (
                  // Suggested Budgets Cards - Mobile Optimized
                  <div className="space-y-4">
                    {/* Conservative Budget - Mobile Card */}
                    <div
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        selectedBudgetType === 'conservative'
                          ? 'border-[#7856ff] bg-[#7856ff]/5'
                          : 'border-[#e9e9e9] hover:border-[#7856ff] hover:bg-[#f8f9fa]'
                      }`}
                      onClick={() => handleSuggestedBudget('conservative')}
                    >
                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[16px] font-bold text-[#2a2a2f]">Conservative</h3>
                              <span className="px-2 py-1 bg-[#04b440]/10 text-[#04b440] text-[10px] font-medium rounded-full uppercase tracking-wide">Low Risk</span>
                            </div>
                            <p className="text-[14px] text-[#626266] mb-3">Perfect for testing market response with minimal investment</p>
                            
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Audience</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">~2.5K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Reach</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#04b440]">3.2%</div>
                                <div className="text-[11px] text-[#a1a1a1]">Conversion</div>
                              </div>
                            </div>
                            
                            {/* Budget Display */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-[18px] font-bold text-[#2a2a2f]">₹2,500</div>
                                <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedBudgetType === 'conservative'
                                  ? 'border-[#7856ff] bg-[#7856ff]'
                                  : 'border-[#e9e9e9]'
                              }`}>
                                {selectedBudgetType === 'conservative' && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:block">
                      <div className="flex items-center justify-between">
                        {/* Left Side - Strategy Info */}
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-[14px] font-bold text-[#2a2a2f]">Conservative</h3>
                              <span className="px-2 py-1 bg-[#04b440]/10 text-[#04b440] text-[10px] font-medium rounded-full uppercase tracking-wide">Low Risk</span>
                </div>
                            <p className="text-[14px] text-[#626266]">Perfect for testing market response with minimal investment</p>
                  </div>
                </div>

                        {/* Right Side - Budget & Metrics */}
                        <div className="flex items-center gap-6">
                          {/* Key Metrics */}
                          <div className="flex gap-4">
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Total Audience</div>
              </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">~2.5K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Expected Reach</div>
                            </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#04b440]">3.2%</div>
                              <div className="text-[11px] text-[#a1a1a1]">Conversion Rate</div>
                            </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
            </div>

                          {/* Budget */}
                          <div className="text-center">
                            <div className="text-[14px] font-bold text-[#2a2a2f]">₹2,500</div>
                            <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                          </div>

                          {/* Selection Indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedBudgetType === 'conservative'
                              ? 'border-[#7856ff] bg-[#7856ff]'
                              : 'border-[#e9e9e9]'
                          }`}>
                            {selectedBudgetType === 'conservative' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                              </svg>
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Balanced Budget - Mobile Card */}
                    <div
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        selectedBudgetType === 'balanced'
                          ? 'border-[#7856ff] bg-[#7856ff]/5'
                          : 'border-[#e9e9e9] hover:border-[#7856ff] hover:bg-[#f8f9fa]'
                      }`}
                      onClick={() => handleSuggestedBudget('balanced')}
                    >
                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[16px] font-bold text-[#2a2a2f]">Balanced</h3>
                              <span className="px-2 py-1 bg-[#7856ff]/10 text-[#7856ff] text-[10px] font-medium rounded-full uppercase tracking-wide">Medium Risk</span>
                            </div>
                            <p className="text-[14px] text-[#626266] mb-3">Optimal balance of reach and performance for scaling businesses</p>
                            
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Audience</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">~5.2K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Reach</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#04b440]">4.8%</div>
                                <div className="text-[11px] text-[#a1a1a1]">Conversion</div>
                              </div>
                            </div>
                            
                            {/* Budget Display */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-[18px] font-bold text-[#2a2a2f]">₹5,000</div>
                                <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedBudgetType === 'balanced'
                                  ? 'border-[#7856ff] bg-[#7856ff]'
                                  : 'border-[#e9e9e9]'
                              }`}>
                                {selectedBudgetType === 'balanced' && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:block">
                      <div className="flex items-center justify-between">
                        {/* Left Side - Strategy Info */}
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-[14px] font-bold text-[#2a2a2f]">Balanced</h3>
                              <span className="px-2 py-1 bg-[#7856ff]/10 text-[#7856ff] text-[10px] font-medium rounded-full uppercase tracking-wide">Medium Risk</span>
                            </div>
                            <p className="text-[14px] text-[#626266]">Optimal balance of reach and performance for scaling businesses</p>
                          </div>
                        </div>

                        {/* Right Side - Budget & Metrics */}
                        <div className="flex items-center gap-6">
                          {/* Key Metrics */}
                          <div className="flex gap-4">
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Total Audience</div>
                            </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">~5.2K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Expected Reach</div>
                            </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#04b440]">4.8%</div>
                              <div className="text-[11px] text-[#a1a1a1]">Conversion Rate</div>
                            </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                          </div>

                          {/* Budget */}
                          <div className="text-center">
                            <div className="text-[14px] font-bold text-[#2a2a2f]">₹5,000</div>
                            <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                          </div>

                          {/* Selection Indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedBudgetType === 'balanced'
                              ? 'border-[#7856ff] bg-[#7856ff]'
                              : 'border-[#e9e9e9]'
                          }`}>
                            {selectedBudgetType === 'balanced' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                              </svg>
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aggressive Budget - Mobile Card */}
                    <div
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        selectedBudgetType === 'aggressive'
                          ? 'border-[#7856ff] bg-[#7856ff]/5'
                          : 'border-[#e9e9e9] hover:border-[#7856ff] hover:bg-[#f8f9fa]'
                      }`}
                      onClick={() => handleSuggestedBudget('aggressive')}
                    >
                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[16px] font-bold text-[#2a2a2f]">Aggressive</h3>
                              <span className="px-2 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-medium rounded-full uppercase tracking-wide">High Risk</span>
                            </div>
                            <p className="text-[14px] text-[#626266] mb-3">Maximum market penetration and rapid growth for established brands</p>
                            
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Audience</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#2a2a2f]">~10.5K</div>
                                <div className="text-[11px] text-[#a1a1a1]">Reach</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-[14px] font-semibold text-[#04b440]">6.2%</div>
                                <div className="text-[11px] text-[#a1a1a1]">Conversion</div>
                              </div>
                            </div>
                            
                            {/* Budget Display */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-[18px] font-bold text-[#2a2a2f]">₹10,000</div>
                                <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedBudgetType === 'aggressive'
                                  ? 'border-[#7856ff] bg-[#7856ff]'
                                  : 'border-[#e9e9e9]'
                              }`}>
                                {selectedBudgetType === 'aggressive' && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:block">
                      <div className="flex items-center justify-between">
                        {/* Left Side - Strategy Info */}
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-[14px] font-bold text-[#2a2a2f]">Aggressive</h3>
                              <span className="px-2 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-medium rounded-full uppercase tracking-wide">High Risk</span>
                    </div>
                            <p className="text-[14px] text-[#626266]">Maximum market penetration and rapid growth for established brands</p>
                          </div>
                          </div>

                        {/* Right Side - Budget & Metrics */}
                        <div className="flex items-center gap-6">
                          {/* Key Metrics */}
                          <div className="flex gap-4">
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">25.5K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Total Audience</div>
                        </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#2a2a2f]">~10.5K</div>
                              <div className="text-[11px] text-[#a1a1a1]">Expected Reach</div>
                      </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                            <div className="text-center">
                              <div className="text-[14px] font-semibold text-[#04b440]">6.2%</div>
                              <div className="text-[11px] text-[#a1a1a1]">Conversion Rate</div>
                    </div>
                            <div className="w-px bg-[#e9e9e9] h-10"></div>
                  </div>

                          {/* Budget */}
                          <div className="text-center">
                            <div className="text-[14px] font-bold text-[#2a2a2f]">₹10,000</div>
                            <div className="text-[12px] text-[#a1a1a1]">Total Budget</div>
                  </div>

                          {/* Selection Indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedBudgetType === 'aggressive'
                              ? 'border-[#7856ff] bg-[#7856ff]'
                              : 'border-[#e9e9e9]'
                          }`}>
                            {selectedBudgetType === 'aggressive' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                              </svg>
                            )}
                            </div>
                </div>
                    </div>
                  </div>
                    </div>
                  </div>
                )}
                </div>




                  </div>
                    </div>
          </section>

          {/* Right Side - Campaign Summary (30%) */}
          <section className="lg:col-span-3">
            <div className="bg-white border border-[#e9e9e9] rounded-lg overflow-hidden h-full sticky top-6">
              <div className="p-4 border-b border-[#e9e9e9]">
                <h2 className="text-[16px] font-bold text-[#2a2a2f] mb-0.5">Campaign Summary</h2>
                <p className="text-[#a1a1a1] text-[14px] font-normal">Review your campaign configuration before proceeding</p>
                  </div>

              <div className="p-4">
                <div className="space-y-4">
                  {/* Audience Preview */}
                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[14px] font-semibold text-[#2a2a2f]">Audience Preview</h3>
                       <button
                         onClick={() => setAudienceExpanded(!audienceExpanded)}
                         className="flex items-center gap-1 text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:gap-2"
                       >
                         <span>{audienceExpanded ? 'Collapse' : 'Expand'}</span>
                         <svg
                           className={`w-4 h-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${audienceExpanded ? 'rotate-180' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                </div>

                     {/* Audience Summary - Show when closed */}
                     {!audienceExpanded && (
                       <div className="mb-3">
                      <div className="flex justify-between items-center">
                           <span className="text-[14px] text-[#626266]">Total Audience</span>
                           <span className="text-[16px] font-bold text-[#2a2a2f]">{campaignData.audience.totalUsers.toLocaleString()}</span>
              </div>
            </div>
                     )}

                     {/* Separator */}
                     <div className="w-full h-px bg-[#e9e9e9] mb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                     <div className="space-y-3">
                       <div className={`space-y-3 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${audienceExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                         {/* Audience Size */}
                         <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                           <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Audience Details</div>
                           <div className="space-y-2 ml-2">
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Total Users</span>
                               <span className="font-medium text-[#2a2a2f]">{campaignData.audience.totalUsers.toLocaleString()}</span>
                    </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Target Age</span>
                               <span className="font-medium text-[#2a2a2f]">{campaignData.audience.demographics}</span>
                          </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Location</span>
                               <span className="font-medium text-[#2a2a2f]">{campaignData.audience.location}</span>
                          </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Audience Type</span>
                                                               <span className="font-medium text-[#2a2a2f] capitalize">custom</span>
                        </div>
                      </div>
                           <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                    </div>

                         {/* Audience Insights */}
                         <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                           <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Audience Insights</div>
                           <div className="space-y-2 ml-2">
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Avg. Engagement Rate</span>
                               <span className="font-medium text-[#04b440]">78%</span>
                  </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Avg. Order Value</span>
                               <span className="font-medium text-[#2a2a2f]">₹1,250</span>
                  </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Purchase Frequency</span>
                               <span className="font-medium text-[#2a2a2f]">2.3x/month</span>
                </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Retention Rate</span>
                               <span className="font-medium text-[#04b440]">85%</span>
                    </div>
                  </div>
                           <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                    </div>

                         {/* Audience Segments */}
                         <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                           <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Key Segments</div>
                           <div className="space-y-1 ml-2">
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• High-Value Customers</span>
                               <span className="font-medium text-[#04b440]">15%</span>
                  </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Active Users</span>
                               <span className="font-medium text-[#2a2a2f]">45%</span>
                </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• New Customers</span>
                               <span className="font-medium text-[#7856ff]">25%</span>
                  </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• At-Risk Customers</span>
                               <span className="font-medium text-[#FF6B35]">15%</span>
                    </div>
                  </div>
                           <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                </div>
              </div>
            </div>
          </div>

                   {/* Selected Platforms */}
                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[14px] font-semibold text-[#2a2a2f]">Selected Platforms</h3>
                       <button
                         onClick={() => setPlatformsExpanded(!platformsExpanded)}
                         className="flex items-center gap-1 text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:gap-2"
                       >
                         <span>{platformsExpanded ? 'Collapse' : 'Expand'}</span>
                         <svg
                           className={`w-4 h-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${platformsExpanded ? 'rotate-180' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                     </div>

                     {/* No Platforms Selected - Show when closed or no platforms */}
                     {(!platformsExpanded || selectedPlatforms.length === 0) && (
                       <div className="mb-3">
                         <p className="text-[14px] text-[#626266] font-normal transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                           {selectedPlatforms.length === 0 ? 'No platforms selected' : `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected`}
                        </p>
                      </div>
                     )}

                     {/* Separator */}
                     <div className="w-full h-px bg-[#e9e9e9] mb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                     <div className="space-y-3">
                       {selectedPlatforms.length === 0 ? null : (
                         <div className={`space-y-3 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${platformsExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      {selectedPlatforms.map(platformId => {
                        const platform = campaignData.platforms.find(p => p.id === platformId);
                        if (!platform) return null;

                        return (
                               <div key={platformId} className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                 <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                   <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: platform.color }}>
                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         {platformId === 'tab' && (
                                           <>
                                             <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
                                             <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="white"/>
                                           </>
                                         )}
                                         {platformId === 'whatsapp' && (
                                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="white"/>
                                         )}
                                         {platformId === 'sms' && (
                                           <>
                                             <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
                                             <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
                                           </>
                                         )}
                                         {platformId === 'email' && (
                                           <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                                         )}
                                       </svg>
                    </div>
                                     <div>
                                       <div className="text-[14px] font-medium text-[#2a2a2f]">{platform.name}</div>
                                                                               <div className="text-[12px] text-[#a1a1a1]">{platform.features[0]}</div>
                                     </div>
                                   </div>
                                   <div className="text-right">
                                     <div className="text-[14px] font-semibold text-[#2a2a2f]">₹{platform.costPerMessage.toFixed(2)}</div>
                                     <div className="text-[11px] text-[#a1a1a1]">per message</div>
                                   </div>
                                 </div>
                                 <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                          </div>
                        );
                      })}
                         </div>
                       )}
                    </div>
                  </div>

                   {/* Budget Overview */}
                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[14px] font-semibold text-[#2a2a2f]">Budget Overview</h3>
                       <button
                         onClick={() => setBudgetExpanded(!budgetExpanded)}
                         className="flex items-center gap-1 text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:gap-2"
                       >
                         <span>{budgetExpanded ? 'Collapse' : 'Expand'}</span>
                         <svg
                           className={`w-4 h-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${budgetExpanded ? 'rotate-180' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                             </svg>
                       </button>
                      </div>

                     {/* Budget Summary - Show when closed */}
                     {!budgetExpanded && (
                       <div className="mb-3">
                      <div className="flex justify-between items-center">
                           <span className="text-[14px] text-[#626266]">Total Budget</span>
                           <span className="text-[16px] font-bold text-[#2a2a2f]">₹{budgetInputs.total.toLocaleString()}</span>
                      </div>
                      </div>
                     )}

                     {/* Separator */}
                     <div className="w-full h-px bg-[#e9e9e9] mb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                     <div className="space-y-3">
                       <div className={`space-y-3 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${budgetExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                         {/* Total Budget */}
                         <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                           <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Budget Details</div>
                           <div className="space-y-2 ml-2">
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Total Campaign Budget</span>
                               <span className="font-medium text-[#2a2a2f]">₹{budgetInputs.total.toLocaleString()}</span>
                         </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Daily Budget Limit</span>
                               <span className="font-medium text-[#2a2a2f]">₹{budgetInputs.daily.toLocaleString()}</span>
                         </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Campaign Duration</span>
                               <span className="font-medium text-[#2a2a2f]">14 days</span>
                       </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Budget Type</span>
                               <span className="font-medium text-[#2a2a2f] capitalize">{selectedBudgetType}</span>
                  </div>
                </div>
                           <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                      </div>

                  {/* Budget Allocation */}
                         {campaignData.budget.allocations && campaignData.budget.allocations.length > 0 && (
                           <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                             <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Platform Allocation</div>
                             <div className="space-y-1 ml-2">
                      {campaignData.budget.allocations.map(allocation => {
                        const platform = campaignData.platforms.find(p => p.id === allocation.platformId);
                        if (!platform) return null;

                        return (
                                   <div key={allocation.platformId} className="flex justify-between items-center text-[14px]">
                                     <span className="text-[#626266]">• {platform.name}</span>
                            <span className="font-medium" style={{ color: platform.color }}>
                                       ₹{allocation.amount.toLocaleString()} ({allocation.percentage}%)
                            </span>
                    </div>
                        );
                      })}
                         </div>
                             <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                       </div>
                         )}

                         {/* Budget Strategy */}
                         <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                           <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Allocation Strategy</div>
                           <div className="space-y-1 ml-2">
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Strategy Type</span>
                               <span className="font-medium text-[#2a2a2f] capitalize">{budgetInputs.allocationStrategy || 'equal'}</span>
                  </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Expected ROI</span>
                               <span className="font-medium text-[#04b440]">2.5x - 4x</span>
                </div>
                             <div className="flex justify-between items-center text-[14px]">
                               <span className="text-[#626266]">• Estimated Reach</span>
                               <span className="font-medium text-[#2a2a2f]">{Math.round(campaignData.audience.totalUsers * 0.85).toLocaleString()} users</span>
              </div>
            </div>
                           <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                  </div>
                     </div>
                  </div>
                </div>

                   {/* AI Insights and Performance Metrics */}
                  <div>
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



                      {/* Campaign Performance */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-[14px] font-semibold text-orange-800 mb-1">Campaign Performance</h4>
                            <p className="text-[14px] text-orange-700">Expected reach of {Math.round(campaignData.audience.totalUsers * 0.85).toLocaleString()} users with optimal budget allocation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <CampaignFooter
          onClose={() => router.push('/campaigns')}
          onNext={handleProceed}
          onPrevious={() => router.push(`/new-campaign/audience?type=${campaignType}`)}
          nextLabel="Design Campaign"
          showPrevious={true}
        />
      </div>
    </main>
  );
}
