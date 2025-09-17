'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileMenuToggle } from './MobileMenuToggle';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomerData } from '@/hooks/useCustomerData';

// Analytics calculation functions
const calculateEngagementScore = (visits: number, daysSinceJoin: number) => {
  const visitsPerMonth = visits / Math.max(daysSinceJoin / 30, 1);
  if (visitsPerMonth > 3) return { score: 95, level: 'Exceptional', color: 'bg-emerald-500' };
  if (visitsPerMonth > 2) return { score: 85, level: 'Very High', color: 'bg-green-500' };
  if (visitsPerMonth > 1) return { score: 70, level: 'High', color: 'bg-blue-500' };
  if (visitsPerMonth > 0.5) return { score: 50, level: 'Medium', color: 'bg-yellow-500' };
  return { score: 25, level: 'Low', color: 'bg-red-500' };
};

const calculateRetentionScore = (visits: number, totalSpent: number, avgOrderValue: number, categories: string[]) => {
  let score = 50;
  if (visits > 10) score += 25;
  if (visits > 5) score += 15;
  if (totalSpent > 1000) score += 20;
  if (totalSpent > 500) score += 10;
  if (avgOrderValue > 150) score += 10;
  if (categories.length > 2) score += 5;
  if (visits < 2) score -= 30;
  if (totalSpent < 100) score -= 20;
  return Math.max(0, Math.min(100, score));
};

const calculateCustomerLifetimeValue = (avgOrderValue: number, visits: number, daysSinceJoin: number) => {
  const purchaseFrequency = visits / Math.max(daysSinceJoin / 365, 1);
  const customerLifespan = 3; // years
  return avgOrderValue * purchaseFrequency * customerLifespan;
};

const getCustomerSegment = (totalSpent: number, visits: number) => {
  if (totalSpent > 2000 && visits > 15) return { segment: 'VIP', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👑' };
  if (totalSpent > 1000 && visits > 10) return { segment: 'Premium', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '⭐' };
  if (totalSpent > 500 && visits > 5) return { segment: 'Regular', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' };
  return { segment: 'New', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '🆕' };
};

const getRiskLevel = (visits: number, daysSinceLastPurchase: number) => {
  if (visits < 2) return { level: 'High Risk', color: 'bg-red-100 text-red-800 border-red-200' };
  if (daysSinceLastPurchase > 90) return { level: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  return { level: 'Low Risk', color: 'bg-green-100 text-green-800 border-green-200' };
};

export default function CustomerDetailsClient({ customerId }: { customerId: string }) {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    const validTabs = ['overview', 'analytics', 'history', 'insights'];
    
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Function to update URL when tab changes
  const updateTabURL = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/customer/${customerId}?${params.toString()}`, { scroll: false });
  };

  // Use the real API data hook
  const { data: customerData, isLoading: loading, error } = useCustomerData({ customerId });

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Calculate all analytics
  const daysSinceJoin = customerData ? Math.floor((Date.now() - new Date(customerData.joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysSinceLastPurchase = customerData ? Math.floor((Date.now() - new Date(customerData.purchaseHistory[0]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const engagementScore = customerData ? calculateEngagementScore(customerData.visits, daysSinceJoin) : { score: 0, level: 'Unknown', color: 'bg-gray-500' };
  const retentionScore = customerData ? calculateRetentionScore(customerData.visits, customerData.totalSpent, customerData.averageOrderValue, customerData.categories) : 0;
  const customerLifetimeValue = customerData ? calculateCustomerLifetimeValue(customerData.averageOrderValue, customerData.visits, daysSinceJoin) : 0;
  const customerSegment = customerData ? getCustomerSegment(customerData.totalSpent, customerData.visits) : { segment: 'Unknown', color: '', icon: '❓' };
  const riskLevel = customerData ? getRiskLevel(customerData.visits, daysSinceLastPurchase) : { level: 'Unknown', color: '' };

  // Calculate purchase trend
  const purchaseTrend = customerData && customerData.purchaseHistory.length >= 2 ?
    (() => {
      const recent = customerData.purchaseHistory.slice(0, 3);
      const older = customerData.purchaseHistory.slice(-3);
      const recentAvg = recent.reduce((sum, p) => sum + p.amount, 0) / recent.length;
      const olderAvg = older.reduce((sum, p) => sum + p.amount, 0) / older.length;
      if (recentAvg > olderAvg * 1.1) return 'up';
      if (recentAvg < olderAvg * 0.9) return 'down';
      return 'stable';
    })() : 'stable';

  if (loading) {
    return (
      <div className="flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
            <MobileMenuToggle />
            <h1 className="text-base sm:text-lg font-bold truncate">Customer Intelligence</h1>
          </header>
          <main className={`flex-1 transition-all duration-300 min-w-0 ${actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'}`}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E4EFF] mx-auto mb-4"></div>
                <p className="text-[#626266]">Loading customer data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
            <MobileMenuToggle />
            <h1 className="text-base sm:text-lg font-bold truncate">Customer Intelligence</h1>
          </header>
          <main className={`flex-1 transition-all duration-300 min-w-0 ${actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'}`}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-[#2a2a2f] mb-2">Error Loading Customer Data</h2>
                <p className="text-[#626266] mb-4">{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#6E4EFF] text-white rounded hover:bg-[#6E4EFF]/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
            <MobileMenuToggle />
            <h1 className="text-base sm:text-lg font-bold truncate">Customer Intelligence</h1>
          </header>
          <main className={`flex-1 transition-all duration-300 min-w-0 ${actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'}`}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-6xl mb-4">👤</div>
                <h2 className="text-xl font-bold text-[#2a2a2f] mb-2">Customer Not Found</h2>
                <p className="text-[#626266] mb-4">The customer you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-[#6E4EFF] text-white rounded hover:bg-[#6E4EFF]/90 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-start p-3 sm:p-4 border-b border-gray-200 lg:hidden">
          <MobileMenuToggle />
        </header>
        <main className={`flex-1 transition-all duration-300 min-w-0 ${actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'}`}>
          <div className="h-full flex flex-col min-w-0">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 flex flex-col min-w-0 overflow-y-auto">

              {/* Header with Back Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/data-center')}
                  className="p-2 text-[#626266] hover:bg-white rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div>
                  <h1 className="text-[20px] font-bold text-[#2a2a2f]">Customer Intelligence</h1>
                  <p className="text-[#626266] text-[14px] font-normal">Comprehensive analytics & engagement insights</p>
                </div>
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className="hidden lg:flex gap-3 w-fit">
                <button className="px-4 py-2 text-[#6E4EFF] bg-white border border-[#6E4EFF] rounded font-semibold text-sm hover:bg-[#6E4EFF] hover:text-white transition-all duration-200">
                  Send Message
                </button>
                <button className="px-4 py-2 bg-[#6E4EFF] text-white rounded font-semibold text-sm hover:bg-[#6E4EFF]/90 transition-all duration-200">
                  Create Campaign
                </button>
              </div>

              {/* Customer Profile Card */}
              <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {customerData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#2a2a2f] mb-1">{customerData.name}</h2>
                      <p className="text-[#626266] text-[14px] font-normal mb-2">ID: {customerData.id} • {customerData.mobile}</p>
                      <div className="flex gap-2 overflow-x-auto sm:flex-wrap scrollbar-hide pb-1 sm:pb-0">
                        <span className={`px-3 py-1 text-[12px] font-normal rounded-full border flex-shrink-0 ${customerData.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                          {customerData.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                        <span className={`px-3 py-1 text-[12px] font-normal rounded-full border flex-shrink-0 ${customerSegment.color}`}>
                          {customerSegment.icon} {customerSegment.segment}
                        </span>
                        <span className={`px-3 py-1 text-[12px] font-normal rounded-full border flex-shrink-0 ${riskLevel.color}`}>
                          {riskLevel.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="lg:ml-auto flex flex-wrap gap-0 border border-[#e9e9e9] rounded">
                    <div className="text-center flex-1 p-4 border-r border-[#e9e9e9] last:border-r-0">
                      <p className="text-[16px] font-bold text-[#2a2a2f]">₹{customerData.totalSpent.toLocaleString()}</p>
                      <p className="text-[12px] font-normal text-[#626266]">Total Spent</p>
                    </div>
                    <div className="text-center flex-1 p-4 border-r border-[#e9e9e9] last:border-r-0">
                      <p className="text-[16px] font-bold text-[#2a2a2f]">{customerData.visits}</p>
                      <p className="text-[12px] font-normal text-[#626266]">Total Visits</p>
                    </div>
                    <div className="text-center flex-1 p-4 border-r border-[#e9e9e9] last:border-r-0">
                      <p className="text-[16px] font-bold text-[#2a2a2f]">{customerData.categories.length}</p>
                      <p className="text-[12px] font-normal text-[#626266]">Categories</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Score */}
                <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#2a2a2f]">Engagement Score</h3>
                    <span className="text-2xl">{engagementScore.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                    <div
                      className={`${engagementScore.color} h-1 rounded-full transition-all duration-1000`}
                      style={{ width: `${engagementScore.score}%` }}
                    ></div>
                  </div>
                  <p className="text-[12px] font-normal text-[#626266] mb-4">{engagementScore.level} engagement level</p>
                  <div className="space-y-2 text-[14px] font-normal">
                    <div className="flex justify-between">
                      <span className="text-[#626266]">Visits per month:</span>
                      <span className="font-medium">{(customerData.visits / Math.max(daysSinceJoin / 30, 1)).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#626266]">Last activity:</span>
                      <span className="font-medium">{daysSinceLastPurchase} days ago</span>
                    </div>
                  </div>
                </div>

                {/* Retention Score */}
                <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#2a2a2f]">Retention Score</h3>
                    <span className="text-2xl">{retentionScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                    <div
                      className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${retentionScore}%` }}
                    ></div>
                  </div>
                  <p className="text-[12px] font-normal text-[#626266] mb-4">
                    {retentionScore >= 80 ? 'Excellent retention' :
                     retentionScore >= 60 ? 'Good retention' :
                     retentionScore >= 40 ? 'Moderate retention' : 'Needs attention'}
                  </p>
                  <div className="space-y-2 text-[14px] font-normal">
                    <div className="flex justify-between">
                      <span className="text-[#626266]">Customer lifetime:</span>
                      <span className="font-medium">₹{customerLifetimeValue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#626266]">Avg order value:</span>
                      <span className="font-medium">₹{customerData.averageOrderValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#2a2a2f]">Risk Assessment</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${riskLevel.color}`}>
                      {riskLevel.level}
                    </span>
                  </div>
                  <div className="space-y-4 text-[14px] font-normal">
                    <div className="flex justify-between items-center">
                      <span className="text-[#626266]">Churn Risk:</span>
                      <span className="font-medium">{100 - retentionScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#626266]">Days since last purchase:</span>
                      <span className="font-medium">{daysSinceLastPurchase}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#626266]">Purchase frequency:</span>
                      <span className="font-medium">{(customerData.visits / Math.max(daysSinceJoin / 30, 1)).toFixed(1)}/month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded border border-[#e9e9e9]">
                <div className="flex overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: 'none' }}>
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'engagement', label: 'Engagement', icon: '🎯' },
                    { id: 'purchases', label: 'Purchases', icon: '🛒' },
                    { id: 'analytics', label: 'Analytics', icon: '📈' },
                    { id: 'insights', label: 'Insights', icon: '💡' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        updateTabURL(tab.id);
                      }}
                      className={`flex-shrink-0 px-4 py-4 font-medium text-sm transition-all duration-200 relative min-w-fit ${
                        activeTab === tab.id
                          ? 'text-[#6E4EFF] border-b-2 border-[#6E4EFF] bg-[#6E4EFF]/5 rounded-t'
                          : 'text-[#626266] hover:text-[#6E4EFF] hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 overflow-x-auto scrollbar-hide">
                    {/* Purchase History */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-bold text-[#2a2a2f]">Recent Purchases</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {customerData.purchaseHistory.length} Orders
                        </span>
                      </div>
                      <div className="space-y-3">
                        {customerData.purchaseHistory.slice(0, 5).map((purchase) => (
                          <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[#e9e9e9] min-w-0">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 bg-[#6E4EFF] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {purchase.category.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-[#2a2a2f] text-[14px] font-normal truncate">Order #{purchase.id}</p>
                                <p className="text-[12px] font-normal text-[#626266] truncate">{purchase.category} • {purchase.items} items</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <p className="font-semibold text-[#2a2a2f] text-[14px] font-normal">₹{purchase.amount.toFixed(2)}</p>
                              <p className="text-[12px] font-normal text-[#626266]">{new Date(purchase.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Insights */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6 min-w-0">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Quick Insights</h3>
                      <div className="space-y-3">
                        {customerData.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-[#e9e9e9] min-w-0">
                            <span className="text-lg flex-shrink-0">{insight.type === 'positive' ? '🎯' : insight.type === 'negative' ? '⚠️' : 'ℹ️'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#2a2a2f] text-[14px] font-normal break-words">{insight.title}</p>
                              <p className="text-[12px] font-normal text-[#626266] mt-1 break-words">{insight.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'engagement' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Engagement Timeline */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Engagement Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-[14px] font-normal">Customer joined</p>
                            <p className="text-[12px] font-normal text-[#626266]">{new Date(customerData.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-[14px] font-normal">First purchase</p>
                            <p className="text-[12px] font-normal text-[#626266]">{customerData.purchaseHistory.length > 0 ? new Date(customerData.purchaseHistory[customerData.purchaseHistory.length - 1].date).toLocaleDateString() : 'No purchases yet'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-[14px] font-normal">Latest activity</p>
                            <p className="text-[12px] font-normal text-[#626266]">{customerData.purchaseHistory.length > 0 ? new Date(customerData.purchaseHistory[0].date).toLocaleDateString() : 'No recent activity'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Engagement Metrics</h3>
                      <div className="space-y-4 text-[14px] font-normal">
                        <div className="flex justify-between items-center">
                          <span className="text-[#626266]">Total visits:</span>
                          <span className="font-semibold">{customerData.visits}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#626266]">Visits per month:</span>
                          <span className="font-semibold">{(customerData.visits / Math.max(daysSinceJoin / 30, 1)).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#626266]">Days since last visit:</span>
                          <span className="font-semibold">{daysSinceLastPurchase}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#626266]">Engagement level:</span>
                          <span className="font-semibold">{engagementScore.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'purchases' && (
                  <div className="space-y-6">
                    {/* Purchase History */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <div className="mb-6">
                        <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-3">Complete Purchase History</h3>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                            {customerData.purchaseHistory.length} Orders
                          </span>
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                            ₹{customerData.totalSpent.toLocaleString()} Total
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {customerData.purchaseHistory.map((purchase) => (
                          <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#6E4EFF] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {purchase.category.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-[#2a2a2f] text-[14px] font-normal">Order #{purchase.id}</p>
                                <p className="text-[14px] font-normal text-[#626266]">{purchase.category} • {purchase.items} items</p>
                                <p className="text-[12px] font-normal text-[#626266]">{new Date(purchase.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#2a2a2f]">₹{purchase.amount.toFixed(2)}</p>
                              <p className="text-[12px] font-normal text-[#626266]">{purchase.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Performance */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Category Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customerData.categories.map((category) => {
                          const categoryPurchases = customerData.purchaseHistory.filter(p => p.category === category);
                          const totalSpent = categoryPurchases.reduce((sum, p) => sum + p.amount, 0);
                          const percentage = (categoryPurchases.length / customerData.purchaseHistory.length) * 100;

                          return (
                            <div key={category} className="p-4 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-[#2a2a2f] text-[14px] font-normal">{category}</h4>
                                <span className="text-[12px] font-normal text-[#626266]">{categoryPurchases.length} orders</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-[#2a2a2f]">₹{totalSpent.toFixed(2)}</span>
                                <span className="text-[12px] font-normal text-[#626266]">{percentage.toFixed(1)}% of total</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Analytics */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Financial Analytics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Customer Lifetime Value:</span>
                          <span className="font-semibold text-lg">₹{customerLifetimeValue.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Average Order Value:</span>
                          <span className="font-semibold text-lg">₹{customerData.averageOrderValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Purchase Frequency:</span>
                          <span className="font-semibold text-lg">{(customerData.visits / Math.max(daysSinceJoin / 30, 1)).toFixed(1)}/month</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Total Revenue:</span>
                          <span className="font-semibold text-lg">₹{customerData.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Behavioral Analytics */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Behavioral Analytics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Days since last purchase:</span>
                          <span className="font-semibold">{daysSinceLastPurchase}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Categories explored:</span>
                          <span className="font-semibold">{customerData.categories.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Member for:</span>
                          <span className="font-semibold">{Math.floor(daysSinceJoin / 30)} months</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-[#e9e9e9]">
                          <span className="text-[14px] font-normal text-[#626266]">Engagement score:</span>
                          <span className="font-semibold">{engagementScore.score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">AI-Powered Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🎯</span>
                            <h4 className="font-medium text-[#2a2a2f] text-[14px] font-normal">Recommendation</h4>
                          </div>
                          <p className="text-[14px] font-normal text-[#626266]">
                            {retentionScore >= 80 ? 'This customer is highly engaged. Consider VIP treatment and exclusive offers.' :
                             retentionScore >= 60 ? 'Good engagement level. Focus on increasing purchase frequency with targeted campaigns.' :
                             'Customer needs re-engagement. Send personalized offers and check-in messages.'}
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📈</span>
                            <h4 className="font-medium text-[#2a2a2f] text-[14px] font-normal">Growth Opportunity</h4>
                          </div>
                          <p className="text-[14px] font-normal text-[#626266]">
                            {customerData.categories.length < 3 ? 'Expand category exploration with cross-selling campaigns.' :
                             'Focus on increasing average order value with premium products.'}
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">⏰</span>
                            <h4 className="font-medium text-[#2a2a2f] text-[14px] font-normal">Next Best Action</h4>
                          </div>
                          <p className="text-[14px] font-normal text-[#626266]">
                            {daysSinceLastPurchase > 30 ? 'Send re-engagement email with personalized offer.' :
                             'Create targeted campaign for new category exploration.'}
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">💡</span>
                            <h4 className="font-medium text-[#2a2a2f] text-[14px] font-normal">Risk Alert</h4>
                          </div>
                          <p className="text-[14px] font-normal text-[#626266]">
                            {riskLevel.level === 'High Risk' ? 'High churn risk detected. Immediate re-engagement needed.' :
                             riskLevel.level === 'Medium Risk' ? 'Monitor engagement closely. Consider retention campaigns.' :
                             'Low risk customer. Focus on growth and loyalty building.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-white rounded-xl border border-[#e9e9e9] p-6">
                      <h3 className="text-[16px] font-bold text-[#2a2a2f] mb-4">Recommended Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2a2a2f] text-[14px] font-normal">Send Personalized Email</p>
                              <p className="text-[12px] font-normal text-[#626266]">Based on purchase history and preferences</p>
                            </div>
                            <span className="text-blue-600">→</span>
                          </div>
                        </button>

                        <button className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2a2a2f] text-[14px] font-normal">Create Targeted Campaign</p>
                              <p className="text-[12px] font-normal text-[#626266]">For category expansion or re-engagement</p>
                            </div>
                            <span className="text-green-600">→</span>
                          </div>
                        </button>

                        <button className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2a2a2f] text-[14px] font-normal">Schedule Follow-up</p>
                              <p className="text-[12px] font-normal text-[#626266]">Set reminder for next engagement touchpoint</p>
                            </div>
                            <span className="text-purple-600">→</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Mobile Only */}
              <div className="lg:hidden flex gap-3 w-full mt-6">
                <button className="flex-1 px-4 py-3 text-[#6E4EFF] bg-white border border-[#6E4EFF] rounded font-semibold text-sm hover:bg-[#6E4EFF] hover:text-white transition-all duration-200">
                  Send Message
                </button>
                <button className="flex-1 px-4 py-3 bg-[#6E4EFF] text-white rounded font-semibold text-sm hover:bg-[#6E4EFF]/90 transition-all duration-200">
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
