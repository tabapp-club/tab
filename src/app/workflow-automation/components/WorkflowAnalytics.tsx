"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Users
} from "lucide-react";
import { useWorkflowAnalytics } from "@/hooks/useWorkflowAnalytics";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import WorkflowStats from "./WorkflowStats";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  bgColor?: string;
  children?: React.ReactNode;
}

function AnalyticsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  bgColor = "bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]",
  children 
}: AnalyticsCardProps) {
  return (
    <div className={`${bgColor} rounded-lg border border-[#e2e8f0] p-6 transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-white rounded-lg">
              <Icon size={20} className="text-[#9747FF]" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-[#475569]">{title}</h3>
            {subtitle && <p className="text-xs text-[#64748b]">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#1e293b] mb-1">{value}</div>
          {trend && trendValue && (
            <div className={`flex items-center justify-end gap-1 text-xs font-medium ${
              trend === "up" ? "text-[#059669]" : trend === "down" ? "text-[#dc2626]" : "text-[#6b7280]"
            }`}>
              <TrendingUp 
                size={12} 
                className={trend === "down" ? "rotate-180" : ""} 
              />
              {trendValue}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export function WorkflowAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const { data: analyticsData, loading, error } = useWorkflowAnalytics(selectedTimeRange);
  const { data: workflowData } = useWorkflowData();

  const timeRanges = [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" }
  ];

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1e293b]">Workflow Analytics</h2>
            <p className="text-sm text-[#64748b]">Comprehensive insights into your automation performance</p>
          </div>
        </div>
        {/* Overview Summary Cards Loading */}
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
          <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-[#9747FF]" />
            Overview Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-4 bg-[#e2e8f0] rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-[#e2e8f0] rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-[#e2e8f0] rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-lg border border-[#e2e8f0] p-6 animate-pulse">
              <div className="h-4 bg-[#e2e8f0] rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-[#e2e8f0] rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-[#e2e8f0] rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1e293b]">Workflow Analytics</h2>
            <p className="text-sm text-[#64748b]">Comprehensive insights into your automation performance</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Analytics</h3>
          <p className="text-red-600">{error || "Failed to load analytics data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header with Time Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#1e293b]">Workflow Analytics</h2>
          <p className="text-sm text-[#64748b]">Comprehensive insights into your automation performance</p>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedTimeRange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                selectedTimeRange === range.value
                  ? "bg-[#9747FF] text-white"
                  : "bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Summary Cards */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-[#9747FF]" />
          Overview Summary
        </h3>
        <WorkflowStats 
          metrics={{
            active_workflows: { 
              count: workflowData?.activeWorkflows || 12, 
              change: 3 
            },
            messages_sent: { 
              count: workflowData?.messagesSent || 24500, 
              change: 12 
            },
            open_rate: { 
              count: workflowData?.openRate || 68.2, 
              change: 5.1 
            },
            response_rate: { 
              count: workflowData?.responseRate || 23.4, 
              change: 2.3 
            }
          }}
          onCardClick={setSelectedCard}
          selectedCard={selectedCard}
        />
      </div>

      {/* Communication Analytics */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-[#9747FF]" />
          Communication Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsCard
            title="WhatsApp Messages"
            value={analyticsData.whatsapp.messages.toLocaleString()}
            subtitle="Total messages sent"
            trend="up"
            trendValue="+12.5%"
          >
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#e2e8f0]">
              <div className="text-center">
                <div className="text-lg font-semibold text-[#059669]">{analyticsData.whatsapp.deliveryRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-[#2563eb]">{analyticsData.whatsapp.readRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Read Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-[#9747FF]">{analyticsData.whatsapp.responseRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Response</div>
              </div>
            </div>
          </AnalyticsCard>

          <AnalyticsCard
            title="SMS Messages"
            value={analyticsData.sms.messages.toLocaleString()}
            subtitle="Total messages sent"
            trend="up"
            trendValue="+8.3%"
          >
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#e2e8f0]">
              <div className="text-center">
                <div className="text-lg font-semibold text-[#059669]">{analyticsData.sms.deliveryRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-[#2563eb]">{analyticsData.sms.readRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Read Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-[#9747FF]">{analyticsData.sms.responseRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Response</div>
              </div>
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-[#9747FF]" />
          Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Peak Engagement Hours"
            value="9:00 AM"
            subtitle="Highest engagement time"
          >
            <div className="space-y-3 mt-4 pt-4 border-t border-[#e2e8f0]">
              {analyticsData.peakHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-[#64748b]">{hour.hour}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[#e2e8f0] rounded-full h-2">
                      <div 
                        className="bg-[#9747FF] h-2 rounded-full" 
                        style={{ width: `${Math.min(hour.engagement, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#1e293b] w-8">{Math.round(hour.engagement)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>

          <AnalyticsCard
            title="Best Performing Days"
            value="Tuesday"
            subtitle="Highest performance day"
          >
            <div className="space-y-3 mt-4 pt-4 border-t border-[#e2e8f0]">
              {analyticsData.bestDays.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-[#64748b]">{day.day}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[#e2e8f0] rounded-full h-2">
                      <div 
                        className="bg-[#059669] h-2 rounded-full" 
                        style={{ width: `${Math.min(day.performance, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#1e293b] w-8">{Math.round(day.performance)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Behavior Insights */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Users size={20} className="text-[#9747FF]" />
          Behavior Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Customer Engagement"
            value="87%"
            subtitle="Average engagement rate"
            trend="up"
            trendValue="+3.1%"
          >
            <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
              <div className="text-sm text-[#64748b] mb-2">Engagement by segment:</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>New customers</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Returning customers</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>VIP customers</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </div>
          </AnalyticsCard>

          <AnalyticsCard
            title="Response Patterns"
            value="2.3 hrs"
            subtitle="Average response time"
            trend="down"
            trendValue="-15%"
          >
            <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
              <div className="text-sm text-[#64748b] mb-2">Response time by channel:</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>WhatsApp</span>
                  <span className="font-medium">1.8 hrs</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>SMS</span>
                  <span className="font-medium">3.2 hrs</span>
                </div>
              </div>
            </div>
          </AnalyticsCard>
        </div>
      </div>

    </div>
  );
}