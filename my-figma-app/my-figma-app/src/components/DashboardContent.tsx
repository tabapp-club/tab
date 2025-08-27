"use client";

import { CampaignCards } from "./CampaignCards";
import { AnalyticsCards } from "./AnalyticsCards";
import { TimeFilter } from "./TimeFilter";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format, subDays, subMonths, subYears } from 'date-fns';
import { useDashboardData } from "@/hooks/useDashboardData";

export function DashboardContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
    // Initialize with static card structure
  const [staticCardStructure] = useState([
    {
      id: 1,
      title: "Total Sales",
      legendLabel: "Sales",
      unit: "Users",
      bgColor: "bg-[#17c653]"
    },
    {
      id: 2,
      title: "Purchase Value",
      legendLabel: "Purchase value",
      unit: "Rupees",
      bgColor: "bg-[#17c653]"
    },

    {
      id: 3,
      title: "New customers",
      legendLabel: "New customers",
      unit: "Users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 4,
      title: "Retained customers",
      legendLabel: "Retained customers",
      unit: "Users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 5,
      title: "Active customers",
      legendLabel: "Active customers",
      unit: "Users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 6,
      title: "Inactive customers",
      legendLabel: "Inactive customers",
      unit: "Users",
      bgColor: "bg-[#ff6b6b]"
    },

  ]);

  const [filterDays, setFilterDays] = useState<number | undefined>(undefined); // default to today (no filter_days)
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [currentFilterType, setCurrentFilterType] = useState<string>("today");
  const [sidePaneOpen, setSidePaneOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedCardData, setSelectedCardData] = useState<any>(null);

  // Use React Query to fetch dashboard data
  const { data: dashboardData, isLoading: loading, error } = useDashboardData({
    days: filterDays,
    dateRange
  });

  // Helper to generate date label based on filter
  const generateDateLabel = (filterType: string, days?: number, range?: { from: Date | null; to: Date | null }) => {
    const today = new Date();

    if (range && range.from && range.to) {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: range.from.getFullYear() !== today.getFullYear() || range.to.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      };

      const fromStr = range.from.toLocaleDateString('en-US', options);
      const toStr = range.to.toLocaleDateString('en-US', options);

      // Always include year if either date is not from current year
      if (range.from.getFullYear() !== today.getFullYear() || range.to.getFullYear() !== today.getFullYear()) {
        const optionsWithYear: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        };
        const fromStrWithYear = range.from.toLocaleDateString('en-US', optionsWithYear);
        const toStrWithYear = range.to.toLocaleDateString('en-US', optionsWithYear);
        return `${fromStrWithYear} - ${toStrWithYear}`;
      }

      return `${fromStr} - ${toStr}`;
    }

    switch (filterType) {
      case "today":
        return format(today, 'MMM d, yyyy');
      case "yesterday":
        return format(subDays(today, 1), 'MMM d, yyyy');
      case "7d":
        const sevenDaysAgo = subDays(today, 7);
        return `${format(sevenDaysAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      case "30d":
        const thirtyDaysAgo = subDays(today, 30);
        return `${format(thirtyDaysAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      case "3m":
        const threeMonthsAgo = subMonths(today, 3);
        return `${format(threeMonthsAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      case "6m":
        const sixMonthsAgo = subMonths(today, 6);
        return `${format(sixMonthsAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      case "12m":
        const twelveMonthsAgo = subYears(today, 1);
        return `${format(twelveMonthsAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      default:
        return format(today, 'MMM d, yyyy');
    }
  };



  // Process the dashboard data into analytics cards format
  const analyticsData = useMemo(() => {
    const dateLabel = generateDateLabel(currentFilterType, filterDays, dateRange);

    const updateCardData = (apiData: any, dateLabel: string) => {
      if (!apiData) return staticCardStructure.map(card => ({ ...card, subtitle: dateLabel, value: "-", previousValue: "-", trend: "down", trendValue: "0%" }));

      return staticCardStructure.map(card => {
        let value = "-";
        let previousValue = "-";
        let trend = "down";
        let trendValue = "0%";

        switch (card.title) {
          case "Total Sales":
            value = apiData.all_customers?.toLocaleString() ?? "-";
            previousValue = apiData.all_customers_prev?.toLocaleString() ?? "-";
            trend = apiData.all_customers_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.all_customers_change ?? 0).toFixed(2) + "%";
            break;
          case "Purchase Value":
            value = (apiData.total_revenue?.toLocaleString() ?? "-");
            previousValue = (apiData.total_revenue_prev?.toLocaleString() ?? "-");
            trend = apiData.total_revenue_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.total_revenue_change ?? 0).toFixed(2) + "%";
            break;
          case "New customers":
            value = apiData.new_customers?.toLocaleString() ?? "-";
            previousValue = apiData.new_customers_prev?.toLocaleString() ?? "-";
            trend = apiData.new_customers_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.new_customers_change ?? 0).toFixed(2) + "%";
            break;
          case "Retained customers":
            value = apiData.retained_customers?.toLocaleString() ?? "-";
            previousValue = apiData.retained_customers_prev?.toLocaleString() ?? "-";
            trend = apiData.retained_customers_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.retained_customers_change ?? 0).toFixed(2) + "%";
            break;
          case "Active customers":
            value = apiData.active_customers?.toLocaleString() ?? "-";
            previousValue = apiData.active_customers_prev?.toLocaleString() ?? "-";
            trend = apiData.active_customers_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.active_customers_change ?? 0).toFixed(2) + "%";
            break;
          case "Inactive customers":
            value = apiData.inactive_customers?.toLocaleString() ?? "-";
            previousValue = apiData.inactive_customers_prev?.toLocaleString() ?? "-";
            trend = apiData.inactive_customers_change >= 0 ? "up" : "down";
            trendValue = Math.abs(apiData.inactive_customers_change ?? 0).toFixed(2) + "%";
            break;
        }

        return {
          ...card,
          subtitle: dateLabel,
          value,
          previousValue,
          trend,
          trendValue
        };
      });
    };

    if (error) {
      return staticCardStructure.map(card => ({ ...card, subtitle: "Error", value: "-", previousValue: "-", trend: "down", trendValue: "0%" }));
    }

    if (loading || !dashboardData) {
      return staticCardStructure.map(card => ({ ...card, subtitle: "Loading...", value: "-", previousValue: "-", trend: "down", trendValue: "0%" }));
    }

    return updateCardData(dashboardData.data, dateLabel);
  }, [dashboardData, loading, error, currentFilterType, filterDays, dateRange, staticCardStructure]);

  // Handle filter change from TimeFilter
  const handleFilterChange = (filter: { type: string; days?: number; dateRange?: { from: Date | null; to: Date | null } }) => {
    setCurrentFilterType(filter.type);
    if (filter.type === 'custom' && filter.dateRange) {
      setDateRange(filter.dateRange);
      setFilterDays(undefined);
    } else {
      setFilterDays(filter.days);
      setDateRange({ from: null, to: null });
    }
  };

  // Handle Ask Reason button click
  const handleAskReason = (cardType: string, cardData: any) => {
    setSelectedCardType(cardType);
    setSelectedCardData(cardData);
    setSidePaneOpen(true);
  };

  // Handle sidepane close
  const handleSidePaneClose = () => {
    setSidePaneOpen(false);
    setSelectedCardType("");
    setSelectedCardData(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
            {getGreeting()}, {user?.name || 'User'}
          </h1>
          <p className="text-[14px] text-[#2A2A2F] font-normal mt-2">
            🔒 Your data stays private. Always.
          </p>
        </header>

        {/* Campaign Cards Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#ffffff] border border-[#dbdbdb] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaigns to grow your business
            </h2>
            <div className="w-full max-w-full overflow-hidden">
                <CampaignCards />
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="pb-6 sm:pb-8">
          <div className="mb-4 sm:mb-6">
              <TimeFilter onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full max-w-full overflow-hidden">
            {error && (
              <div className="text-center py-2 text-red-500 text-sm mb-4">{error.message}</div>
            )}
            <AnalyticsCards data={analyticsData} onAskReason={handleAskReason} loading={loading} />
          </div>
        </section>

        {/* Footer Section */}
        <footer className="mt-12 pt-8 border-t border-[#dbdbdb] p-6">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-[20px] font-bold text-[#2a2a2f] mb-3">
                Data-Driven Business Growth with Tab Dashboard
              </h2>
              <p className="text-[16px] text-[#696969] max-w-3xl mx-auto">
                Transform customer data into actionable insights. Track performance, optimize campaigns, and scale your business with precision.
              </p>
            </div>

            {/* Key Metrics Container */}
            <div className="rounded-lg p-4 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Customer Acquisition */}
                <div className="text-center p-4 flex-1">
                  <div className="text-[20px] font-bold text-[#2a2a2f] mb-1">2.4K</div>
                  <div className="text-[12px] text-[#696969]">New Customers</div>
                  <div className="text-[10px] text-[#696969] mt-1">This month</div>
                </div>

                {/* Vertical Separator */}
                <div className="hidden md:block w-px h-12 bg-[#e5e7eb] mx-4"></div>

                {/* Revenue Growth */}
                <div className="text-center p-4 flex-1">
                  <div className="text-[20px] font-bold text-[#2a2a2f] mb-1">₹4.2M</div>
                  <div className="text-[12px] text-[#696969]">Total Revenue</div>
                  <div className="text-[10px] text-[#696969] mt-1">Last 30 days</div>
                </div>

                {/* Vertical Separator */}
                <div className="hidden md:block w-px h-12 bg-[#e5e7eb] mx-4"></div>

                {/* Campaign Performance */}
                <div className="text-center p-4 flex-1">
                  <div className="text-[20px] font-bold text-[#2a2a2f] mb-1">6.8%</div>
                  <div className="text-[12px] text-[#696969]">Conversion Rate</div>
                  <div className="text-[10px] text-[#696969] mt-1">Industry avg: 2.9%</div>
                </div>

                {/* Vertical Separator */}
                <div className="hidden md:block w-px h-12 bg-[#e5e7eb] mx-4"></div>

                {/* Customer Retention */}
                <div className="text-center p-4 flex-1">
                  <div className="text-[20px] font-bold text-[#2a2a2f] mb-1">89%</div>
                  <div className="text-[12px] text-[#696969]">Retention Rate</div>
                  <div className="text-[10px] text-[#696969] mt-1">Last quarter</div>
                </div>
              </div>
            </div>



            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-[#fafafa] to-[#f5f5f5] p-5 rounded-lg border border-[#e5e5e5]">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📊</span>
                  <h3 className="text-[16px] font-semibold text-[#525252]">Analytics Dashboard</h3>
                </div>
                <p className="text-[13px] text-[#737373] mb-3">
                  Monitor real-time performance, track KPIs, and identify growth opportunities with detailed analytics.
                </p>
                <a href="/data-center" className="text-[13px] text-[#7856ff] font-medium hover:underline">
                  View Analytics →
                </a>
              </div>

              <div className="bg-gradient-to-r from-[#fafafa] to-[#f5f5f5] p-5 rounded-lg border border-[#e5e5e5]">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🎯</span>
                  <h3 className="text-[16px] font-semibold text-[#525252]">Customer Segmentation</h3>
                </div>
                <p className="text-[13px] text-[#737373] mb-3">
                  Create targeted campaigns with AI-powered customer segmentation and behavioral analysis.
                </p>
                <a href="/cohorts" className="text-[13px] text-[#17c653] font-medium hover:underline">
                  Manage Segments →
                </a>
              </div>

              <div className="bg-gradient-to-r from-[#fafafa] to-[#f5f5f5] p-5 rounded-lg border border-[#e5e5e5]">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🚀</span>
                  <h3 className="text-[16px] font-semibold text-[#525252]">Campaign Builder</h3>
                </div>
                <p className="text-[13px] text-[#737373] mb-3">
                  Launch high-converting campaigns with pre-built templates and AI optimization recommendations.
                </p>
                <a href="/new-campaign" className="text-[13px] text-[#ff6b6b] font-medium hover:underline">
                  Create Campaign →
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a href="/templates" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-[#2a2a2f] hover:border-[#7856ff] transition-all">
                📋 Campaign Templates
              </a>
              <a href="/achievements" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-[#2a2a2f] hover:border-[#17c653] transition-all">
                🏆 Achievements
              </a>
              <a href="/business-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-[#2a2a2f] hover:border-[#ff6b6b] transition-all">
                💼 Business Solutions
              </a>
              <a href="/ai-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-[#2a2a2f] hover:border-[#ffa726] transition-all">
                🤖 AI Insights
              </a>
              <a href="/contact" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-[#2a2a2f] hover:border-[#7856ff] transition-all">
                📞 Get Support
              </a>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#e5e7eb] pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <span className="text-[12px] text-[#696969]">© 2024 TabApp. All rights reserved.</span>
                <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Privacy</a>
                <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Terms</a>
                <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Cookies</a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[12px] text-[#696969]">v1.0.0</span>
                <span className="text-[12px] text-[#696969]">•</span>
                <span className="text-[12px] text-[#696969]">Updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Analysis Sidepane */}
      <AIAnalysisSidepane
        isOpen={sidePaneOpen}
        onClose={handleSidePaneClose}
        cardType={selectedCardType}
        cardData={selectedCardData}
        filterDays={filterDays}
        dateRange={dateRange}
      />
    </main>
  );
}
