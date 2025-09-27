 "use client";

import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useState } from "react";
import { DashboardHeader, CampaignSection, AnalyticsSection, WorkflowInsights, DashboardFooter } from "./dashboard";

export function DashboardContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [sidePaneOpen, setSidePaneOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedCardData, setSelectedCardData] = useState<any>(null);

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

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      <DashboardHeader />

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        <CampaignSection />
        <AnalyticsSection onAskReason={handleAskReason} />
        <WorkflowInsights />
        <DashboardFooter />
      </div>

      {/* AI Analysis Sidepane */}
      <AIAnalysisSidepane
        isOpen={sidePaneOpen}
        onClose={handleSidePaneClose}
        cardType={selectedCardType}
        cardData={selectedCardData}
        filterDays={undefined}
        dateRange={{ from: null, to: null }}
      />
    </main>
  );
}
