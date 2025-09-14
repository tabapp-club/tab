"use client";

import { useState } from "react";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { useRouter } from "next/navigation";
import { CustomDropdown } from "./CustomDropdown";
import WorkflowStats from "./WorkflowStats";
import { 
  Wrench, 
  FileText, 
  Link, 
  TrendingUp, 
  PlusCircle, 
  Layout, 
  Settings, 
  BarChart3 
} from "lucide-react";

export function WorkflowOverview() {
  const { data: workflowData, isLoading } = useWorkflowData();
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const router = useRouter();

  // Transform workflow data to match WorkflowStats interface
  const workflowMetrics = {
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
  };

  const recentWorkflows = [
    {
      id: 1,
      name: "Welcome Series",
      type: "WhatsApp",
      status: "active",
      messages: 1.2,
      openRate: 72.5,
      lastRun: "2 hours ago"
    },
    {
      id: 2,
      name: "Cart Abandonment",
      type: "WhatsApp",
      status: "active",
      messages: 856,
      openRate: 89.2,
      lastRun: "1 hour ago"
    },
    {
      id: 3,
      name: "Order Confirmation",
      type: "SMS",
      status: "active",
      messages: 2.1,
      openRate: 95.8,
      lastRun: "30 minutes ago"
    },
    {
      id: 4,
      name: "Birthday Wishes",
      type: "WhatsApp",
      status: "paused",
      messages: 45,
      openRate: 78.3,
      lastRun: "1 day ago"
    }
  ];

  const quickActions = [
    {
      title: "Create New Workflow",
      description: "Build a custom automation workflow",
      icon: PlusCircle,
      action: "builder",
      gradient: "bg-gradient-to-br from-[#F3F0FF] via-[#E9E5FF] to-[#DDD6FE]",
      hoverGradient: "hover:from-[#EDE9FE] hover:via-[#E0D7FE] hover:to-[#D1C7FE]",
      iconBg: "bg-[#8B5CF6]/10",
      iconColor: "text-[#7C3AED]",
      textColor: "text-[#5B21B6]"
    },
    {
      title: "Browse Templates",
      description: "Choose from pre-built templates",
      icon: Layout,
      action: "templates",
      gradient: "bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]",
      hoverGradient: "hover:from-[#ECFDF5] hover:via-[#D1FAE5] hover:to-[#A7F3D0]",
      iconBg: "bg-[#10B981]/10",
      iconColor: "text-[#059669]",
      textColor: "text-[#047857]"
    },
    {
      title: "Setup Integrations",
      description: "Connect WhatsApp and SMS",
      icon: Settings,
      action: "integrations",
      gradient: "bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]",
      hoverGradient: "hover:from-[#E0F2FE] hover:via-[#BAE6FD] hover:to-[#7DD3FC]",
      iconBg: "bg-[#0EA5E9]/10",
      iconColor: "text-[#0284C7]",
      textColor: "text-[#0369A1]"
    },
    {
      title: "View Analytics",
      description: "Analyze workflow performance",
      icon: BarChart3,
      action: "analytics",
      gradient: "bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]",
      hoverGradient: "hover:from-[#ECFDF5] hover:via-[#A7F3D0] hover:to-[#6EE7B7]",
      iconBg: "bg-[#14B8A6]/10",
      iconColor: "text-[#0D9488]",
      textColor: "text-[#0F766E]"
    }
  ];

  const handleQuickAction = (action: string) => {
    // Navigate to the specific tab
    const url = new URL(window.location.href);
    url.searchParams.set('tab', action);
    router.push(url.pathname + url.search);
  };

  const handleWorkflowClick = (workflowId: string) => {
    // Navigate to workflow builder with specific workflow
    const url = new URL(window.location.href);
    url.searchParams.set('tab', 'builder');
    url.searchParams.set('workflow', workflowId);
    router.push(url.pathname + url.search);
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <WorkflowStats 
        metrics={workflowMetrics}
        onCardClick={setSelectedCard}
        selectedCard={selectedCard}
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h2 className="text-lg font-semibold text-[#2a2a2f] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className={`${action.gradient} ${action.hoverGradient} p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg group border border-white/50`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${action.iconBg} p-2 rounded-md group-hover:scale-110 transition-all duration-300`}>
                      <IconComponent size={20} className={action.iconColor} />
                    </div>
                    <h3 className={`font-semibold text-base ${action.textColor}`}>{action.title}</h3>
                  </div>
                  <p className={`text-xs leading-relaxed flex-grow ${action.textColor} opacity-80 mb-3`}>{action.description}</p>
                  <div className={`relative flex items-center text-xs ${action.textColor} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span>Get started</span>
                    <div className={`absolute left-full ml-2 w-0 group-hover:w-3 h-0.5 ${action.iconColor} transition-all duration-300 top-1/2 -translate-y-1/2`}></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Workflows */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] flex-1 flex flex-col min-h-0 min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-[#2a2a2f]">Recent Workflows</h2>
            <p className="text-sm text-[#6b7280]">Monitor and manage your automation workflows</p>
          </div>
          <CustomDropdown
            options={[
              { value: "24h", label: "Last 24 hours" },
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" }
            ]}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            className="w-36"
          />
        </div>
        
        <div className="flex-1 min-h-0 min-w-0">
          <div className="overflow-x-auto h-full">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="bg-[#f6f6f6] border-b border-[#e9e9e9] flex min-w-max">
                <div className="flex-1 min-w-0 flex items-center gap-1 px-4 h-10 border-r border-[#e9e9e9]">
                  <span className="text-sm font-normal text-[#626266]">Workflow</span>
                </div>
                <div className="w-28 flex-shrink-0 flex items-center justify-center gap-1 px-3 h-10 border-r border-[#e9e9e9]">
                  <span className="text-sm font-normal text-[#626266]">Type</span>
                </div>
                <div className="w-28 flex-shrink-0 flex items-center justify-center gap-1 px-3 h-10 border-r border-[#e9e9e9]">
                  <span className="text-sm font-normal text-[#626266]">Status</span>
                </div>
                <div className="w-36 flex-shrink-0 flex items-center justify-center gap-1 px-3 h-10 border-r border-[#e9e9e9]">
                  <span className="text-sm font-normal text-[#626266]">Messages</span>
                </div>
                <div className="w-32 flex-shrink-0 flex items-center justify-center gap-1 px-3 h-10 border-r border-[#e9e9e9]">
                  <span className="text-sm font-normal text-[#626266]">Open Rate</span>
                </div>
                <div className="w-40 flex-shrink-0 flex items-center gap-1 px-3 h-10">
                  <span className="text-sm font-normal text-[#626266]">Last Run</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-white">
                {recentWorkflows.map((workflow, index) => (
                  <div 
                    key={workflow.id} 
                    className="flex min-w-max border-b border-[#f3f4f6] hover:bg-[#f9fafb] cursor-pointer transition-colors duration-150"
                    onClick={() => handleWorkflowClick(workflow.id.toString())}
                  >
                    <div className="flex-1 min-w-0 flex items-center px-4 py-3 border-r border-[#e9e9e9]">
                      <div className="font-medium text-[#2a2a2f] text-sm truncate">{workflow.name}</div>
                    </div>
                    <div className="w-28 flex-shrink-0 flex items-center justify-center px-3 py-3 border-r border-[#e9e9e9]">
                      <span className="text-xs font-medium text-[#6b7280]">
                        {workflow.type}
                      </span>
                    </div>
                    <div className="w-28 flex-shrink-0 flex items-center justify-center px-3 py-3 border-r border-[#e9e9e9]">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        workflow.status === "active" ? "bg-[#10b981] text-white" : "bg-[#f59e0b] text-white"
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="w-36 flex-shrink-0 flex items-center justify-center px-3 py-3 border-r border-[#e9e9e9]">
                      <span className="text-sm text-[#6b7280]">
                        {workflow.messages > 1000 ? `${(workflow.messages / 1000).toFixed(1)}K` : workflow.messages}
                      </span>
                    </div>
                    <div className="w-32 flex-shrink-0 flex items-center justify-center px-3 py-3 border-r border-[#e9e9e9]">
                      <span className="text-sm text-[#6b7280]">{workflow.openRate}%</span>
                    </div>
                    <div className="w-40 flex-shrink-0 flex items-center px-3 py-3">
                      <span className="text-sm text-[#6b7280]">{workflow.lastRun}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h2 className="text-lg font-semibold text-[#2a2a2f] mb-6">Platform Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 border border-[#e5e7eb] rounded-lg">
            <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
            <div>
              <h3 className="font-medium text-[#2a2a2f]">WhatsApp Business</h3>
              <p className="text-sm text-[#6b7280]">Connected & Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border border-[#e5e7eb] rounded-lg">
            <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
            <div>
              <h3 className="font-medium text-[#2a2a2f]">SMS Gateway</h3>
              <p className="text-sm text-[#6b7280]">Connected & Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
