'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidepane, SidepaneSection } from '@/components/Sidepane';
import { RecommendedCampaign } from './RecommendedCampaigns';
import { CampaignData } from './CampaignsClient';
import {
  Users,
  Zap,
  MessageSquare,
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Sparkles,
  Clock,
  Send,
  Eye,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CampaignDetailsSidepaneProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: RecommendedCampaign | null;
}

export function CampaignDetailsSidepane({ isOpen, onClose, campaign }: CampaignDetailsSidepaneProps) {
  const router = useRouter();
  const [selectedMediums, setSelectedMediums] = useState<string[]>(['whatsapp', 'sms']);
  const [selectedSchedule, setSelectedSchedule] = useState<'now' | 'later'>('now');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedMessageType, setSelectedMessageType] = useState<'with-offer' | 'without-offer' | ''>('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [templateFilter, setTemplateFilter] = useState<'regular' | 'personalised' | 'custom' | 'all'>('all');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleMedium = useCallback((mediumId: string) => {
    setSelectedMediums(prev =>
      prev.includes(mediumId)
        ? prev.filter(id => id !== mediumId)
        : [...prev, mediumId]
    );
  }, []);

  // Calculate ROI and other insights
  const campaignInsights = useMemo(() => {
    if (!campaign) return null;

    const cost = parseFloat(campaign.expectedCampaignCost.replace(/[₹,K]/g, '')) * 1000;
    const revenue = parseFloat(campaign.expectedRevenue.replace(/[₹,K,L]/g, '')) * (campaign.expectedRevenue.includes('L') ? 100000 : 1000);
    const conversion = parseFloat(campaign.expectedConversion.replace('%', ''));
    const roi = ((revenue - cost) / cost) * 100;
    const netProfit = revenue - cost;

    return {
      cost,
      revenue,
      conversion,
      roi: Math.round(roi),
      netProfit,
      estimatedReach: campaign.count,
      expectedEngagements: Math.round(campaign.count * (conversion / 100))
    };
  }, [campaign]);

  // Header Content - Enhanced with insights
  const headerContent = useMemo(() => {
    if (!campaign || !campaignInsights) return null;

    return (
      <div className="space-y-4">
        {/* Campaign Header Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#9747FF]/10 via-[#9747FF]/5 to-transparent border border-[#9747FF]/20 p-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#2a2a2f]">{campaign.title}</h3>
                {campaign.urgency === 'high' && (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></span>
                    URGENT
                  </div>
                )}
              </div>
              <p className="text-xs text-[#626266] leading-relaxed">{campaign.description}</p>
            </div>
            <div className="p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-white/50">
              {campaign.icon}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#9747FF]/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-[#9747FF]" />
                <span className="text-[10px] font-semibold text-gray-600">Target Customers</span>
              </div>
              <p className="text-base font-bold text-[#9747FF]">{campaign.count.toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-[#9747FF]/10">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#9747FF]" />
                <span className="text-[10px] font-semibold text-gray-600">Expected Cost</span>
              </div>
              <p className="text-base font-bold text-[#9747FF]">{campaign.expectedCampaignCost}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-[#9747FF]" />
                <span className="text-[10px] font-semibold text-gray-600">Conversion</span>
              </div>
              <p className="text-base font-bold text-[#9747FF]">{campaign.expectedConversion}</p>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-white rounded-lg border border-blue-200">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-gray-900 mb-1">Why This Campaign?</h4>
              <p className="text-[10px] text-gray-700 leading-relaxed">
                {campaign.estimatedImpact}. Expected to reach {campaignInsights.estimatedReach.toLocaleString()} users
                with {campaignInsights.expectedEngagements.toLocaleString()} expected engagements.
                Net profit projection: <span className="font-semibold text-green-600">₹{Math.round(campaignInsights.netProfit / 1000)}K</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [campaign, campaignInsights]);

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
      impact: string;
    }>> = {
      'inactive-users': [
        {
          id: 'offer-1',
          title: '20% Welcome Back Discount',
          description: 'Welcome inactive customers back with a special discount',
          revenueWith: '+₹52K',
          revenueWithout: '+₹35K',
          conversionWith: '24%',
          conversionWithout: '15%',
          impact: 'High impact'
        },
        {
          id: 'offer-2',
          title: 'Free Consultation',
          description: 'Complimentary health check-up to re-engage',
          revenueWith: '+₹68K',
          revenueWithout: '+₹35K',
          conversionWith: '28%',
          conversionWithout: '15%',
          impact: 'Highest impact'
        },
        {
          id: 'offer-3',
          title: '15% Off + Add-on Service',
          description: 'Discount with complimentary service upgrade',
          revenueWith: '+₹58K',
          revenueWithout: '+₹35K',
          conversionWith: '22%',
          conversionWithout: '15%',
          impact: 'Medium impact'
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
          conversionWithout: '25%',
          impact: 'Highest impact'
        },
        {
          id: 'offer-2',
          title: 'Express Service Upgrade',
          description: 'Faster service with premium treatment add-on',
          revenueWith: '+₹92K',
          revenueWithout: '+₹58K',
          conversionWith: '35%',
          conversionWithout: '25%',
          impact: 'High impact'
        },
        {
          id: 'offer-3',
          title: 'Package Deal Discount',
          description: 'Save on multi-visit packages',
          revenueWith: '+₹78K',
          revenueWithout: '+₹58K',
          conversionWith: '32%',
          conversionWithout: '25%',
          impact: 'Medium impact'
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
          conversionWithout: '22%',
          impact: 'High impact'
        },
        {
          id: 'offer-2',
          title: 'Birthday Package Deal',
          description: 'Special birthday treatment package',
          revenueWith: '+₹85K',
          revenueWithout: '+₹45K',
          conversionWith: '38%',
          conversionWithout: '22%',
          impact: 'Highest impact'
        },
        {
          id: 'offer-3',
          title: 'Gift with Service',
          description: 'Complimentary gift on any service',
          revenueWith: '+₹62K',
          revenueWithout: '+₹45K',
          conversionWith: '30%',
          conversionWithout: '22%',
          impact: 'Medium impact'
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
          conversionWithout: '12%',
          impact: 'Highest impact'
        },
        {
          id: 'offer-2',
          title: 'Add-on Services Package',
          description: 'Multiple services at bundled pricing',
          revenueWith: '+₹1.8L',
          revenueWithout: '+₹95K',
          conversionWith: '18%',
          conversionWithout: '12%',
          impact: 'High impact'
        },
        {
          id: 'offer-3',
          title: 'Loyalty Rewards Program',
          description: 'Join rewards program with sign-up bonus',
          revenueWith: '+₹1.3L',
          revenueWithout: '+₹95K',
          conversionWith: '22%',
          conversionWithout: '12%',
          impact: 'Medium impact'
        }
      ]
    };

    return offerMap[campaignId] || [];
  }, []);

  // Build sections
  const sections = useMemo<SidepaneSection[]>(() => {
    if (!campaign || !campaignInsights) return [];

    const mediums = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        ),
        color: '#25D366'
      },
      {
        id: 'sms',
        name: 'SMS',
        icon: <MessageSquare className="w-5 h-5" />,
        color: '#6366F1'
      }
    ];

    return [
    {
      id: 'channels',
      title: 'Communication Channels',
      icon: <Zap className="w-5 h-5 text-[#9747FF]" />,
      content: (
        <div className="grid grid-cols-2 gap-3 overflow-visible">
          {mediums.map((medium) => {
            const isSelected = selectedMediums.includes(medium.id);
            return (
              <div
                key={medium.id}
                className={`p-3 rounded-lg transition-all flex items-center justify-between gap-2 border ${
                  isSelected
                    ? 'bg-gray-50 border-[#9747FF]'
                    : 'bg-gray-50 border-gray-200'
                }`}
                style={{ borderWidth: '1px' }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${isSelected ? 'bg-white' : 'bg-white/80'}`}>
                    <div style={{ color: isSelected ? medium.color : '#6B7280' }}>
                      {medium.icon}
                    </div>
                  </div>
                  <span className={`font-semibold text-xs ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                    {medium.name}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleMedium(medium.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:ring-offset-1 ${
                      isSelected
                        ? 'bg-[#9747FF]'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`Toggle ${medium.name}`}
                    role="switch"
                    aria-checked={isSelected}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                        isSelected ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )
    },
    {
      id: 'message-type',
      title: 'Message Type & Offers',
      icon: <Sparkles className="w-5 h-5 text-[#9747FF]" />,
      content: (
        <div className="overflow-visible">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => {
                setSelectedMessageType('with-offer');
                setSelectedOffer('');
              }}
              className={`p-4 rounded-xl transition-all border ${
                selectedMessageType === 'with-offer'
                  ? 'bg-gray-50 border-[#9747FF]'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              style={{ borderWidth: '1px' }}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-900">With Offer</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-left">Include discount/promo</p>
                {selectedMessageType === 'with-offer' && (
                  <div className="mt-2 text-[10px] font-semibold text-[#9747FF]">
                    Higher conversion expected
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMessageType('without-offer');
                setSelectedOffer('');
              }}
              className={`p-4 rounded-xl transition-all border ${
                selectedMessageType === 'without-offer'
                  ? 'bg-gray-50 border-[#9747FF]'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              style={{ borderWidth: '1px' }}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-900">Without Offer</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-left">No discount/promo</p>
              </div>
            </button>
          </div>

          {/* Enhanced Offer Suggestions */}
          {selectedMessageType === 'with-offer' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-900">Recommended Offers</p>
                <span className="text-[10px] text-gray-500">Select to see impact</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {getOffersForCampaign(campaign.id).map((offer) => {
                  const isSelected = selectedOffer === offer.id;

                  return (
                    <button
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer.id)}
                      className={`w-[300px] min-w-[300px] p-4 rounded-xl transition-all text-left flex flex-col ${
                        isSelected
                          ? 'bg-white border border-[#9747FF]'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ borderWidth: '1px' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-xs text-gray-900">{offer.title}</p>
                          </div>
                          <p className="text-[10px] text-gray-600 mb-2">{offer.description}</p>
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            offer.impact === 'Highest impact' ? 'bg-green-100 text-green-700' :
                            offer.impact === 'High impact' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {offer.impact}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'templates',
      title: 'Message Template',
      icon: <MessageSquare className="w-5 h-5 text-[#9747FF]" />,
      content: (
        <div className="space-y-4 overflow-visible">
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
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
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-4">
              <label className="block text-[10px] font-bold text-gray-700 mb-2">
                Custom Message
              </label>
              <textarea
                value={customTemplate}
                onChange={(e) => {
                  setCustomTemplate(e.target.value);
                  setSelectedTemplate('custom');
                }}
                placeholder="Enter your custom message here... You can use {{name}} for personalization."
                className="w-full min-h-[120px] px-2.5 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                rows={5}
              />
              <p className="mt-2 text-[10px] text-gray-500">
                Use <code className="px-1 py-0.5 bg-white rounded text-gray-700 font-mono text-[10px]">{'{{name}}'}</code> to personalize messages
              </p>
            </div>
          )}

          {/* Templates Grid */}
          {templateFilter !== 'custom' && (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                className={`w-[240px] aspect-square flex-shrink-0 p-4 rounded-xl transition-all text-left flex flex-col ${
                  isSelected
                    ? 'bg-white border border-[#9747FF]'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
                style={{ borderWidth: '1px' }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-1 rounded-full mb-2 ${
                        template.category === 'Retention' ? 'bg-purple-100 text-purple-700' :
                        template.category === 'Promotion' ? 'bg-orange-100 text-orange-700' :
                        template.category === 'Personal' ? 'bg-pink-100 text-pink-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {template.category}
                      </span>
                      <p className="font-bold text-gray-900 text-xs mb-2">{template.name}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-relaxed flex-1 line-clamp-5">
                    {template.preview}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Preview available</span>
                    </div>
                  </div>
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
      title: 'Schedule & Timing',
      icon: <Calendar className="w-5 h-5 text-[#9747FF]" />,
      content: (
        <div className="space-y-4 overflow-visible">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedSchedule('now')}
              className={`p-4 rounded-xl transition-all border ${
                selectedSchedule === 'now'
                  ? 'bg-gray-50 border-[#9747FF]'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              style={{ borderWidth: '1px' }}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-900">Send Now</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-left">Launch immediately</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedSchedule('later')}
              className={`p-4 rounded-xl transition-all border ${
                selectedSchedule === 'later'
                  ? 'bg-gray-50 border-[#9747FF]'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              style={{ borderWidth: '1px' }}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-900">Schedule Later</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-left">Set date and time</p>
              </div>
            </button>
          </div>

          {/* Schedule Later Fields */}
          {selectedSchedule === 'later' && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-2.5 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
    ];
  }, [campaign, campaignInsights, selectedMediums, selectedTemplate, selectedSchedule, selectedMessageType, selectedOffer, templateFilter, getOffersForCampaign, toggleMedium]);

  // Check if all required options are selected
  const isFormValid = useMemo(() => {
    const baseValid = selectedMediums.length > 0 && selectedTemplate !== '' && selectedMessageType !== '';
    const offerValid = selectedMessageType === 'without-offer' || (selectedMessageType === 'with-offer' && selectedOffer !== '');
    const scheduleValid = selectedSchedule === 'now' || (selectedSchedule === 'later' && scheduleDate !== '' && scheduleTime !== '');
    return baseValid && offerValid && scheduleValid;
  }, [selectedMediums, selectedTemplate, selectedSchedule, selectedMessageType, selectedOffer, scheduleDate, scheduleTime]);

  // Footer Content - Enhanced Action Button
  const footerContent = useMemo(() => {
    if (!campaign) return null;

    return (
    <div className="flex justify-end">
        <button
          onClick={() => {
            if (!isFormValid) return;
            if (selectedSchedule === 'now') {
              setIsSending(true);
              // Simulate sending process
              setTimeout(() => {
                setIsSending(false);
                setIsSuccess(true);
                // Store campaign in localStorage to show in campaigns list
                const newCampaign: CampaignData = {
                  id: `campaign-${Date.now()}`,
                  name: campaign.title,
                  type: 'engagement' as const,
                  status: 'pending' as const,
                  audience: campaign.count,
                  sent: 0,
                  opened: 0,
                  clicked: 0,
                  conversion: 0,
                  budget: parseFloat(campaign.expectedCampaignCost.replace(/[₹,K]/g, '')) * 1000,
                  spent: 0,
                  createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                  endDate: '',
                  description: campaign.description
                };

                // Store in both keys for compatibility
                const existingCampaigns = JSON.parse(localStorage.getItem('sentCampaigns') || '[]');
                existingCampaigns.push(newCampaign);
                localStorage.setItem('sentCampaigns', JSON.stringify(existingCampaigns));

                // Also store in pendingCampaigns for backward compatibility
                const pendingCampaigns = JSON.parse(localStorage.getItem('pendingCampaigns') || '[]');
                pendingCampaigns.push(newCampaign);
                localStorage.setItem('pendingCampaigns', JSON.stringify(pendingCampaigns));

                // Dispatch custom event to update campaigns list
                window.dispatchEvent(new Event('campaignsUpdated'));
              }, 3000);
            } else {
              console.log('Scheduling campaign:', campaign, {
                mediums: selectedMediums,
                schedule: selectedSchedule,
                scheduleDate: scheduleDate,
                scheduleTime: scheduleTime,
                template: selectedTemplate,
                messageType: selectedMessageType,
                offer: selectedOffer
              });
            }
          }}
          disabled={!isFormValid}
          className={`font-bold py-3 px-5 text-sm transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-[#9747FF] text-white hover:scale-[1.02] cursor-pointer'
              : 'bg-[#9747FF]/30 text-[#9747FF]/50 cursor-not-allowed'
          }`}
          style={{ borderRadius: '4px' }}
        >
        {selectedSchedule === 'now' ? (
          <>
            <Send className="w-4 h-4" />
            Send Campaign Now
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            Schedule Campaign
          </>
        )}
        </button>
      </div>
    );
  }, [campaign, selectedSchedule, scheduleDate, scheduleTime, selectedMediums, selectedTemplate, selectedMessageType, selectedOffer, isFormValid, isSending, isSuccess]);

  // Reset states when sidepane closes or campaign changes
  useEffect(() => {
    if (!isOpen || !campaign) {
      setIsSending(false);
      setIsSuccess(false);
    }
  }, [isOpen, campaign]);

  if (!campaign) return null;

  // Show sending state
  if (isSending) {
    return (
      <Sidepane
        isOpen={isOpen}
        onClose={onClose}
        title=""
        sections={[]}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 bg-[#f6f6f6]">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9747FF]/10 to-[#9747FF]/5 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#9747FF] animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#9747FF]/20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-[#2a2a2f] mb-2">Sending Campaign</h3>
          <p className="text-sm text-[#626266] text-center max-w-sm">
            Your campaign is being sent to {campaign.count.toLocaleString()} users. This may take a few moments...
          </p>
        </div>
      </Sidepane>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <Sidepane
        isOpen={isOpen}
        onClose={onClose}
        title=""
        sections={[]}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 bg-[#f6f6f6]">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9747FF]/10 to-[#9747FF]/5 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#9747FF]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2a2a2f] mb-2">Campaign Sent!</h3>
          <p className="text-sm text-[#626266] text-center max-w-sm mb-8">
            Your campaign &quot;{campaign.title}&quot; has been successfully sent to {campaign.count.toLocaleString()} users.
          </p>
          <button
            onClick={() => {
              router.push('/campaigns');
              onClose();
            }}
            className="font-bold py-3 px-6 text-sm transition-all flex items-center justify-center gap-2 bg-[#9747FF] text-white hover:scale-[1.02] cursor-pointer"
            style={{ borderRadius: '4px' }}
          >
            <BarChart3 className="w-4 h-4" />
            Track Campaign Status
          </button>
        </div>
      </Sidepane>
    );
  }

  return (
    <Sidepane
      isOpen={isOpen}
      onClose={onClose}
      title="Campaign Setup"
      headerContent={headerContent}
      sections={sections}
      footerContent={footerContent}
    />
  );
}
