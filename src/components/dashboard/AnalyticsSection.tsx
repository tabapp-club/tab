"use client";

import { useState, useMemo } from "react";
import { TimeFilter } from "../TimeFilter";
import { AnalyticsCards } from "../AnalyticsCards";
import { useDashboardData } from "@/hooks/useDashboardData";
import { format, subDays, subMonths, subYears } from 'date-fns';
import { STATIC_CARD_STRUCTURE, StaticCardStructure } from "@/constants/dashboard";



interface AnalyticsSectionProps {
  onAskReason: (cardType: string, cardData: any) => void;
}

export function AnalyticsSection({ onAskReason }: AnalyticsSectionProps) {
  const staticCardStructure = STATIC_CARD_STRUCTURE;
  const [filterDays, setFilterDays] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [currentFilterType, setCurrentFilterType] = useState<string>("today");

  const { data: dashboardData, isLoading: loading, error } = useDashboardData({
    days: filterDays,
    dateRange
  });

  // Helper to generate date label based on filter
  const generateDateLabel = (filterType: string, range?: { from: Date | null; to: Date | null }) => {
    const today = new Date();

    if (range && range.from && range.to) {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: range.from.getFullYear() !== today.getFullYear() || range.to.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      };

      const fromStr = range.from.toLocaleDateString('en-US', options);
      const toStr = range.to.toLocaleDateString('en-US', options);

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
    const dateLabel = generateDateLabel(currentFilterType, dateRange);

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
  }, [dashboardData, loading, error, currentFilterType, dateRange, staticCardStructure]);

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

  return (
    <section className="pb-6 sm:pb-8">
      <div className="mb-4 sm:mb-6">
        <TimeFilter onFilterChange={handleFilterChange} />
      </div>
      <div className="w-full max-w-full overflow-hidden">
        {error && (
          <div className="text-center py-2 text-red-500 text-sm mb-4">{error.message}</div>
        )}
        <AnalyticsCards data={analyticsData} onAskReason={onAskReason} loading={loading} />
      </div>
    </section>
  );
}