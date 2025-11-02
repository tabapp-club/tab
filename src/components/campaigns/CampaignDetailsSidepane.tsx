'use client';

import { useState, useMemo, useCallback } from 'react';
import { Sidepane, SidepaneSection } from '@/components/Sidepane';
import { RecommendedCampaign } from './RecommendedCampaigns';
import { ReactNode } from 'react';

interface CampaignDetailsSidepaneProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: RecommendedCampaign | null;
}

// Icon components
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" strokeWidth={2} />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export function CampaignDetailsSidepane({ isOpen, onClose, campaign }: CampaignDetailsSidepaneProps) {
  const [selectedMediums, setSelectedMediums] = useState<string[]>(['whatsapp', 'sms']);
  const [selectedSchedule, setSelectedSchedule] = useState<'now' | 'later'>('now');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const toggleMedium = useCallback((mediumId: string) => {
    setSelectedMediums(prev => 
      prev.includes(mediumId) 
        ? prev.filter(id => id !== mediumId) 
        : [...prev, mediumId]
    );
  }, []);

  // Header Content - Campaign Header Card (useMemo to ensure it's always defined)
  const headerContent = useMemo(() => {
    if (!campaign) return null;
    
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-300">
            <div className="text-gray-600">
              {campaign.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#2a2a2f]">{campaign.title}</h3>
              {campaign.urgency === 'high' && (
                <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                  URGENT
                </div>
              )}
            </div>
            <p className="text-sm text-[#626266] mb-3">{campaign.description}</p>
            <div className="flex items-center gap-2 text-xs text-[#626266]">
              <span className="font-semibold">{campaign.count.toLocaleString()} users</span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [campaign]);

  // Build sections
  const sections = useMemo<SidepaneSection[]>(() => {
    if (!campaign) return [];
    
    const mediums = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        )
      },
      {
        id: 'sms',
        name: 'SMS',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      }
    ];
    
    return [
    {
      id: 'metrics',
      title: 'Campaign Metrics',
      icon: <TrendingUpIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Expected Cost</p>
              <p className="text-sm font-bold text-gray-700">{campaign.expectedCampaignCost}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Conversion</p>
              <p className="text-sm font-bold text-gray-700">{campaign.expectedConversion}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Expected Revenue</p>
              <p className="text-sm font-bold text-gray-700">{campaign.expectedRevenue}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <TargetIcon className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-[#2a2a2f]">Impact: </span>
              <span className="text-gray-700">{campaign.estimatedImpact}</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'audience',
      title: 'Audience',
      icon: <UsersIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Target Audience</p>
                <p className="text-2xl font-bold text-gray-700">{campaign.count.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Users selected for this campaign</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Campaign Type</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600 border border-gray-200">
                {campaign.title}
              </span>
              {campaign.priority && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  Priority
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'channels',
      title: 'Communication Channels',
      icon: <ZapIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {mediums.map((medium) => {
            const isSelected = selectedMediums.includes(medium.id);
            return (
              <button
                key={medium.id}
                onClick={() => toggleMedium(medium.id)}
                className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
                style={{
                  border: `0.5px solid ${isSelected ? '#9747FF' : '#e5e7eb'}`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <div className={isSelected ? 'text-gray-900' : 'text-gray-600'}>
                        {medium.icon}
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {medium.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )
    },
    {
      id: 'templates',
      title: 'Message Template',
      icon: <MessageSquareIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            {
              id: 'template-1',
              name: 'Re-engagement Message',
              preview: 'Hi {{name}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.',
              category: 'Retention'
            },
            {
              id: 'template-2',
              name: 'Special Offer',
              preview: 'Hello {{name}}, exclusive offer for you! Shop now and save up to 50% on selected items.',
              category: 'Promotion'
            },
            {
              id: 'template-3',
              name: 'Birthday Greeting',
              preview: 'Happy Birthday {{name}}! 🎉 Celebrate with a special 25% birthday discount on us!',
              category: 'Personal'
            },
            {
              id: 'template-4',
              name: 'Follow-up Message',
              preview: 'Hi {{name}}, you left items in your cart. Complete your purchase now and save!',
              category: 'Conversion'
            }
          ].map((template) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className="w-[210px] aspect-square flex-shrink-0 p-4 rounded-lg transition-all relative text-left flex flex-col bg-gray-50 hover:bg-gray-100"
                style={{
                  border: `0.5px solid ${isSelected ? '#9747FF' : '#e5e7eb'}`
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap mb-2">
                        {template.category}
                      </span>
                      <p className="font-semibold text-gray-900 text-sm">{template.name}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed flex-1 line-clamp-4">
                    {template.preview}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: <AlertCircleIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedSchedule('now')}
            className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
            style={{
              border: `0.5px solid ${selectedSchedule === 'now' ? '#9747FF' : '#e5e7eb'}`
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-gray-900">Send Now</p>
                  <p className="text-xs text-gray-600 mt-0.5">Launch immediately</p>
                </div>
                {selectedSchedule === 'now' && (
                  <div className="w-5 h-5 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedSchedule('later')}
            className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
            style={{
              border: `0.5px solid ${selectedSchedule === 'later' ? '#9747FF' : '#e5e7eb'}`
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-gray-900">Schedule Later</p>
                  <p className="text-xs text-gray-600 mt-0.5">Set date and time</p>
                </div>
                {selectedSchedule === 'later' && (
                  <div className="w-5 h-5 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>
      )
    }
    ];
  }, [campaign, selectedMediums, selectedTemplate, selectedSchedule, toggleMedium]);

  // Footer Content - Action Button (useMemo to ensure it's always defined)
  const footerContent = useMemo(() => {
    if (!campaign) return null;
    
    return (
    <div className="flex justify-end">
      <button
        onClick={() => {
          console.log('Sending campaign:', campaign, { 
            mediums: selectedMediums, 
            schedule: selectedSchedule,
            template: selectedTemplate 
          });
        }}
        className="bg-[#9747FF] text-white font-semibold py-3 px-4 hover:bg-[#8636ee] transition-colors flex items-center justify-center gap-2"
        style={{ borderRadius: '4px' }}
      >
        <ZapIcon className="w-5 h-5" />
        {selectedSchedule === 'now' ? 'Send Campaign Now' : 'Schedule Campaign'}
      </button>
    </div>
    );
  }, [campaign, selectedSchedule, selectedMediums, selectedTemplate]);

  if (!campaign) return null;

  return (
    <Sidepane
      isOpen={isOpen}
      onClose={onClose}
      title="Campaign Details"
      headerContent={headerContent}
      sections={sections}
      footerContent={footerContent}
    />
  );
}
