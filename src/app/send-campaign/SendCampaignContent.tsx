'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RecommendedCampaign } from '@/components/campaigns/RecommendedCampaigns';
import { CampaignData } from '@/components/campaigns/CampaignsClient';
import { useSidebar } from '@/components/SidebarContext';
import { MobileHeaderButton } from '@/components/MobileHeaderButton';
import { SendCampaignTabSelectorVertical } from '@/components/campaigns/SendCampaignTabSelectorVertical';

type SendCampaignTab = 'overview' | 'configuration' | 'template';
const validTabs: SendCampaignTab[] = ['overview', 'configuration', 'template'];
const isValidTab = (value: string | null): value is SendCampaignTab =>
  value !== null && (validTabs as SendCampaignTab[]).includes(value as SendCampaignTab);
import {
  Users,
  Zap,
  MessageSquare,
  TrendingUp,
  Target,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Sparkles,
  Send,
  Eye,
  Loader2,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Image,
  X as XIcon,
  Wallet
} from 'lucide-react';

// Campaign recommendations data (same as in RecommendedCampaigns)
const getCampaignById = (id: string): RecommendedCampaign | null => {
  const campaigns: RecommendedCampaign[] = [
    {
      id: 'inactive-users',
      title: 'Inactive Users',
      count: 280,
      description: 'Re-engage users who haven\'t interacted in 30+ days',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      expectedCampaignCost: '₹8.5K',
      expectedConversion: '18%',
      expectedRevenue: '₹42K',
      urgency: 'high',
      priority: true,
      estimatedImpact: 'High revenue recovery'
    },
    {
      id: 'followup-messages',
      title: 'Follow-up Messages',
      count: 450,
      description: 'Critical follow-ups pending - risk of losing engagement',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      expectedCampaignCost: '₹12K',
      expectedConversion: '32%',
      expectedRevenue: '₹68K',
      urgency: 'high',
      priority: true,
      estimatedImpact: 'Immediate conversion boost'
    },
    {
      id: 'birthday-wishes',
      title: 'Birthday Wishes',
      count: 300,
      description: 'This month\'s birthdays - time-sensitive opportunity',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      expectedCampaignCost: '₹6.5K',
      expectedConversion: '28%',
      expectedRevenue: '₹55K',
      urgency: 'high',
      priority: false,
      estimatedImpact: 'Strong emotional connection'
    },
    {
      id: 'low-value-users',
      title: 'Low Value Users',
      count: 906,
      description: 'Upsell opportunity to increase lifetime value',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      expectedCampaignCost: '₹18K',
      expectedConversion: '15%',
      expectedRevenue: '₹1.2L',
      urgency: 'medium',
      priority: false,
      estimatedImpact: 'Significant revenue growth'
    },
  ];

  const predefined = campaigns.find(c => c.id === id);
  if (predefined) {
    return predefined;
  }

  const cachedCampaign = (() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem('funnelCampaignLookup');
      if (!stored) return null;
      const parsed: Record<string, {
        id: string;
        title: string;
        count: number;
        description: string;
        bgColor?: string;
        iconColor?: string;
        expectedCampaignCost: string;
        expectedConversion: string;
        expectedRevenue?: string;
        urgency: 'high' | 'medium' | 'low';
        priority: boolean;
        estimatedImpact: string;
      }> = JSON.parse(stored);
      return parsed[id] || null;
    } catch (error) {
      console.error('Failed to read cached funnel campaign', error);
      return null;
    }
  })();

  if (cachedCampaign) {
    return {
      ...cachedCampaign,
      expectedRevenue: cachedCampaign.expectedRevenue || '₹0',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-[#9747FF]/10">
          <Users className="w-3.5 h-3.5 text-[#9747FF]" />
        </div>
      ),
      bgColor: cachedCampaign.bgColor || 'bg-purple-100',
      iconColor: cachedCampaign.iconColor || 'text-[#9747FF]'
    };
  }

  return null;
};

export function SendCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isCollapsed, isMobile } = useSidebar();
  const campaignId = searchParams.get('id');
  const tabParam = searchParams.get('tab');
  const statusParam = searchParams.get('status');
  const initialTab = isValidTab(tabParam) ? tabParam : 'overview';
  const initialStatus = statusParam === 'sending' ? 'sending' : statusParam === 'sent' ? 'sent' : 'idle';
  const [campaign, setCampaign] = useState<RecommendedCampaign | null | undefined>(undefined);

  useEffect(() => {
    if (!campaignId) {
      setCampaign(null);
      return;
    }

    const result = getCampaignById(campaignId);
    setCampaign(result);
  }, [campaignId]);

  useEffect(() => {
    if (campaign === null) {
      router.push('/dashboard');
    }
  }, [campaign, router]);

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    const queryString = newSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const [selectedMediums, setSelectedMediums] = useState<string[]>(['whatsapp', 'sms']);
  const [selectedMessageType, setSelectedMessageType] = useState<'with-offer' | 'without-offer' | ''>('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [templateFilter, setTemplateFilter] = useState<'regular' | 'personalised' | 'custom' | 'all'>('all');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [isSending, setIsSending] = useState(initialStatus === 'sending');
  const [isSuccess, setIsSuccess] = useState(initialStatus === 'sent');
  const [activeTab, setActiveTabState] = useState<SendCampaignTab>(initialTab);
  const [lastSentCampaignId, setLastSentCampaignId] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidTab(tabParam)) {
      updateUrlParams({ tab: activeTab });
      return;
    }
    if (tabParam !== activeTab) {
      setActiveTabState(tabParam);
    }
  }, [tabParam, activeTab]);

  useEffect(() => {
    if (statusParam === 'sending' && !isSending) {
      setIsSending(true);
      setIsSuccess(false);
    } else if (statusParam === 'sent' && !isSuccess) {
      setIsSuccess(true);
      setIsSending(false);
    } else if (!statusParam && (isSending || isSuccess)) {
      setIsSending(false);
      setIsSuccess(false);
    } else if (statusParam && statusParam !== 'sending' && statusParam !== 'sent') {
      updateUrlParams({ status: null });
    }
  }, [statusParam, isSending, isSuccess]);

  const handleTabChange = (tab: SendCampaignTab) => {
    setActiveTabState(tab);
    updateUrlParams({ tab });
  };
  
  // Initialize with one default message
  const defaultMessageId = useMemo(() => `msg-${Date.now()}`, []);
  const defaultMessageContent = 'Hi {{name}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.';
  
  // Message structure with version support
  type MessageWithVersions = {
    id: string;
    versions: string[];
    currentVersionIndex: number;
  };
  
  const [generatedMessages, setGeneratedMessages] = useState<MessageWithVersions[]>(() => [
    { id: defaultMessageId, versions: [defaultMessageContent], currentVersionIndex: 0 }
  ]);
  const [previewMessage, setPreviewMessage] = useState<string>(defaultMessageContent);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultMessageId);
  const [uploadedImage, setUploadedImage] = useState<{ id: string; file: File; preview: string } | null>(null);
  const [previewTab, setPreviewTab] = useState<'whatsapp' | 'sms'>('whatsapp');

  const toggleMedium = (mediumId: string) => {
    setSelectedMediums(prev =>
      prev.includes(mediumId)
        ? prev.filter(id => id !== mediumId)
        : [...prev, mediumId]
    );
  };

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

  // Campaign-specific offer suggestions
  const getOffersForCampaign = (campaignId: string) => {
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
  };

  const isConfigurationStepValid = useMemo(() => {
    const baseValid = selectedMediums.length > 0 && selectedMessageType !== '';
    const offerValid =
      selectedMessageType === 'without-offer' ||
      (selectedMessageType === 'with-offer' && selectedOffer !== '');
    return baseValid && offerValid;
  }, [selectedMediums, selectedMessageType, selectedOffer]);

  // Check if all required options are selected
  const isFormValid = useMemo(() => {
    const baseValid = selectedMediums.length > 0 && selectedTemplate !== '' && selectedMessageType !== '';
    const offerValid = selectedMessageType === 'without-offer' || (selectedMessageType === 'with-offer' && selectedOffer !== '');
    const messageValid = generatedMessages.length > 0 && selectedTemplate !== '';
    return baseValid && offerValid && messageValid;
  }, [selectedMediums, selectedTemplate, selectedMessageType, selectedOffer, generatedMessages]);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  if (campaign === undefined || !campaignInsights) {
    return (
      <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
        actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
      }`}>
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <Loader2 className="w-10 h-10 text-[#9747FF] animate-spin" />
        </div>
      </main>
    );
  }

  // Show sending state
  if (isSending) {
    return (
      <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
        actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
      }`}>
        <div className="flex flex-col items-center justify-center h-screen p-6">
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
      </main>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
        actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
      }`}>
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9747FF]/10 to-[#9747FF]/5 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#9747FF]" />
            </div>
            </div>
          <h3 className="text-xl font-bold text-[#2a2a2f] mb-2">Campaign Sent for Review</h3>
          <p className="text-sm text-[#626266] text-center max-w-sm mb-8">
            Your campaign &quot;{campaign.title}&quot; has been submitted for review. We&apos;ll notify you once the review is complete.
          </p>
          <button
            onClick={() => {
              if (lastSentCampaignId) {
                router.push(`/campaigns#campaign-${lastSentCampaignId}`);
              } else {
              router.push('/campaigns');
              }
            }}
              className="inline-flex items-center justify-center h-12 px-6 bg-white border-[0.5px] border-[#9747FF] hover:bg-[#9747FF]/5 text-[#9747FF] font-semibold rounded-full transition-all duration-200 shadow-[0_4px_0_0_#9747FF] gap-2"
          >
            <BarChart3 className="w-4 h-4" />
               Track Review Status
          </button>
        </div>
      </main>
    );
  }

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

  // Render content for each tab
  const renderOverviewContent = () => (
    <>
    <div className="space-y-6">
          {/* Campaign Header Card */}
      <div className="relative overflow-hidden rounded bg-white border border-[#9747FF]/20 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-[#2a2a2f]">{campaign.title}</h3>
                  {campaign.urgency === 'high' && (
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                      URGENT
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#626266] leading-relaxed">{campaign.description}</p>
              </div>
              <div className="p-4 bg-white/80 rounded backdrop-blur-sm border border-white/50">
                <div className={campaign.iconColor}>
                  {campaign.icon}
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#9747FF]/10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-[#9747FF]" />
                  <span className="text-xs font-semibold text-gray-600">Target Customers</span>
                </div>
                <p className="text-lg font-bold text-[#9747FF]">{campaign.count.toLocaleString()}</p>
              </div>
              <div className="text-center border-x border-[#9747FF]/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Wallet className="w-4 h-4 text-[#9747FF]" />
                  <span className="text-xs font-semibold text-gray-600">Expected Cost</span>
                </div>
                <p className="text-lg font-bold text-[#9747FF]">{campaign.expectedCampaignCost}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-4 h-4 text-[#9747FF]" />
                  <span className="text-xs font-semibold text-gray-600">Conversion</span>
                </div>
                <p className="text-lg font-bold text-[#9747FF]">{campaign.expectedConversion}</p>
              </div>
            </div>
          </div>

          {/* Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-100 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded border border-blue-200">
                <Lightbulb className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 mb-1">Why This Campaign?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {campaign.estimatedImpact}. Expected to reach {campaignInsights.estimatedReach.toLocaleString()} users
                  with {campaignInsights.expectedEngagements.toLocaleString()} expected engagements.
                  Net profit projection: <span className="font-semibold text-green-600">₹{Math.round(campaignInsights.netProfit / 1000)}K</span>
                </p>
              </div>
            </div>
          </div>
    </div>
    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
      <button
        type="button"
        onClick={() => handleTabChange('configuration')}
        className="font-bold py-3 px-6 text-sm transition-all flex items-center justify-center gap-2 rounded bg-[#9747FF] text-white hover:scale-[1.02]"
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    </>
  );

  const renderConfigurationContent = () => (
    <>
          <div className="space-y-6">
              {/* Communication Channels */}
              <div className="bg-white rounded border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-2 bg-gray-100 rounded">
                    <Zap className="w-5 h-5 text-[#9747FF]" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f] text-lg">Communication Channels</h3>
                </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediums.map((medium) => {
                    const isSelected = selectedMediums.includes(medium.id);
                    return (
                      <div
                        key={medium.id}
                        className={`p-4 rounded transition-all flex items-center justify-between gap-3 border ${
                          isSelected
                      ? 'bg-gray-50 border-gray-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded flex-shrink-0 ${isSelected ? 'bg-white' : 'bg-white/80'}`}>
                            <div style={{ color: isSelected ? medium.color : '#6B7280' }}>
                              {medium.icon}
                            </div>
                          </div>
                          <span className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                            {medium.name}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleMedium(medium.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:ring-offset-1 ${
                              isSelected
                                ? 'bg-[#9747FF]'
                                : 'bg-gray-300'
                            }`}
                            aria-label={`Toggle ${medium.name}`}
                            role="switch"
                            aria-checked={isSelected}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                isSelected ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message Type & Offers */}
              <div className="bg-white rounded border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-gray-100 rounded">
                  <Sparkles className="w-5 h-5 text-[#9747FF]" />
                </div>
                <h3 className="font-bold text-[#2a2a2f] text-lg">Message Type & Offers</h3>
              </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => {
                    setSelectedMessageType('with-offer');
                    setSelectedOffer('');
                  }}
              className={`p-5 rounded transition-all border ${
                    selectedMessageType === 'with-offer'
                      ? 'bg-gray-50 border-[#9747FF]'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gray-600" />
                        <p className="text-sm font-semibold text-gray-900">With Offer</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 text-left">Include discount/promo</p>
                    {selectedMessageType === 'with-offer' && (
                      <div className="mt-2 text-xs font-semibold text-[#9747FF]">
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
              className={`p-5 rounded transition-all border ${
                    selectedMessageType === 'without-offer'
                      ? 'bg-gray-50 border-[#9747FF]'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        <p className="text-sm font-semibold text-gray-900">Without Offer</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 text-left">No discount/promo</p>
                  </div>
                </button>
              </div>

              {/* Enhanced Offer Suggestions */}
              {selectedMessageType === 'with-offer' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-900">Recommended Offers</p>
                    <span className="text-xs text-gray-500">Select to see impact</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOffersForCampaign(campaign.id).map((offer) => {
                      const isSelected = selectedOffer === offer.id;

                      return (
                        <button
                          key={offer.id}
                          onClick={() => setSelectedOffer(offer.id)}
                          className={`p-4 rounded transition-all text-left flex flex-col ${
                            isSelected
                              ? 'bg-white border border-[#9747FF]'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-sm text-gray-900">{offer.title}</p>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{offer.description}</p>
                              <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
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
            </div>
    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                      <button
        type="button"
        onClick={() => handleTabChange('template')}
        disabled={!isConfigurationStepValid}
        className={`font-bold py-3 px-6 text-sm transition-all flex items-center justify-center gap-2 rounded ${
          isConfigurationStepValid
            ? 'bg-[#9747FF] text-white hover:scale-[1.02]'
            : 'bg-[#9747FF]/30 text-[#9747FF]/50 cursor-not-allowed'
        }`}
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4" />
                      </button>
    </div>
    </>
  );

  const handleGenerateMessage = () => {
    // Generate a new version for the selected message (or first message if none selected)
    const targetMessageId = selectedTemplate || generatedMessages[0]?.id;
    if (!targetMessageId) return;
    
    const sampleMessages = [
      'Hi {{name}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.',
      'Hello {{name}}, exclusive offer for you! Visit us and save up to 50% on selected services.',
      'Happy Birthday {{name}}! 🎉 Celebrate with a special 25% birthday discount on us!',
      'Hi {{name}}, just following up on your recent visit. Book your next appointment and save!',
      'Hey {{name}}, don\'t miss out! Limited time offer - 30% off on all services this week.',
      'Dear {{name}}, thank you for being a valued customer! Enjoy 15% off on your next visit.',
      'Hi {{name}}, we have exciting news! New services available with special pricing just for you.',
      'Hello {{name}}, your feedback matters! Visit us this week and get a complimentary consultation.',
      'Hi {{name}}, seasonal special alert! Save 40% on premium services this month.',
      'Hey {{name}}, loyalty rewards await! Redeem your points and get exclusive discounts.'
    ];
    
    // Get a random message that's different from current versions
    const currentMessage = generatedMessages.find(msg => msg.id === targetMessageId);
    const existingVersions = currentMessage?.versions || [];
    let newContent = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    // Try to get a different message if it already exists
    let attempts = 0;
    while (existingVersions.includes(newContent) && attempts < 10) {
      newContent = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      attempts++;
    }
    
    setGeneratedMessages(prev => prev.map(msg => {
      if (msg.id === targetMessageId) {
        const newVersions = [...msg.versions, newContent];
        return {
          ...msg,
          versions: newVersions,
          currentVersionIndex: newVersions.length - 1 // Set to the new version
        };
      }
      return msg;
    }));
    
    // Update preview to show the new version
    setPreviewMessage(newContent);
  };

  const handleDeleteMessage = (id: string) => {
    // Prevent deleting if it's the last message (always keep at least one)
    setGeneratedMessages(prev => {
      if (prev.length <= 1) return prev; // Don't allow deleting the last message
      
      const filtered = prev.filter(msg => msg.id !== id);
      if (selectedTemplate === id && filtered.length > 0) {
        const firstMessage = filtered[0];
        setSelectedTemplate(firstMessage.id);
        setPreviewMessage(firstMessage.versions[firstMessage.currentVersionIndex]);
      }
      return filtered;
    });
  };

  const handleMessageChange = (id: string, content: string) => {
    setGeneratedMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        const updatedVersions = [...msg.versions];
        updatedVersions[msg.currentVersionIndex] = content;
        return {
          ...msg,
          versions: updatedVersions
        };
      }
      return msg;
    }));
    if (selectedTemplate === id) {
      setPreviewMessage(content);
    }
  };

  const handleSelectMessage = (id: string) => {
    setSelectedTemplate(id);
    const message = generatedMessages.find(msg => msg.id === id);
    if (message) {
      setPreviewMessage(message.versions[message.currentVersionIndex]);
    }
  };

  const handlePreviousVersion = (id: string) => {
    setGeneratedMessages(prev => prev.map(msg => {
      if (msg.id === id && msg.currentVersionIndex > 0) {
        const newIndex = msg.currentVersionIndex - 1;
        if (selectedTemplate === id) {
          setPreviewMessage(msg.versions[newIndex]);
        }
        return {
          ...msg,
          currentVersionIndex: newIndex
        };
      }
      return msg;
    }));
  };

  const handleNextVersion = (id: string) => {
    setGeneratedMessages(prev => prev.map(msg => {
      if (msg.id === id && msg.currentVersionIndex < msg.versions.length - 1) {
        const newIndex = msg.currentVersionIndex + 1;
        if (selectedTemplate === id) {
          setPreviewMessage(msg.versions[newIndex]);
        }
        return {
          ...msg,
          currentVersionIndex: newIndex
        };
      }
      return msg;
    }));
  };

  // Replace variables in preview with sample data
  const getPreviewText = (text: string) => {
    return text
      .replace(/\{\{name\}\}/g, 'John Doe')
      .replace(/\{\{businessName\}\}/g, 'Your Business')
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        file,
        preview: reader.result as string
      });
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const renderTemplateContent = () => (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Image Upload and Messages */}
      <div className="space-y-6">
        {/* Image Upload Card */}
        <div className="bg-white rounded border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">Images</h4>
            <p className="text-xs text-gray-500">Upload a single image</p>
                </div>

          <div className="space-y-4">
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#9747FF] border border-dashed border-[#9747FF] rounded hover:bg-[#9747FF]/5 transition-colors cursor-pointer">
                <Image className="w-4 h-4" />
                Upload image
              </span>
                    </label>

            {uploadedImage && (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={uploadedImage.preview}
                    alt="Uploaded"
                    className="w-full h-40 object-cover rounded border border-gray-200"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">{uploadedImage.file.name}</p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                  </div>
                )}
          </div>
        </div>

        {/* Messages Card */}
        <div className="bg-white rounded border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900">Messages</h4>
          <p className="text-xs text-gray-500">Use variables like {'{{name}}'}, {'{{businessName}}'}, {'{{date}}'}</p>
        </div>

        <div className="space-y-3">
          {generatedMessages.map((message, index) => {
            const isSelected = selectedTemplate === message.id;
            const isLastMessage = generatedMessages.length === 1;
            const currentContent = message.versions[message.currentVersionIndex];
            const hasMultipleVersions = message.versions.length > 1;
            const canGoPrevious = message.currentVersionIndex > 0;
            const canGoNext = message.currentVersionIndex < message.versions.length - 1;
            
                      return (
              <div
                key={message.id}
                className={`border rounded-lg p-4 transition-all ${
                            isSelected
                    ? 'border-[#9747FF] bg-[#9747FF]/5'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <textarea
                  value={currentContent}
                  onChange={(e) => handleMessageChange(message.id, e.target.value)}
                  onClick={() => handleSelectMessage(message.id)}
                  placeholder="Enter your message with variables like {{name}}..."
                  className="w-full min-h-[100px] px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                  rows={4}
                />
                
                {/* Version Navigation */}
                {hasMultipleVersions && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      onClick={() => handlePreviousVersion(message.id)}
                      disabled={!canGoPrevious}
                      className={`p-1.5 rounded transition-colors ${
                        canGoPrevious
                          ? 'hover:bg-gray-100 text-gray-600'
                          : 'opacity-40 cursor-not-allowed text-gray-400'
                      }`}
                      title="Previous version"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      </button>
                    <span className="text-xs text-gray-500 font-medium">
                      {message.currentVersionIndex + 1} / {message.versions.length}
                                </span>
                    <button
                      onClick={() => handleNextVersion(message.id)}
                      disabled={!canGoNext}
                      className={`p-1.5 rounded transition-colors ${
                        canGoNext
                          ? 'hover:bg-gray-100 text-gray-600'
                          : 'opacity-40 cursor-not-allowed text-gray-400'
                      }`}
                      title="Next version"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                              </div>
                )}
                            </div>
                      );
                    })}
                  </div>

        {/* Generate Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerateMessage}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all border border-[#9747FF] bg-white text-[#9747FF] hover:bg-[#9747FF]/5 hover:border-[#9747FF]"
            style={{ borderRadius: '4px' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate new</span>
          </button>
                  </div>
              </div>
            </div>

      {/* Right Side - Preview Card */}
            <div className="bg-white rounded border border-gray-100 p-6">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-900">Preview</h4>
                </div>

        {/* Preview Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-4">
                  <button
            onClick={() => setPreviewTab('whatsapp')}
            className={`pb-3 px-4 font-medium text-sm transition-colors flex items-center gap-2 ${
              previewTab === 'whatsapp'
                ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
                : 'text-[#626266] hover:text-[#2a2a2f]'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
                  </button>
                  <button
            onClick={() => setPreviewTab('sms')}
            className={`pb-3 px-4 font-medium text-sm transition-colors flex items-center gap-2 ${
              previewTab === 'sms'
                ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
                : 'text-[#626266] hover:text-[#2a2a2f]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            SMS
                  </button>
                </div>

        {previewMessage ? (
          <div className={`border border-gray-200 rounded-lg p-6 min-h-[300px] ${
            previewTab === 'whatsapp' 
              ? 'bg-gradient-to-br from-green-50 to-green-100' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}>
            {previewTab === 'whatsapp' ? (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 max-w-[280px] ml-auto">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                              </div>
                      <div>
                    <p className="text-sm font-semibold text-gray-900">Your Business</p>
                    <p className="text-xs text-gray-500">Now</p>
                            </div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {getPreviewText(previewMessage)}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                    <p className="text-sm font-semibold text-gray-900">Your Business</p>
                    <p className="text-xs text-gray-500">Now</p>
                      </div>
                    </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {getPreviewText(previewMessage)}
                    </div>
                  </div>
                )}
              </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
            <div>
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600 mb-1">No preview available</p>
              <p className="text-xs text-gray-500">Select a message to see preview</p>
            </div>
          </div>
        )}
            </div>
          </div>

    {/* Send Campaign Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => {
                if (!isFormValid) return;
                setLastSentCampaignId(null);
                  setIsSending(true);
                setIsSuccess(false);
                updateUrlParams({ status: 'sending' });
                  // Simulate sending process
                  setTimeout(() => {
                    setIsSending(false);
                    setIsSuccess(true);
                  updateUrlParams({ status: 'sent' });
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
                      createdAt: Date.now(),
                      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                      endDate: '',
                      description: campaign.description
                    };

                    setLastSentCampaignId(newCampaign.id);

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
              }}
              className="font-bold py-3 px-6 text-sm transition-all flex items-center justify-center gap-2 rounded bg-[#9747FF] text-white hover:scale-[1.02]"
            >
                  <Send className="w-4 h-4" />
                  Send Campaign Now
      </button>
    </div>
    </>
  );


  return (
    <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      {/* Header Section - Fixed on Desktop */}
      <div className={`hidden lg:block fixed top-0 z-20 bg-[#f6f6f6] pt-10 pb-4 px-8 ${
        actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
      }`}>
        <div>
          <h1 className="text-[20px] font-semibold text-[#2a2a2f] leading-snug">{campaign.title}</h1>
          <p className="text-[14px] text-[#626266] mt-1 leading-relaxed">Configure and send your campaign</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="px-4 pt-20 pb-40 py-4 lg:px-8 lg:py-8 lg:pb-20 lg:pt-8 lg:pt-24">
          {/* Mobile Header Section */}
          <div className="mb-4 lg:hidden pt-10">
            <h1 className="text-[20px] font-semibold text-[#2a2a2f] leading-snug">{campaign.title}</h1>
            <p className="text-[14px] text-[#626266] mt-1 leading-relaxed">Configure and send your campaign</p>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-6 mt-10">
            {/* Tab Selector - Mobile */}
            <div className="flex gap-2 border-b border-gray-200 bg-white rounded-xl p-4">
              <button
                onClick={() => handleTabChange('overview')}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
                    : 'text-[#626266] hover:text-[#2a2a2f]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange('configuration')}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === 'configuration'
                    ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
                    : 'text-[#626266] hover:text-[#2a2a2f]'
                }`}
              >
                Configuration
              </button>
              <button
                onClick={() => handleTabChange('template')}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === 'template'
                    ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
                    : 'text-[#626266] hover:text-[#2a2a2f]'
                }`}
              >
                Template
            </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {activeTab === 'overview' && renderOverviewContent()}
              {activeTab === 'configuration' && renderConfigurationContent()}
              {activeTab === 'template' && renderTemplateContent()}
            </div>
          </div>

          {/* Desktop Layout - Split View */}
          <div className="hidden lg:block mt-10">
            <div className="flex gap-0 items-start justify-start w-full">
              {/* Left Sidebar - Tab Selector (Vertical) - Fixed */}
              <div className={`flex flex-col gap-2 items-start justify-start w-full max-w-[315px] shrink-0 fixed top-[136px] bottom-0 overflow-y-auto bg-[#f6f6f6] pl-10 ${
                actualIsCollapsed ? 'left-[64px]' : 'left-[232px]'
              }`}>
                <SendCampaignTabSelectorVertical
                  selectedTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>

              {/* Right Side - Main Content - Scrollable */}
              <div className={`flex-1 min-w-0 space-y-6 ${
                actualIsCollapsed ? 'ml-[315px]' : 'ml-[483px]'
              }`}>
                {activeTab === 'overview' && renderOverviewContent()}
                {activeTab === 'configuration' && renderConfigurationContent()}
                {activeTab === 'template' && renderTemplateContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
