'use client';

import { FunnelType } from './CustomerFunnelClient';
import { Users, IndianRupee, Zap, RefreshCw, ShoppingBag, Check } from 'lucide-react';

const funnelTypes: Array<{
  type: FunnelType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    type: 'status',
    label: 'Status',
    description: 'Active, Inactive, Dormant, At Risk',
    icon: Users,
    color: '#10b981',
  },
  {
    type: 'value',
    label: 'Customer Value',
    description: 'Premium, High Value, Regular, Low Value',
    icon: IndianRupee,
    color: '#8b5cf6',
  },
  {
    type: 'engagement',
    label: 'Engagement',
    description: 'Highly, Moderately, Low, No Engagement',
    icon: Zap,
    color: '#3b82f6',
  },
  {
    type: 'retention',
    label: 'Retention',
    description: 'Highly Retained, Retained, At Risk, Churned',
    icon: RefreshCw,
    color: '#f59e0b',
  },
  {
    type: 'purchase_behavior',
    label: 'Purchase Behavior',
    description: 'First, Regular, Occasional, One-time Customers',
    icon: ShoppingBag,
    color: '#ef4444',
  },
];

interface FunnelTypeSelectorVerticalProps {
  selectedType: FunnelType;
  onTypeChange: (type: FunnelType) => void;
}

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 3.5L6 10L2.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function FunnelTypeSelectorVertical({ selectedType, onTypeChange }: FunnelTypeSelectorVerticalProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#2a2a2f] font-manrope">Select Funnel Type</h3>
        <p className="text-sm text-[#626266] font-manrope mt-1">Choose a funnel to analyze</p>
      </div>
      
      <div className="space-y-2">
        {funnelTypes.map((funnel) => {
          const Icon = funnel.icon;
          const isSelected = selectedType === funnel.type;
          
          return (
            <button
              key={funnel.type}
              onClick={() => onTypeChange(funnel.type)}
              className={`bg-[#ffffff] relative rounded w-full border ${
                isSelected
                  ? 'border-[#9747FF]'
                  : 'border-[#e9e9e9]'
              }`}
            >
              <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full text-left">
                <div className="flex gap-2.5 items-center justify-start relative shrink-0">
                  <div className={`relative shrink-0 size-11 flex items-center justify-center rounded-lg ${
                    isSelected ? 'bg-[#9747FF]/10' : 'bg-gray-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#9747FF]' : 'text-gray-600'}`} />
                  </div>
                </div>
                <div className="flex gap-1 flex-1 items-center justify-between">
                  <div className="flex flex-col font-['Manrope:Bold',_sans-serif] justify-start items-start leading-[0] not-italic text-[#2a2a2f] text-[14px] text-left">
                    <p className="leading-[1.4] text-left">{funnel.label}</p>
                    <p className="text-[12px] text-[#626266] font-normal leading-[1.3] mt-1 text-left">{funnel.description}</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#9747FF] flex items-center justify-center text-white">
                        <CheckIcon />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#e9e9e9]"></div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

