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

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

export function CampaignDetailsSidepane({ isOpen, onClose, campaign }: CampaignDetailsSidepaneProps) {
  const [selectedMediums, setSelectedMediums] = useState<string[]>(['whatsapp', 'sms']);
  const [selectedSchedule, setSelectedSchedule] = useState<'now' | 'later'>('now');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedMessageType, setSelectedMessageType] = useState<'with-offer' | 'without-offer' | ''>('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [templateFilter, setTemplateFilter] = useState<'regular' | 'personalised' | 'custom' | 'all'>('all');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');

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
          </div>
        </div>
      </div>
    );
  }, [campaign]);

  // Campaign-specific offer suggestions
  const getOffersForCampaign = useCallback((campaignId: string) => {
    const offerMap: Record<string, Array<{
      id: string;
      title: string;
      description: string;
      revenueWith: string;
      revenueWithout: string;
      conversionWith: string;
      conversionWithout: string;
    }>> = {
      'inactive-users': [
        {
          id: 'offer-1',
          title: '20% Welcome Back Discount',
          description: 'Welcome inactive customers back with a special discount',
          revenueWith: '+₹52K',
          revenueWithout: '+₹35K',
          conversionWith: '24%',
          conversionWithout: '15%'
        },
        {
          id: 'offer-2',
          title: 'Free Consultation',
          description: 'Complimentary health check-up to re-engage',
          revenueWith: '+₹68K',
          revenueWithout: '+₹35K',
          conversionWith: '28%',
          conversionWithout: '15%'
        },
        {
          id: 'offer-3',
          title: '15% Off + Add-on Service',
          description: 'Discount with complimentary service upgrade',
          revenueWith: '+₹58K',
          revenueWithout: '+₹35K',
          conversionWith: '22%',
          conversionWithout: '15%'
        }
      ],
      'followup-messages': [
        {
          id: 'offer-1',
          title: 'Priority Booking Slots',
          description: 'Exclusive early booking with discount',
          revenueWith: '+₹85K',
          revenueWithout: '+₹58K',
          conversionWith: '38%',
          conversionWithout: '25%'
        },
        {
          id: 'offer-2',
          title: 'Express Service Upgrade',
          description: 'Faster service with premium treatment add-on',
          revenueWith: '+₹92K',
          revenueWithout: '+₹58K',
          conversionWith: '35%',
          conversionWithout: '25%'
        },
        {
          id: 'offer-3',
          title: 'Package Deal Discount',
          description: 'Save on multi-visit packages',
          revenueWith: '+₹78K',
          revenueWithout: '+₹58K',
          conversionWith: '32%',
          conversionWithout: '25%'
        }
      ],
      'birthday-wishes': [
        {
          id: 'offer-1',
          title: 'Birthday Special - 25% Off',
          description: 'Celebrate with exclusive birthday discount',
          revenueWith: '+₹68K',
          revenueWithout: '+₹45K',
          conversionWith: '35%',
          conversionWithout: '22%'
        },
        {
          id: 'offer-2',
          title: 'Birthday Package Deal',
          description: 'Special birthday treatment package',
          revenueWith: '+₹85K',
          revenueWithout: '+₹45K',
          conversionWith: '38%',
          conversionWithout: '22%'
        },
        {
          id: 'offer-3',
          title: 'Gift with Service',
          description: 'Complimentary gift on any service',
          revenueWith: '+₹62K',
          revenueWithout: '+₹45K',
          conversionWith: '30%',
          conversionWithout: '22%'
        }
      ],
      'low-value-users': [
        {
          id: 'offer-1',
          title: 'Premium Service Upgrade',
          description: 'Upgrade to premium services with discount',
          revenueWith: '+₹1.5L',
          revenueWithout: '+₹95K',
          conversionWith: '20%',
          conversionWithout: '12%'
        },
        {
          id: 'offer-2',
          title: 'Add-on Services Package',
          description: 'Multiple services at bundled pricing',
          revenueWith: '+₹1.8L',
          revenueWithout: '+₹95K',
          conversionWith: '18%',
          conversionWithout: '12%'
        },
        {
          id: 'offer-3',
          title: 'Loyalty Rewards Program',
          description: 'Join rewards program with sign-up bonus',
          revenueWith: '+₹1.3L',
          revenueWithout: '+₹95K',
          conversionWith: '22%',
          conversionWithout: '12%'
        }
      ]
    };
    
    return offerMap[campaignId] || [];
  }, []);

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
      id: 'audience',
      title: 'Audience',
      icon: <UsersIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="bg-gradient-to-br from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Target Audience</p>
              <p className="text-2xl font-bold text-gray-700">{campaign.count.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Users selected for this campaign</p>
            </div>
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-gray-600" />
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
      id: 'message-type',
      title: 'Message Type',
      icon: <TagIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSelectedMessageType('with-offer');
                setSelectedOffer('');
              }}
              className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
              style={{
                border: `0.5px solid ${selectedMessageType === 'with-offer' ? '#9747FF' : '#e5e7eb'}`
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-gray-900">With Offer</p>
                    <p className="text-xs text-gray-600 mt-0.5">Include discount/promo</p>
                  </div>
                  {selectedMessageType === 'with-offer' && (
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
              onClick={() => {
                setSelectedMessageType('without-offer');
                setSelectedOffer('');
              }}
              className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
              style={{
                border: `0.5px solid ${selectedMessageType === 'without-offer' ? '#9747FF' : '#e5e7eb'}`
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-gray-900">Without Offer</p>
                    <p className="text-xs text-gray-600 mt-0.5">No discount/promo</p>
                  </div>
                  {selectedMessageType === 'without-offer' && (
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

          {/* Offer Suggestions */}
          {selectedMessageType === 'with-offer' && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Suggested Offers</p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {getOffersForCampaign(campaign.id).map((offer) => {
                  const isSelected = selectedOffer === offer.id;
                  return (
                    <button
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer.id)}
                      className="w-[280px] min-w-[280px] p-4 rounded-lg transition-all relative text-left flex flex-col bg-gray-50 hover:bg-gray-100"
                      style={{
                        border: `0.5px solid ${isSelected ? '#9747FF' : '#e5e7eb'}`
                      }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-gray-900 line-clamp-2">{offer.title}</p>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{offer.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-green-600">{offer.revenueWith}</span>
                            <span className="text-gray-400 line-through">{offer.revenueWithout}</span>
                            <span className="text-gray-500">Revenue</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-blue-600">{offer.conversionWith}</span>
                            <span className="text-gray-400 line-through">{offer.conversionWithout}</span>
                            <span className="text-gray-500">Conversion</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'templates',
      title: 'Message Template',
      icon: <MessageSquareIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="space-y-3">
          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All' },
              { id: 'regular', label: 'Regular' },
              { id: 'personalised', label: 'Personalised' },
              { id: 'custom', label: 'Custom' }
            ].map((filter) => {
              const isSelected = templateFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setTemplateFilter(filter.id as any)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-[#9747FF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Custom Template Input */}
          {templateFilter === 'custom' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Custom Message
              </label>
              <textarea
                value={customTemplate}
                onChange={(e) => {
                  setCustomTemplate(e.target.value);
                  setSelectedTemplate('custom');
                }}
                placeholder="Enter your custom message here... You can use {{name}} for personalization."
                className="w-full min-h-[120px] px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                rows={5}
              />
              <p className="mt-2 text-xs text-gray-500">
                Use <code className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">{'{{name}}'}</code> to personalize messages
              </p>
            </div>
          )}

          {/* Templates Grid */}
          {templateFilter !== 'custom' && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              {
                id: 'template-1',
                name: 'Re-engagement Message',
                preview: 'Hi {{name}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.',
                category: 'Retention',
                type: 'regular' as const
              },
              {
                id: 'template-2',
                name: 'Special Offer',
                preview: 'Hello {{name}}, exclusive offer for you! Visit us and save up to 50% on selected services.',
                category: 'Promotion',
                type: 'regular' as const
              },
              {
                id: 'template-3',
                name: 'Birthday Greeting',
                preview: 'Happy Birthday {{name}}! 🎉 Celebrate with a special 25% birthday discount on us!',
                category: 'Personal',
                type: 'personalised' as const
              },
              {
                id: 'template-4',
                name: 'Follow-up Message',
                preview: 'Hi {{name}}, just following up on your recent visit. Book your next appointment and save!',
                category: 'Conversion',
                type: 'personalised' as const
              }
            ].filter(template => templateFilter === 'all' || template.type === templateFilter).map((template) => {
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
          )}
        </div>
      )
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: <AlertCircleIcon className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="space-y-3">
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

          {/* Schedule Later Fields */}
          {selectedSchedule === 'later' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      )
    }
    ];
  }, [campaign, selectedMediums, selectedTemplate, selectedSchedule, selectedMessageType, selectedOffer, templateFilter, getOffersForCampaign, toggleMedium]);

  // Check if all required options are selected
  const isFormValid = useMemo(() => {
    const baseValid = selectedMediums.length > 0 && selectedTemplate !== '' && selectedSchedule !== '' && selectedMessageType !== '';
    const offerValid = selectedMessageType === 'without-offer' || (selectedMessageType === 'with-offer' && selectedOffer !== '');
    const scheduleValid = selectedSchedule === 'now' || (selectedSchedule === 'later' && scheduleDate !== '' && scheduleTime !== '');
    return baseValid && offerValid && scheduleValid;
  }, [selectedMediums, selectedTemplate, selectedSchedule, selectedMessageType, selectedOffer, scheduleDate, scheduleTime]);

  // Footer Content - Action Button (useMemo to ensure it's always defined)
  const footerContent = useMemo(() => {
    if (!campaign) return null;
    
    return (
    <div className="flex justify-end">
      <button
        onClick={() => {
          if (!isFormValid) return;
          console.log('Sending campaign:', campaign, { 
            mediums: selectedMediums, 
            schedule: selectedSchedule,
            scheduleDate: selectedSchedule === 'later' ? scheduleDate : undefined,
            scheduleTime: selectedSchedule === 'later' ? scheduleTime : undefined,
            template: selectedTemplate,
            messageType: selectedMessageType,
            offer: selectedOffer
          });
        }}
        disabled={!isFormValid}
        className={`font-semibold py-3 px-4 transition-colors flex items-center justify-center gap-2 ${
          isFormValid 
            ? 'bg-[#9747FF] text-white hover:bg-[#8636ee] cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        style={{ borderRadius: '4px' }}
      >
        <ZapIcon className="w-5 h-5" />
        {selectedSchedule === 'now' ? 'Send Campaign Now' : 'Schedule Campaign'}
      </button>
    </div>
    );
  }, [campaign, selectedSchedule, scheduleDate, scheduleTime, selectedMediums, selectedTemplate, selectedMessageType, selectedOffer, isFormValid]);

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
