import React from 'react';

interface WorkflowMetrics {
  active_workflows?: { count: number; change: number };
  messages_sent?: { count: number; change: number };
  open_rate?: { count: number; change: number };
  response_rate?: { count: number; change: number };
}

interface WorkflowStatsProps {
  metrics?: WorkflowMetrics;
  onCardClick?: (cardType: string) => void;
  selectedCard?: string;
}

const statConfig = [
  {
    key: 'active_workflows',
    label: 'Active Workflows',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'active'
  },
  {
    key: 'messages_sent',
    label: 'Messages Sent',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'messages'
  },
  {
    key: 'open_rate',
    label: 'Open Rate',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'opens'
  },
  {
    key: 'response_rate',
    label: 'Response Rate',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'responses'
  },
];

const WorkflowStats = ({ metrics, onCardClick, selectedCard }: WorkflowStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full min-w-0">
      {statConfig.map((stat) => {
        const metric = metrics?.[stat.key as keyof WorkflowMetrics];
        const value = metric?.count?.toLocaleString() ?? '-';
        const change = metric?.change;
        const isPositive = typeof change === 'number' ? change >= 0 : true;
        const insights = change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : '-';
        const isSelected = selectedCard === stat.filterType;

        return (
        <div
          key={stat.label}
          className={`bg-white p-4 rounded-lg border min-w-0 cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'border-[#9747FF] bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onCardClick?.(stat.filterType)}
        >
          <div className="w-full">
            <h3 className={`text-sm font-medium ${isSelected ? 'text-[#9747FF]' : stat.labelColor}`}>
              {stat.label}
            </h3>
            <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{insights}</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default WorkflowStats;
