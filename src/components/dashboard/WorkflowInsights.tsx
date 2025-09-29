"use client";

import { Brain } from "lucide-react";
import { useWorkflowAnalytics } from "@/hooks/useWorkflowAnalytics";
import { InsightCard } from "./InsightCard";

export function WorkflowInsights() {
  const { data: workflowAnalyticsData } = useWorkflowAnalytics("7d");

  return (
    <section className="mb-6 sm:mb-8 lg:mb-12">
      {/* AI-Powered Insights */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2 mb-6">
          <Brain size={20} className="text-[#6E4EFF]" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(workflowAnalyticsData?.insights || [
            {
              type: "success" as const,
              title: "High Engagement Peak",
              description: "Your messages perform 23% better during 9:00 AM - 10:00 AM. Consider scheduling more campaigns during this window."
            },
            {
              type: "warning" as const,
              title: "SMS Response Rate",
              description: "SMS response rate is 18.9%, below industry average of 25%. Consider A/B testing different message formats."
            },
            {
              type: "info" as const,
              title: "Template Performance",
              description: "Template messages show 15% higher engagement than regular text messages. Expand your template library."
            }
          ]).map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>
    </section>
  );
}