 "use client";

import { CampaignCards } from "./CampaignCards";
import { AnalyticsCards } from "./AnalyticsCards";
import { TimeFilter } from "./TimeFilter";
import { MobileHeaderButton } from "./MobileHeaderButton";
import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil } from "lucide-react";
import { format, subDays, subMonths, subYears } from 'date-fns';
import { useDashboardData } from "@/hooks/useDashboardData";
import { useWorkflowAnalytics } from "@/hooks/useWorkflowAnalytics";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  CheckCircle,
  Target
} from "lucide-react";

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

  // Workflow automation data
  const { data: workflowAnalyticsData, loading: workflowLoading, error: workflowError } = useWorkflowAnalytics("7d");
  const { data: workflowData } = useWorkflowData();

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
      {/* Mobile Header with Menu Toggle and Add Business Records Button */}
      <header className="lg:hidden flex items-center justify-between p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
        <a 
          href="/business-log" 
          className="bg-[#7856ff] hover:bg-[#6d46e5] text-white px-3 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          <span className="hidden sm:inline">Add Business Records</span>
          <span className="sm:hidden">Add Records</span>
        </a>
      </header>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-16 lg:pt-0">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
            <div>
              <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
                {getGreeting()}, {user?.name || 'User'}
              </h1>
              <p className="text-[14px] text-[#2A2A2F] font-normal mt-2">
                🔒 Your data stays private. Always.
              </p>
            </div>
            <a 
              href="/business-log" 
              className="hidden lg:flex bg-[#7856ff] hover:bg-[#6d46e5] text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 items-center gap-2 mt-4 lg:mt-0 w-fit"
            >
              <Pencil className="w-4 h-4" />
              Add Business Records
            </a>
          </div>
        </header>

        {/* Campaign Cards Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
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

        {/* Workflow Automation Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12">


          {/* AI-Powered Insights */}
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
              <Brain size={20} className="text-[#6E4EFF]" />
              AI-Powered Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflowAnalyticsData?.insights.map((insight, index) => {
                const colors = {
                  success: {
                    bg: "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]",
                    border: "border-[#bbf7d0]",
                    icon: "text-[#16a34a]",
                    title: "text-[#166534]"
                  },
                  warning: {
                    bg: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]",
                    border: "border-[#fde68a]",
                    icon: "text-[#d97706]",
                    title: "text-[#92400e]"
                  },
                  info: {
                    bg: "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]",
                    border: "border-[#bfdbfe]",
                    icon: "text-[#2563eb]",
                    title: "text-[#1e40af]"
                  }
                };
                const colorScheme = colors[insight.type];
                const IconComponent = insight.type === "success" ? TrendingUp : insight.type === "warning" ? AlertTriangle : Info;

                return (
                  <div key={index} className={`${colorScheme.bg} rounded-lg border ${colorScheme.border} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IconComponent size={16} className={colorScheme.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold ${colorScheme.title} mb-1`}>{insight.title}</h4>
                        <p className="text-xs text-[#64748b] leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              }) || [
                {
                  type: "success" as const,
                  title: "High Engagement Peak",
                  description: "Your messages perform 23% better during 9:00 AM - 10:00 AM. Consider scheduling more campaigns during this window."
                },
                {
                  type: "warning" as const,
                  title: "SMS Response Rate",
                  description: "SMS response rate is 18.9%, below industry average of 25%. Consider A/B testing different message formats."
                },
                {
                  type: "info" as const,
                  title: "Template Performance",
                  description: "Template messages show 15% higher engagement than regular text messages. Expand your template library."
                }
              ].map((insight, index) => {
                const colors = {
                  success: {
                    bg: "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]",
                    border: "border-[#bbf7d0]",
                    icon: "text-[#16a34a]",
                    title: "text-[#166534]"
                  },
                  warning: {
                    bg: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]",
                    border: "border-[#fde68a]",
                    icon: "text-[#d97706]",
                    title: "text-[#92400e]"
                  },
                  info: {
                    bg: "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]",
                    border: "border-[#bfdbfe]",
                    icon: "text-[#2563eb]",
                    title: "text-[#1e40af]"
                  }
                };
                const colorScheme = colors[insight.type];
                const IconComponent = insight.type === "success" ? TrendingUp : insight.type === "warning" ? AlertTriangle : Info;

                return (
                  <div key={index} className={`${colorScheme.bg} rounded-lg border ${colorScheme.border} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IconComponent size={16} className={colorScheme.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold ${colorScheme.title} mb-1`}>{insight.title}</h4>
                        <p className="text-xs text-[#64748b] leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="border-t border-[#dbdbdb] p-6">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-[#2a2a2f] mb-3">
                Data-Driven Business Growth with Tab Dashboard
              </h2>
              <p className="text-[16px] text-[#696969] max-w-3xl mx-auto">
                Transform customer data into actionable insights. Track performance, optimize campaigns, and scale your business with precision.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href="/new-campaign" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all pointer-events-none opacity-50 cursor-not-allowed">
                Campaign Templates
              </a>
              <a href="/achievements" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all pointer-events-none opacity-50 cursor-not-allowed">
                Achievements
              </a>
              <a href="/business-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all pointer-events-none opacity-50 cursor-not-allowed">
                Business Solutions
              </a>
              <a href="/ai-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all pointer-events-none opacity-50 cursor-not-allowed">
                AI Insights
              </a>
              <a href="/settings?section=help-support" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all pointer-events-none opacity-50 cursor-not-allowed">
                Help and Support
              </a>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#e5e7eb] pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Mobile: Privacy links first, then copyright */}
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Privacy</a>
                  <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Terms</a>
                  <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Cookies</a>
                </div>
                <span className="text-[12px] text-[#696969]">© 2025 tribly. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[12px] text-[#696969]">v1.0.0</span>
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
