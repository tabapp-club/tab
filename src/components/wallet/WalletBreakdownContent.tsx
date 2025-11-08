"use client";

import { useState } from "react";
import { TimeFilter } from "@/components/TimeFilter";
import { useWalletSpendingBreakdown, useWalletBalance, useWalletTransactions } from "@/hooks/useWalletData";
import { formatCurrency, formatCurrencyWithDecimals } from "@/lib/utils";
import { TransactionCategory, WalletTransaction } from "@/lib/api/types";

const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  digital_invoice: "📄",
  targeted_campaign: "🎯",
  event_campaign: "📅",
  followup_reminder: "🔔",
  recharge: "💳",
  refund: "↩️",
};

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  image: "Image",
  template: "Template",
  media: "Media",
  interactive: "Interactive",
  document: "Document",
  video: "Video",
  audio: "Audio",
};

const formatChannel = (channel: string | string[] | undefined): string => {
  if (!channel) return "";
  if (Array.isArray(channel)) {
    return channel.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" and ");
  }
  return channel.charAt(0).toUpperCase() + channel.slice(1);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function WalletBreakdownContent() {
  const [breakdownFilterDays, setBreakdownFilterDays] = useState<number | undefined>(undefined);
  const [breakdownDateRange, setBreakdownDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);

  // Use breakdown-specific date filters
  // Calculate date range from days filter if no custom range is set
  let breakdownStartDate: string | undefined;
  let breakdownEndDate: string | undefined;
  
  if (breakdownDateRange.from && breakdownDateRange.to) {
    breakdownStartDate = breakdownDateRange.from.toISOString().split('T')[0];
    breakdownEndDate = breakdownDateRange.to.toISOString().split('T')[0];
  } else if (breakdownFilterDays !== undefined) {
    // Calculate start date based on days filter
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - breakdownFilterDays);
    breakdownStartDate = startDate.toISOString().split('T')[0];
    breakdownEndDate = endDate.toISOString().split('T')[0];
  }
  
  const { data: breakdownData, isLoading: breakdownLoading } = useWalletSpendingBreakdown(
    breakdownStartDate,
    breakdownEndDate
  );

  // Fetch transactions for selected category
  const categoryTransactionFilters = selectedCategory ? {
    page: 1,
    page_size: 50,
    category: selectedCategory,
    ...(breakdownStartDate && breakdownEndDate && {
      start_date: breakdownStartDate,
      end_date: breakdownEndDate,
    }),
    ...(!breakdownStartDate && !breakdownEndDate && breakdownFilterDays !== undefined && {
      filter_days: breakdownFilterDays,
    }),
  } : undefined;

  const { data: categoryTransactionsData, isLoading: categoryTransactionsLoading } = useWalletTransactions(
    categoryTransactionFilters
  );

  // Handle date filter change for spending breakdown
  const handleBreakdownDateFilterChange = (filter: { type: string; days?: number; dateRange?: { from: Date | null; to: Date | null } }) => {
    if (filter.type === 'custom' && filter.dateRange) {
      setBreakdownDateRange(filter.dateRange);
      setBreakdownFilterDays(undefined);
    } else {
      setBreakdownFilterDays(filter.days);
      setBreakdownDateRange({ from: null, to: null });
    }
  };

  const { data: balanceData } = useWalletBalance();
  const breakdown = breakdownData?.data;
  const balance = balanceData?.data.balance ?? 0;
  const currency = balanceData?.data.currency ?? "INR";
  const categoryTransactions = categoryTransactionsData?.data.transactions ?? [];
  const selectedCategoryData = breakdown?.categories.find(cat => cat.category === selectedCategory);

  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="mb-0 flex justify-end">
        <TimeFilter onFilterChange={handleBreakdownDateFilterChange} />
      </div>

      {breakdownLoading ? (
        <div className="text-center py-8 text-[#626266]">Loading breakdown...</div>
      ) : breakdown ? (
        <>
          {/* Summary Card */}
          <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
            <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
              <div className="flex items-center justify-between gap-4 w-full">
                <div>
                  <p className="text-xs text-[#626266] mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-[#2a2a2f]">
                    {formatCurrency(breakdown.total_spent, "INR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#626266] mb-1">Available Balance</p>
                  <p className="text-xl font-bold text-[#2a2a2f]">
                    {formatCurrency(balance, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedCategory ? (
            /* Category Detail View */
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-[#626266] hover:text-[#2a2a2f] transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Breakdown</span>
              </button>

              {/* Category Header */}
              <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
                <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{CATEGORY_ICONS[selectedCategory]}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a2a2f]">
                          {selectedCategoryData?.category_label || selectedCategory}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-[#626266] mb-0.5">Total Spent</p>
                        <p className="text-base font-bold text-[#2a2a2f]">
                          {formatCurrency(selectedCategoryData?.total_spent || 0, "INR")}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#626266] mb-0.5">Transactions</p>
                        <p className="text-base font-bold text-[#2a2a2f]">
                          {selectedCategoryData?.transaction_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
                <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
                  <div className="w-full space-y-3">
                <h4 className="font-semibold text-[#2a2a2f]">Transaction Details</h4>
                {categoryTransactionsLoading ? (
                  <div className="text-center py-8 text-[#626266]">Loading transactions...</div>
                ) : categoryTransactions.length === 0 ? (
                  <div className="text-center py-8 text-[#626266]">No transactions found</div>
                ) : (
                  categoryTransactions.map((transaction: WalletTransaction) => (
                    <div
                      key={transaction._id}
                      className="py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{CATEGORY_ICONS[transaction.category]}</span>
                            <p className="text-sm font-medium text-[#2a2a2f]">
                              {transaction.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 ml-6">
                            <p className="text-xs text-[#626266]">{formatDate(transaction.created_at)}</p>
                            {transaction.message_type && (
                              <span className="text-xs text-[#626266]">
                                • {MESSAGE_TYPE_LABELS[transaction.message_type] || transaction.message_type}
                              </span>
                            )}
                            {transaction.communication_channel && (
                              <span className="text-xs text-[#626266]">
                                • {formatChannel(transaction.communication_channel)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p
                            className={`text-sm font-semibold ${
                              transaction.type === "credit" ? "text-green-600" : "text-red-400"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrencyWithDecimals(transaction.amount, "INR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Category Breakdown */
            <div className="space-y-2">
              <h3 className="font-semibold text-[#2a2a2f] mb-2">Category-wise Spending</h3>
              {breakdown.categories.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9] hover:border-[#9747FF] transition-colors cursor-pointer"
                >
                  <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full text-left">
                    <div className="flex gap-2.5 items-center justify-start relative shrink-0">
                      <div className="relative shrink-0 size-11 flex items-center justify-center rounded-lg bg-gray-50">
                        <span className="text-xl">{CATEGORY_ICONS[category.category]}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-1 items-center justify-between">
                      <div className="flex flex-col font-['Manrope:Bold',_sans-serif] justify-start items-start leading-[0] not-italic text-[#2a2a2f] text-[14px] text-left">
                        <p className="leading-[1.4] text-left font-semibold">{category.category_label}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div
                            className="bg-[#9747FF] h-1 rounded-full transition-all"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <p className="text-[12px] text-[#626266] font-normal leading-[1.3] mt-1 text-left">{category.percentage.toFixed(1)}% of total spending</p>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <p className="font-bold text-[#2a2a2f] text-[14px]">{formatCurrency(category.total_spent, "INR")}</p>
                        <p className="text-[12px] text-[#626266]">{category.transaction_count} transactions</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-[#626266]">No breakdown data available</div>
      )}
    </div>
  );
}

