'use client';

import { Wallet, TrendingDown, CreditCard } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWalletData';

type WalletTab = 'addfunds' | 'breakdown' | 'platform';

const walletTabs: Array<{
  type: WalletTab;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    type: 'addfunds',
    label: 'Recharge',
    description: 'Recharge your wallet',
    icon: Wallet,
  },
  {
    type: 'platform',
    label: 'Platform',
    description: 'Manage platform fees',
    icon: CreditCard,
  },
  {
    type: 'breakdown',
    label: 'Spending Breakdown',
    description: 'View transaction history',
    icon: TrendingDown,
  },
];

interface WalletTabSelectorVerticalProps {
  selectedTab: WalletTab;
  onTabChange: (tab: WalletTab) => void;
}

export function WalletTabSelectorVertical({ selectedTab, onTabChange }: WalletTabSelectorVerticalProps) {
  const { data: balanceData } = useWalletBalance();
  const balance = balanceData?.data.balance ?? 0;

  // Mock platform plan ending date (in real app, this would come from API)
  const planEndingDays = 5; // Example: plan ending in 5 days
  const hasLowBalance = balance < 1000;
  const hasPlanEnding = planEndingDays <= 7 && planEndingDays > 0;

  const getNotificationChip = (tabType: WalletTab) => {
    if (tabType === 'addfunds' && hasLowBalance) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Low balance
        </span>
      );
    }
    if (tabType === 'platform' && hasPlanEnding) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
          Plan ending in {planEndingDays} days
        </span>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="space-y-2">
        {walletTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === tab.type;
          const notificationChip = getNotificationChip(tab.type);
          
          return (
            <button
              key={tab.type}
              onClick={() => onTabChange(tab.type)}
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
                  <div className="flex flex-col font-['Manrope:Bold',_sans-serif] justify-start items-start leading-[0] not-italic text-[#2a2a2f] text-[14px] text-left w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="leading-[1.4] text-left">{tab.label}</p>
                      {notificationChip && tab.type === 'addfunds' && notificationChip}
                    </div>
                    <p className="text-[12px] text-[#626266] font-normal leading-[1.3] mt-1 text-left">{tab.description}</p>
                    {notificationChip && tab.type === 'platform' && (
                      <div className="mt-2">
                        {notificationChip}
                      </div>
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

