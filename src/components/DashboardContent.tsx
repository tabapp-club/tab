 "use client";

import { AIAnalysisSidepane } from "./AIAnalysisSidepane";
import { useSidebar } from "./SidebarContext";
import { useState, useCallback } from "react";
import { DashboardHeader, BusinessGrowthSection, AnalyticsSection, DashboardFooter } from "./dashboard";
import { RecommendedCampaigns, RecommendedCampaign } from "./campaigns/RecommendedCampaigns";
import { CampaignDetailsSidepane } from "./campaigns/CampaignDetailsSidepane";

export function DashboardContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [sidePaneOpen, setSidePaneOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [campaignSidePaneOpen, setCampaignSidePaneOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RecommendedCampaign | null>(null);

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

  // Handle campaign send now
  const handleSendNow = useCallback((campaign: RecommendedCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignSidePaneOpen(true);
  }, []);

  // Handle campaign sidepane close
  const handleCampaignSidePaneClose = useCallback(() => {
    setCampaignSidePaneOpen(false);
    setSelectedCampaign(null);
  }, []);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      <DashboardHeader />

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8">
        <div className="mt-6 lg:mt-[-40px]" style={{ marginBottom: '56px' }}>
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

      {/* Campaign Details Sidepane */}
      <CampaignDetailsSidepane
        isOpen={campaignSidePaneOpen}
        onClose={handleCampaignSidePaneClose}
        campaign={selectedCampaign}
      />
    </main>
  );
}
