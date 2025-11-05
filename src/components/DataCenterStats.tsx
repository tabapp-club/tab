'use client';

import type { CSSProperties } from 'react';

interface Metrics {
  total_users?: { count: number; change: number };
  new_users?: { count: number; change: number };
  retained_users?: { count: number; change: number };
  active_users?: { count: number; change: number };
  inactive_users?: { count: number; change: number };
}

interface DataCenterStatsProps {
  metrics?: Metrics;
  onCardClick?: (cardType: string) => void;
  selectedCard?: string;
  isLoading?: boolean;
}

const statConfig = [
  {
    key: 'total_users',
    label: 'Total users',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'total',
    advantage: 'Reach your entire audience at once',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    key: 'new_users',
    label: 'New users',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'new',
    advantage: 'Welcome and onboard new customers',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  },
  {
    key: 'retained_users',
    label: 'Retained users',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'retained',
    advantage: 'Reward loyal customers and boost retention',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'active_users',
    label: 'Active users',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'active',
    advantage: 'Engage your most responsive audience',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    key: 'inactive_users',
    label: 'InActive users',
    labelColor: 'text-[#a1a1a1]',
    filterType: 'inactive',
    advantage: 'Re-engage dormant customers with offers',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
];

const DataCenterStats = ({ metrics, onCardClick, selectedCard, isLoading = false }: DataCenterStatsProps) => {
  // Show loading skeleton if data is loading
  if (isLoading && !metrics) {
    return (
      <div className="w-full min-w-0">
        <div className="flex gap-3 overflow-x-auto sm:hidden scrollbar-hide">
          {statConfig.map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg border min-w-[160px] flex-shrink-0 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full min-w-0">
          {statConfig.map((stat) => (
            <div key={stat.label} className="bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-lg border min-w-0 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-w-0">
      {/* Mobile: Horizontal scroll */}
      <div 
        className="flex gap-3 overflow-x-auto sm:hidden scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as CSSProperties}
      >
        {statConfig.map((stat) => {
          const metric = metrics?.[stat.key as keyof Metrics];
          const value = metric?.count?.toLocaleString() ?? '-';
          const change = metric?.change;
          const isPositive = typeof change === 'number' ? change >= 0 : true;
          const insights = change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : '-';
          const isSelected = selectedCard === stat.filterType;

          return (
          <div
            key={stat.label}
            className={`bg-white p-4 rounded-lg border min-w-[160px] flex-shrink-0 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-[#9747FF] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onCardClick?.(stat.filterType)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h3 className={`text-xs font-medium ${isSelected ? 'text-[#9747FF]' : stat.labelColor} truncate`}>
                  {stat.label}
                </h3>
                <p className="text-lg font-bold text-gray-900 mt-1 truncate">{value}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-[#9747FF]' : 'bg-blue-100'
              }`}>
                <div className={`${isSelected ? 'text-white' : 'text-blue-600'}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="flex items-center min-w-0 mb-2">
                <span className={`text-xs font-medium flex-shrink-0 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{insights}</span>
              <span className="text-gray-500 text-xs ml-2 truncate">from last month</span>
            </div>
          </div>
          );
        })}
      </div>
      
      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full min-w-0">
        {statConfig.map((stat) => {
          const metric = metrics?.[stat.key as keyof Metrics];
          const value = metric?.count?.toLocaleString() ?? '-';
          const change = metric?.change;
          const isPositive = typeof change === 'number' ? change >= 0 : true;
          const insights = change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : '-';
          const isSelected = selectedCard === stat.filterType;

          return (
          <div
            key={stat.label}
            className={`bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-lg border min-w-0 cursor-pointer transition-all duration-200 flex flex-col ${
              isSelected
                ? 'border-[#9747FF] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onCardClick?.(stat.filterType)}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#9747FF]' : stat.labelColor} truncate`}>
                  {stat.label}
                </h3>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-[#9747FF]' : 'bg-blue-100'
              }`}>
                <div className={`${isSelected ? 'text-white' : 'text-blue-600'}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center min-w-0">
                <span className={`text-xs sm:text-sm font-medium flex-shrink-0 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{insights}</span>
              <span className="text-gray-500 text-xs sm:text-sm ml-2 truncate">from last month</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
export default DataCenterStats;
