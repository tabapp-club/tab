import React from 'react';

const CampaignsStats = () => {
  const stats = [
    {
      value: '24',
      label: 'Active Campaigns',
      labelColor: 'text-[#7856ff]',
      insights: '+12%',
      icon: <ActiveCampaignsIcon />,
      bgColor: 'bg-purple-100'
    },
    {
      value: '156K',
      label: 'Total Reach',
      labelColor: 'text-[#a1a1a1]',
      insights: '+8.2%',
      icon: <ReachIcon />,
      bgColor: 'bg-blue-100'
    },
    {
      value: '24.5%',
      label: 'Avg. Open Rate',
      labelColor: 'text-[#a1a1a1]',
      insights: '+3.1%',
      icon: <OpenRateIcon />,
      bgColor: 'bg-green-100'
    },
    {
      value: '5.8%',
      label: 'Click Through Rate',
      labelColor: 'text-[#a1a1a1]',
      insights: '+1.5%',
      icon: <ClickRateIcon />,
      bgColor: 'bg-orange-100'
    },
    {
      value: '$42.5K',
      label: 'Total Budget',
      labelColor: 'text-[#a1a1a1]',
      insights: '+15.3%',
      icon: <BudgetIcon />,
      bgColor: 'bg-emerald-100'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full min-w-0">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-lg shadow-sm border border-gray-200 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className={`text-xs sm:text-sm font-medium ${stat.labelColor} truncate`}>{stat.label}</h3>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center min-w-0">
            <span className="text-green-600 text-xs sm:text-sm font-medium flex-shrink-0">{stat.insights}</span>
            <span className="text-gray-500 text-xs sm:text-sm ml-2 truncate">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Icon Components
const ActiveCampaignsIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ReachIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const OpenRateIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ClickRateIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const BudgetIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export { CampaignsStats };
