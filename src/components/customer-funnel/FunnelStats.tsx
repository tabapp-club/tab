'use client';

import { Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export interface FunnelMetrics {
  totalCustomers: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeInStage: number;
}

interface FunnelStatsProps {
  metrics: FunnelMetrics;
}

export function FunnelStats({ metrics }: FunnelStatsProps) {
  const stats = [
    {
      label: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString(),
      icon: Users,
      color: '#9747FF',
      bgColor: 'bg-[#9747FF]/10',
    },
    {
      label: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: '#9747FF',
      bgColor: 'bg-[#9747FF]/10',
    },
    {
      label: 'Drop-off Rate',
      value: `${metrics.dropOffRate.toFixed(1)}%`,
      icon: TrendingDown,
      color: '#A877FF',
      bgColor: 'bg-[#A877FF]/10',
    },
    {
      label: 'Avg. Time in Stage',
      value: `${metrics.avgTimeInStage} days`,
      icon: Clock,
      color: '#B891FF',
      bgColor: 'bg-[#B891FF]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#e9e9e9] p-3 sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#626266] font-manrope mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-[#2a2a2f] font-manrope leading-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
