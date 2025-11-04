'use client';

import { FunnelType } from './CustomerFunnelClient';
import { Users, IndianRupee, Zap, RefreshCw, ShoppingBag } from 'lucide-react';

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
    description: 'Frequent, Regular, Occasional, One-time',
    icon: ShoppingBag,
    color: '#ef4444',
  },
];

interface FunnelTypeSelectorProps {
  selectedType: FunnelType;
  onTypeChange: (type: FunnelType) => void;
}

export function FunnelTypeSelector({ selectedType, onTypeChange }: FunnelTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-[#2a2a2f] mb-4 font-manrope">
        Select Funnel Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {funnelTypes.map((funnel) => {
          const Icon = funnel.icon;
          const isSelected = selectedType === funnel.type;
          
          return (
            <button
              key={funnel.type}
              onClick={() => onTypeChange(funnel.type)}
              className={`relative p-4 rounded-lg border-2 text-left ${
                isSelected
                  ? 'border-[#9747FF] bg-gradient-to-br from-[#9747FF]/10 to-[#9747FF]/5'
                  : 'border-[#e9e9e9] bg-white'
              }`}
            >
              <div className="flex items-start gap-3 text-left">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#9747FF] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3
                    className={`font-semibold text-sm sm:text-base mb-1 font-manrope text-left ${
                      isSelected ? 'text-[#9747FF]' : 'text-[#2a2a2f]'
                    }`}
                  >
                    {funnel.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#626266] font-manrope line-clamp-2 text-left">
                    {funnel.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-[#9747FF] rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

