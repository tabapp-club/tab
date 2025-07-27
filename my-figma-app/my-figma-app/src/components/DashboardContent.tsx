"use client";

import { CampaignCards } from "./CampaignCards";
import { AnalyticsCards } from "./AnalyticsCards";
import { TimeFilter } from "./TimeFilter";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format, subDays, subMonths, subYears } from 'date-fns';

export function DashboardContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
    // Initialize with static card structure
  const [staticCardStructure] = useState([
    {
      id: 1,
      title: "All customers",
      legendLabel: "Unique + Retained customers",
      unit: "users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 2,
      title: "New customers",
      legendLabel: "New customers",
      unit: "users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 3,
      title: "Retained customers",
      legendLabel: "Retained customers",
      unit: "users",
      bgColor: "bg-[#7856ff]"
    },
    {
      id: 4,
      title: "Active customers",
      legendLabel: "Active customers",
      unit: "users",
      bgColor: "bg-[#7856ff]"
    }
  ]);

  const [analyticsData, setAnalyticsData] = useState<any[]>(() =>
    staticCardStructure.map(card => ({ ...card, subtitle: "Loading...", value: "-", trend: "down", trendValue: "0%" }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDays, setFilterDays] = useState<number | undefined>(0); // default to today
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [currentFilterType, setCurrentFilterType] = useState<string>("today");
  const [sidePaneOpen, setSidePaneOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedCardData, setSelectedCardData] = useState<any>(null);

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



  // Helper to update only the dynamic data
  const updateCardData = (apiData: any, dateLabel: string) => {
    if (!apiData) return staticCardStructure.map(card => ({ ...card, subtitle: dateLabel, value: "-", trend: "down", trendValue: "0%" }));

    return staticCardStructure.map(card => {
      let value = "-";
      let trend = "down";
      let trendValue = "0%";

      switch (card.title) {
        case "All customers":
          value = apiData.all_customers?.toLocaleString() ?? "-";
          trend = apiData.all_customers_change >= 0 ? "up" : "down";
          trendValue = (apiData.all_customers_change ?? 0) + "%";
          break;
        case "New customers":
          value = apiData.new_customers?.toLocaleString() ?? "-";
          trend = apiData.new_customers_change >= 0 ? "up" : "down";
          trendValue = (apiData.new_customers_change ?? 0) + "%";
          break;
        case "Retained customers":
          value = apiData.retained_customers?.toLocaleString() ?? "-";
          trend = apiData.retained_customers_change >= 0 ? "up" : "down";
          trendValue = (apiData.retained_customers_change ?? 0) + "%";
          break;
        case "Active customers":
          value = apiData.active_customers?.toLocaleString() ?? "-";
          trend = apiData.active_customers_change >= 0 ? "up" : "down";
          trendValue = (apiData.active_customers_change ?? 0) + "%";
          break;
      }

      return {
        ...card,
        subtitle: dateLabel,
        value,
        trend,
        trendValue
      };
    });
  };

  const fetchDashboardData = useCallback(async (days?: number, range?: { from: Date | null; to: Date | null }) => {
    if (!user?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const url = "http://74.225.174.33:8080/v1/business-data";
      let params = '';
      if (range && range.from && range.to) {
        const start_date = format(range.from, 'yyyy-MM-dd');
        const end_date = format(range.to, 'yyyy-MM-dd');
        params = `?start_date=${start_date}&end_date=${end_date}`;
      } else if (days) {
        params = `?filter_days=${days}`;
      }
      const response = await fetch(url + params, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "API error");

      // Generate date label based on current filter
      const dateLabel = generateDateLabel(currentFilterType, days, range);
      setAnalyticsData(updateCardData(result.data, dateLabel));
    } catch (err: any) {
      setError(err.message || "Unknown error");
      // Keep the cards visible with error state instead of clearing them
      setAnalyticsData(staticCardStructure.map(card => ({ ...card, subtitle: "Error", value: "-", trend: "down", trendValue: "0%" })));
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, currentFilterType, staticCardStructure]);

  useEffect(() => {
    fetchDashboardData(filterDays, dateRange.from && dateRange.to ? dateRange : undefined);
  }, [fetchDashboardData, filterDays, dateRange]);

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
          <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">
            {getGreeting()}
          </h1>
        </header>

        {/* Campaign Cards Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#f6f6f6] border border-[#dbdbdb] box-border overflow-hidden">
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
              <div className="text-center py-2 text-red-500 text-sm mb-4">{error}</div>
            )}
            <AnalyticsCards data={analyticsData} onAskReason={handleAskReason} loading={loading} />
          </div>
        </section>
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
