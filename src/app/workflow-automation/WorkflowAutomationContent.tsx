"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/components/SidebarContext";
import { MobileHeaderButton } from "@/components/MobileHeaderButton";
import { WorkflowOverview } from "./components/WorkflowOverview";
import { WorkflowBuilder } from "./components/WorkflowBuilder";
import { TemplateManager } from "./components/TemplateManager";
import { AutomationRules } from "./components/AutomationRules";
import { IntegrationSettings } from "./components/IntegrationSettings";
import { WorkflowAnalytics } from "./components/WorkflowAnalytics";
import { useSearchParams } from "next/navigation";
import { BarChart3, MessageSquare, FileText, Zap, Link, TrendingUp } from "lucide-react";

type TabType = "overview" | "builder" | "templates" | "rules" | "integrations" | "analytics";

export function WorkflowAutomationContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Handle URL parameters for tab selection
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['overview', 'builder', 'templates', 'rules', 'integrations', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "rules", label: "Automation Templates", icon: Zap },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "integrations", label: "Integrations", icon: Link },
    { id: "builder", label: "Custom Request", icon: MessageSquare },
  ] as const;

  const handleTabChange = (tabId: TabType) => {
    // Store current scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    setActiveTab(tabId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.pathname + url.search);
    
    // Restore scroll position after URL update
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <WorkflowOverview />;
      case "analytics":
        return <WorkflowAnalytics />;
      case "builder":
        return <WorkflowBuilder />;
      case "templates":
        return <TemplateManager />;
      case "rules":
        return <AutomationRules />;
      case "integrations":
        return <IntegrationSettings />;
      default:
        return <WorkflowOverview />;
    }
  };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      <div className="w-full max-w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 overflow-x-hidden">
        {/* Header */}
        <header className="mb-8 pt-12 lg:pt-0">
          <div className="mb-2">
            <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
              Workflow Automation
            </h1>
            <p className="text-[14px] text-[#6b7280] font-normal">
              Automate WhatsApp and SMS communications
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 border-b border-[#e5e7eb] min-w-max pb-0">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? "border-[#6E4EFF] text-[#6E4EFF] bg-[#6E4EFF]/5"
                        : "border-transparent text-[#6b7280] hover:text-[#2a2a2f] hover:border-[#d1d5db]"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop: Regular tabs */}
          <div className="hidden lg:block">
            <div className="flex flex-wrap gap-1 border-b border-[#e5e7eb]">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-[#6E4EFF] text-[#6E4EFF] bg-[#6E4EFF]/5"
                        : "border-transparent text-[#6b7280] hover:text-[#2a2a2f] hover:border-[#d1d5db]"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
