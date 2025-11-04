'use client';

import { FunnelData, FunnelType } from './CustomerFunnelClient';
import { ArrowRight } from 'lucide-react';
import { RecommendedCampaign } from '../campaigns/RecommendedCampaigns';

interface FunnelCampaignCardsProps {
  data: FunnelData[];
  type: FunnelType;
  onSendNow?: (campaign: RecommendedCampaign) => void;
}

// Get advantages/benefits for each funnel stage based on type
const getCampaignAdvantages = (stage: string, type: FunnelType): string[] => {
  const stageLower = stage.toLowerCase();
  
  // Customer metrics advantages - Growth focused
  if (stageLower.includes('new customers')) {
    return ['Act now: Convert 15% more to repeat buyers', 'Lock in lifetime value from day one', 'Build brand loyalty before competitors'];
  } else if (stageLower.includes('retained customers')) {
    return ['Maximize growth: 3x revenue from loyal customers', 'Prevent churn risk - act before it\'s too late', 'Upsell premium products to boost ARPU'];
  }
  
  // Status type advantages - Urgency focused
  if (type === 'status') {
    if (stageLower.includes('active')) {
      return ['Growth opportunity: 40% will buy more with right message', 'Upsell premium products now - highest conversion window', 'Maximize lifetime value before they slow down'];
    } else if (stageLower.includes('inactive')) {
      return ['URGENT: 30% will churn in next 30 days without action', 'Recover ₹2.5L+ revenue at risk - send message today', 'Win back before they switch to competitors'];
    } else if (stageLower.includes('dormant')) {
      return ['Critical: Last chance to reactivate before permanent loss', 'Reclaim lost revenue - 25% will return with offer', 'Prevent final churn - time-sensitive opportunity'];
    } else if (stageLower.includes('risk')) {
      return ['URGENT: 50% will churn in 15 days - act immediately', 'Save ₹3L+ at risk with targeted retention campaign', 'Prevent customer loss before it\'s irreversible'];
    }
  }
  
  // Value type advantages - Growth focused
  if (type === 'value') {
    if (stageLower.includes('premium')) {
      return ['Maximize growth: Upsell premium products - 60% conversion', 'Increase ARPU by 3x with targeted premium offers', 'Leverage VIP customers for referrals - 4x growth'];
    } else if (stageLower.includes('high value')) {
      return ['Growth opportunity: Upgrade 35% to premium tier', 'Boost average order value by 2.5x with bundles', 'Increase purchase frequency - 50% more revenue potential'];
    } else if (stageLower.includes('regular')) {
      return ['Growth potential: Upgrade 30% to high-value customers', 'Increase frequency - double revenue in 60 days', 'Upsell premium products - 2x lifetime value'];
    } else if (stageLower.includes('low value')) {
      return ['Growth opportunity: Convert 40% to regular spenders', 'Increase average order size by 2x with targeted offers', 'Boost engagement - 3x revenue potential'];
    }
  }
  
  // Engagement type advantages - Urgency focused
  if (type === 'engagement') {
    if (stageLower.includes('highly')) {
      return ['Growth lever: Turn advocates into 5x referral sources', 'Maximize lifetime value - upsell premium products', 'Scale growth through customer referrals'];
    } else if (stageLower.includes('moderately')) {
      return ['Growth opportunity: Boost engagement to drive 2x sales', 'Increase interaction frequency - 40% more revenue', 'Convert to highly engaged - 3x customer value'];
    } else if (stageLower.includes('low')) {
      return ['URGENT: 45% will disengage without immediate action', 'Re-engage before churn - save ₹1.8L+ at risk', 'Boost engagement now or lose customers permanently'];
    } else if (stageLower.includes('no engagement')) {
      return ['Critical: Zero engagement = 70% churn risk', 'Act now: Re-engage before they forget your brand', 'Recover lost customers - last chance to convert'];
    }
  }
  
  // Retention type advantages - High urgency
  if (type === 'retention') {
    if (stageLower.includes('highly retained')) {
      return ['Growth engine: Maximize referrals - 5x customer acquisition', 'Upsell premium tier - 60% conversion opportunity', 'Increase lifetime value - 4x revenue potential'];
    } else if (stageLower.includes('retained')) {
      return ['Prevent churn risk: Strengthen before they reconsider', 'Growth opportunity: Upgrade to premium - 40% will convert', 'Boost satisfaction - prevent 30% churn risk'];
    } else if (stageLower.includes('risk')) {
      return ['URGENT: 60% will churn in 20 days without intervention', 'Save ₹4L+ revenue at critical risk - act today', 'Win back at-risk customers before permanent loss'];
    } else if (stageLower.includes('churned')) {
      return ['Revenue recovery: 20% will return with right offer', 'Reclaim lost customers - ₹2.5L+ recoverable revenue', 'Win back before they switch permanently'];
    }
  }
  
  // Purchase behavior type advantages - Growth focused
  if (type === 'purchase_behavior') {
    if (stageLower.includes('frequent')) {
      return ['Growth multiplier: Upsell premium products - 55% conversion', 'Increase order value by 2x with bundle offers', 'Leverage frequent buyers for 4x referral growth'];
    } else if (stageLower.includes('regular')) {
      return ['Growth opportunity: Convert 35% to frequent buyers', 'Boost purchase frequency - double revenue potential', 'Increase order size - 2.5x lifetime value'];
    } else if (stageLower.includes('occasional')) {
      return ['Growth potential: Convert 40% to regular buyers', 'Increase frequency - 3x revenue in next quarter', 'Upgrade purchase behavior - 2x customer value'];
    } else if (stageLower.includes('one-time')) {
      return ['Critical: Convert to repeat buyers or lose forever', 'Growth opportunity: 30% will buy again with offer', 'Build purchase habit - 4x lifetime value potential'];
    }
  }
  
  // Default advantages
  return ['Growth opportunity: Act now to maximize revenue', 'Targeted campaigns for 3x conversion', 'Optimize customer lifetime value'];
};

// Get campaign type based on funnel type and stage
const getCampaignType = (stage: string, type: FunnelType): string => {
  const stageLower = stage.toLowerCase();
  
  if (type === 'status' && (stageLower.includes('inactive') || stageLower.includes('dormant') || stageLower.includes('risk'))) {
    return 'retention';
  }
  if (type === 'retention' && stageLower.includes('churned')) {
    return 'retention';
  }
  if (type === 'engagement' && (stageLower.includes('low') || stageLower.includes('no'))) {
    return 'engagement';
  }
  if (type === 'value' && stageLower.includes('low')) {
    return 'advertise';
  }
  
  return 'engagement';
};

// Create a RecommendedCampaign object from funnel stage data
const createRecommendedCampaign = (stage: FunnelData, type: FunnelType): RecommendedCampaign => {
  const stageLower = stage.stage.toLowerCase();
  
  // Calculate expected metrics based on stage
  const expectedCost = Math.round(stage.count * 0.02);
  const expectedConversion = stage.change && stage.change > 0 ? `${Math.round(stage.change * 0.8)}%` : '8%';
  const expectedRevenue = Math.round(stage.count * 0.15);
  
  // Determine urgency based on change and stage type
  let urgency: 'high' | 'medium' | 'low' = 'medium';
  
  // High urgency for at-risk, inactive, dormant, low engagement, churned
  if (stageLower.includes('risk') || stageLower.includes('inactive') || 
      stageLower.includes('dormant') || stageLower.includes('low') || 
      stageLower.includes('churned') || stageLower.includes('no engagement')) {
    urgency = 'high';
  } else if (stage.change && stage.change < -3) {
    urgency = 'high';
  } else if (stage.change && stage.change > 10) {
    urgency = 'low';
  }
  
  return {
    id: `funnel-${type}-${stage.stage.replace(/\s+/g, '-').toLowerCase()}`,
    title: stage.stage,
    count: stage.count,
    description: getCampaignAdvantages(stage.stage, type)[0] || 'Targeted campaign for this segment',
    icon: <div />,
    bgColor: `${stage.color}15`,
    iconColor: stage.color,
    expectedCampaignCost: `₹${expectedCost > 1000 ? `${(expectedCost / 1000).toFixed(1)}K` : expectedCost}`,
    expectedConversion,
    expectedRevenue: `₹${expectedRevenue > 1000 ? `${(expectedRevenue / 1000).toFixed(1)}K` : expectedRevenue}`,
    urgency,
    priority: urgency === 'high',
    estimatedImpact: getCampaignAdvantages(stage.stage, type)[0] || 'Act now: Maximize growth opportunity',
  };
};

export function FunnelCampaignCards({ data, type, onSendNow }: FunnelCampaignCardsProps) {
  const handleSendMessages = (stage: FunnelData, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onSendNow) {
      const campaign = createRecommendedCampaign(stage, type);
      onSendNow(campaign);
    }
  };

  // Calculate customer metrics for status tab
  const customerMetrics = (() => {
    if (!data || data.length === 0 || type !== 'status') {
      return null;
    }

    const allCustomers = data.reduce((sum, stage) => sum + (stage.count || 0), 0);
    const newCustomers = Math.round(allCustomers * 0.15);
    
    // Retained customers - active customers for status type
    const retainedCustomers = data.find(s => s.stage.toLowerCase().includes('active'))?.count || 0;

    return {
      allCustomers,
      newCustomers,
      retainedCustomers,
    };
  })();

  if (!data || data.length === 0) {
    return null;
  }

  // Create customer metric cards for status tab
  const customerMetricCards: FunnelData[] = type === 'status' && customerMetrics ? [
    {
      stage: 'New Customers',
      count: customerMetrics.newCustomers,
      percentage: customerMetrics.allCustomers > 0 ? (customerMetrics.newCustomers / customerMetrics.allCustomers) * 100 : 0,
      color: '#A877FF',
      value: customerMetrics.newCustomers,
      change: 15.0, // Growth opportunity
    },
    {
      stage: 'Retained Customers',
      count: customerMetrics.retainedCustomers,
      percentage: customerMetrics.allCustomers > 0 ? (customerMetrics.retainedCustomers / customerMetrics.allCustomers) * 100 : 0,
      color: '#B891FF',
      value: customerMetrics.retainedCustomers,
      change: 12.0, // Growth opportunity
    },
  ] : [];

  // Combine customer metric cards with funnel stages for status tab
  const displayData = type === 'status' ? [...customerMetricCards, ...data] : data;

  return (
    <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6" style={{ borderRadius: '4px' }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2a2a2f] font-manrope">Create Campaigns</h3>
        <p className="text-sm text-[#626266] font-manrope mt-1">Act now: Turn customer segments into revenue growth with targeted campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayData.map((stage) => {
          const campaign = createRecommendedCampaign(stage, type);
          
          return (
            <div
              key={stage.stage}
              onClick={() => handleSendMessages(stage)}
              className="bg-white p-4 cursor-pointer transition-all duration-200 group relative overflow-hidden"
              style={{ 
                border: '0.5px solid #9747FF',
                borderRadius: '16px',
                boxShadow: '0 4px 0 0 #9747FF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9747FF';
                e.currentTarget.style.borderWidth = '1px';
                e.currentTarget.style.boxShadow = '0 4px 0 0 #9747FF, 0 2px 8px rgba(151, 71, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#9747FF';
                e.currentTarget.style.borderWidth = '0.5px';
                e.currentTarget.style.boxShadow = '0 4px 0 0 #9747FF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top Section with Background */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-lg -m-4 p-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3 mt-0 relative">
                  <h3 className="text-sm font-semibold text-[#2a2a2f]">{stage.stage} Customers</h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Urgency Indicator */}
                    {campaign.urgency === 'high' && (
                      <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                        URGENT
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stage.count.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-[#626266] line-clamp-2 min-h-[32px]">{campaign.description}</p>
                </div>
              </div>
              
              <div className="min-w-0">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-600 mb-0.5">Expected Cost</p>
                    <p className="text-xs font-bold text-orange-600">{campaign.expectedCampaignCost}</p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-[10px] text-gray-600 mb-0.5">Expected Conversion</p>
                    <p className="text-xs font-bold text-purple-600">{campaign.expectedConversion}</p>
                  </div>
                </div>
                
                {/* Impact & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-purple-600 line-clamp-1">
                    {campaign.estimatedImpact}
                  </span>
                  <button 
                    onClick={(e) => handleSendMessages(stage, e)}
                    className="flex items-center gap-1 text-xs font-semibold border border-[#9747FF] text-[#9747FF] bg-white hover:bg-[#9747FF]/10 rounded px-2.5 py-2 group-hover:gap-1.5 transition-all whitespace-nowrap"
                    style={{ borderRadius: '4px' }}
                  >
                    Send Messages
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#9747FF]/0 to-[#9747FF]/0 group-hover:from-[#9747FF]/5 group-hover:to-[#9747FF]/2 pointer-events-none transition-all duration-200" style={{ borderRadius: '16px' }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

