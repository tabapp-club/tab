"use client";

import { TrendingUp, AlertTriangle, Info } from "lucide-react";

interface Insight {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
}

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
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

  const colorScheme = colors[insight.type];
  const IconComponent = insight.type === "success" ? TrendingUp : insight.type === "warning" ? AlertTriangle : Info;

  return (
    <div className={`${colorScheme.bg} rounded-lg border ${colorScheme.border} p-4`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg">
          <IconComponent size={16} className={colorScheme.icon} />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${colorScheme.title} mb-1`}>{insight.title}</h4>
          <p className="text-xs text-[#64748b] leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}