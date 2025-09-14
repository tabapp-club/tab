"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Smartphone, 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Users,
  Target,
  Activity
} from "lucide-react";
import { useWorkflowAnalytics } from "@/hooks/useWorkflowAnalytics";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import WorkflowStats from "./WorkflowStats";
import { WhatsAppSMSComparisonChart } from "./WhatsAppSMSComparisonChart";

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
              <Icon size={20} className="text-[#6E4EFF]" />
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

interface InsightCardProps {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

function InsightCard({ type, title, description, icon: Icon }: InsightCardProps) {
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

  const colorScheme = colors[type];

  return (
    <div className={`${colorScheme.bg} rounded-lg border ${colorScheme.border} p-4`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg">
          <Icon size={16} className={colorScheme.icon} />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${colorScheme.title} mb-1`}>{title}</h4>
          <p className="text-xs text-[#64748b] leading-relaxed">{description}</p>
        </div>
      </div>
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
            <BarChart3 size={20} className="text-[#6E4EFF]" />
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
                  ? "bg-[#6E4EFF] text-white"
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
          <BarChart3 size={20} className="text-[#6E4EFF]" />
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
          <MessageSquare size={20} className="text-[#6E4EFF]" />
          Communication Analytics
        </h3>
        
        {/* WhatsApp vs SMS Comparison Chart */}
        <div className="mb-6">
          <WhatsAppSMSComparisonChart />
        </div>
        
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
                <div className="text-lg font-semibold text-[#6E4EFF]">{analyticsData.whatsapp.responseRate.toFixed(1)}%</div>
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
                <div className="text-lg font-semibold text-[#6E4EFF]">{analyticsData.sms.responseRate.toFixed(1)}%</div>
                <div className="text-xs text-[#64748b]">Response</div>
              </div>
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Brain size={20} className="text-[#6E4EFF]" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.insights.map((insight, index) => (
            <InsightCard
              key={index}
              type={insight.type}
              title={insight.title}
              description={insight.description}
              icon={insight.type === "success" ? TrendingUp : insight.type === "warning" ? AlertTriangle : Info}
            />
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-[#6E4EFF]" />
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
                        className="bg-[#6E4EFF] h-2 rounded-full" 
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

      {/* Message Type Performance */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-4">
          <Target size={20} className="text-[#6E4EFF]" />
          Message Type Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analyticsData.messageTypes.map((type, index) => (
            <div key={index} className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-lg border border-[#e2e8f0] p-4 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#475569]">{type.type}</h4>
                <div className="flex items-center gap-1 text-xs font-medium text-[#059669]">
                  <TrendingUp size={10} />
                  +5.2%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#1e293b]">{type.count.toLocaleString()}</div>
                  <p className="text-xs text-[#64748b]">messages</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#6E4EFF]">{Math.round(type.percentage)}%</div>
                  <p className="text-xs text-[#64748b]">of total</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior Insights */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Users size={20} className="text-[#6E4EFF]" />
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

      {/* Top Performing Workflows */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Zap size={20} className="text-[#6E4EFF]" />
          Top Performing Workflows
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.workflows.map((workflow, index) => (
            <div key={index} className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-lg border border-[#e2e8f0] p-4 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#475569]">{workflow.name}</h4>
                <div className="flex items-center gap-1 text-xs font-medium text-[#059669]">
                  <TrendingUp size={10} />
                  +8.7%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#1e293b]">{workflow.conversions.toLocaleString()}</div>
                  <p className="text-xs text-[#64748b]">conversions</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#6E4EFF]">{Math.round(workflow.performance)}%</div>
                  <p className="text-xs text-[#64748b]">success rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Brain size={20} className="text-[#6E4EFF]" />
          Smart Recommendations
        </h3>
        <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-lg border border-[#e2e8f0] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#1e293b] mb-3">Optimization Opportunities</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-[#059669] mt-0.5 flex-shrink-0" />
                  Schedule more campaigns during 9:00 AM - 10:00 AM for 23% better engagement
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-[#059669] mt-0.5 flex-shrink-0" />
                  Expand template message usage to improve response rates by 15%
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-[#059669] mt-0.5 flex-shrink-0" />
                  Focus on Tuesday and Thursday campaigns for optimal performance
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] mb-3">Next Steps</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li className="flex items-start gap-2">
                  <Target size={16} className="text-[#6E4EFF] mt-0.5 flex-shrink-0" />
                  A/B test SMS message formats to improve response rates
                </li>
                <li className="flex items-start gap-2">
                  <Target size={16} className="text-[#6E4EFF] mt-0.5 flex-shrink-0" />
                  Create more personalized templates for VIP customers
                </li>
                <li className="flex items-start gap-2">
                  <Target size={16} className="text-[#6E4EFF] mt-0.5 flex-shrink-0" />
                  Implement automated follow-up sequences for better engagement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}