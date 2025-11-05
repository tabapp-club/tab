"use client";

import { useState } from "react";
import { Sidepane } from "@/components/Sidepane";
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

interface WalletSidepaneProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSidepane({ isOpen, onClose }: WalletSidepaneProps) {
  const [activeTab, setActiveTab] = useState<"breakdown" | "addfunds">("addfunds");
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
    <Sidepane isOpen={isOpen} onClose={onClose} title="Wallet">
      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("addfunds")}
            className={`pb-3 px-4 font-medium text-sm transition-colors ${
              activeTab === "addfunds"
                ? "text-[#9747FF] border-b-2 border-[#9747FF]"
                : "text-[#626266] hover:text-[#2a2a2f]"
            }`}
          >
            Add Funds
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`pb-3 px-4 font-medium text-sm transition-colors ${
              activeTab === "breakdown"
                ? "text-[#9747FF] border-b-2 border-[#9747FF]"
                : "text-[#626266] hover:text-[#2a2a2f]"
            }`}
          >
            Spending Breakdown
          </button>
        </div>

        {activeTab === "addfunds" ? (
          /* Add Funds Tab */
          <div className="space-y-2">
            {/* Current Balance */}
            <div className="p-6 -mt-8">
              <div className="text-center">
                <p className="text-sm text-[#626266] mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-[#2a2a2f]">{formatCurrency(balance, currency)}</p>
              </div>
            </div>

            {/* Minimum Balance Suggestion */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 -mt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Maintain Minimum Balance</p>
                  <p className="text-xs text-blue-700">
                    We recommend keeping a minimum balance of ₹1,000 to ensure smooth and uninterrupted communication with your customers.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#2a2a2f] mb-4">Scan QR Code to Pay</p>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=merchant@upi&pn=Merchant%20Name&am=&cu=INR&tn=Wallet%20Recharge`)}`}
                      alt="Payment QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#626266]">Scan with any UPI app to recharge your wallet</p>
              </div>
            </div>

            {/* UPI ID Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <p className="text-sm font-semibold text-[#2a2a2f]">Or Send to UPI ID</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-1.5">
                    <code className="text-base font-bold text-[#2a2a2f]">
                      merchant@upi
                    </code>
                  </div>
                </div>
                <p className="text-xs text-[#626266]">
                  Send any amount to this UPI ID to recharge your wallet
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === "breakdown" ? (
          /* Spending Breakdown */
          <div className="space-y-6">
            {breakdownLoading ? (
              <div className="text-center py-8 text-[#626266]">Loading breakdown...</div>
            ) : breakdown ? (
              <>
                {/* Summary Card */}
                <div className="p-4 flex items-center justify-between gap-4">
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
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between gap-4">
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

                    {/* Transactions List */}
                    <div className="space-y-3">
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
                ) : (
                  /* Category Breakdown */
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#2a2a2f]">Category-wise Spending</h3>
                    {breakdown.categories.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className="w-full bg-white rounded-xl border border-gray-100 p-4 text-left hover:border-[#9747FF] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{CATEGORY_ICONS[category.category]}</span>
                            <span className="font-semibold text-[#2a2a2f]">{category.category_label}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#2a2a2f]">{formatCurrency(category.total_spent, "INR")}</p>
                            <p className="text-xs text-[#626266]">{category.transaction_count} transactions</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-[#9747FF] h-1 rounded-full transition-all"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#626266] mt-2">{category.percentage.toFixed(1)}% of total spending</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-[#626266]">No breakdown data available</div>
            )}
          </div>
        ) : null}
      </div>
    </Sidepane>
  );
}

