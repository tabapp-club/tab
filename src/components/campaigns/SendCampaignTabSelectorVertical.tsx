'use client';

import { 
  Info, 
  Settings, 
  FileText, 
  Calendar 
} from 'lucide-react';

type SendCampaignTab = 'overview' | 'configuration' | 'template';

const campaignTabs: Array<{
  type: SendCampaignTab;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    type: 'overview',
    label: 'Overview',
    description: 'Campaign details and insights',
    icon: Info,
  },
  {
    type: 'configuration',
    label: 'Configuration',
    description: 'Channels and message type',
    icon: Settings,
  },
  {
    type: 'template',
    label: 'Template',
    description: 'Select message template',
    icon: FileText,
  },
];

interface SendCampaignTabSelectorVerticalProps {
  selectedTab: SendCampaignTab;
  onTabChange: (tab: SendCampaignTab) => void;
}

export function SendCampaignTabSelectorVertical({ 
  selectedTab, 
  onTabChange 
}: SendCampaignTabSelectorVerticalProps) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        {campaignTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === tab.type;
          
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
                    <p className="leading-[1.4] text-left">{tab.label}</p>
                    <p className="text-[12px] text-[#626266] font-normal leading-[1.3] mt-1 text-left">{tab.description}</p>
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

