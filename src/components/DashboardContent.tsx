 "use client";

import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader, BusinessGrowthSection, AnalyticsSection, DashboardFooter } from "./dashboard";
import { DashboardNotifications } from "./dashboard/DashboardNotifications";
import { RecommendedCampaigns, RecommendedCampaign } from "./campaigns/RecommendedCampaigns";

export function DashboardContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
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

  // Handle campaign send now - navigate to dedicated page
  const handleSendNow = (campaign: RecommendedCampaign) => {
    router.push(`/send-campaign?id=${campaign.id}`);
  };

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      <DashboardHeader />

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8">
        <div className="mt-6 lg:mt-[-40px]" style={{ marginBottom: '56px' }}>
          <DashboardNotifications />
          <RecommendedCampaigns onSendNow={handleSendNow} />
        </div>
        <AnalyticsSection onAskReason={handleAskReason} />
        <BusinessGrowthSection />
        <DashboardFooter />
      </div>

      {/* AI Analysis Sidepane */}
      <AIAnalysisSidepane
        isOpen={sidePaneOpen}
        onClose={handleSidePaneClose}
        cardType={selectedCardType}
        cardData={selectedCardData}
      />
    </main>
  );
}
