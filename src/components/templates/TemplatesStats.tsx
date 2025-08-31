import React from 'react';

const TemplatesStats = () => {
  const stats = [
    {
      value: '24',
      label: 'Total Templates',
      labelColor: 'text-[#7856ff]',
      insights: '+3',
      icon: <TemplatesIcon />,
      bgColor: 'bg-purple-100'
    },
    {
      value: '156',
      label: 'Times Used',
      labelColor: 'text-[#a1a1a1]',
      insights: '+12',
      icon: <UsageIcon />,
      bgColor: 'bg-blue-100'
    },
    {
      value: '8',
      label: 'Active Templates',
      labelColor: 'text-[#a1a1a1]',
      insights: '+2',
      icon: <ActiveIcon />,
      bgColor: 'bg-green-100'
    },
    {
      value: '4',
      label: 'Categories',
      labelColor: 'text-[#a1a1a1]',
      insights: '+1',
      icon: <CategoriesIcon />,
      bgColor: 'bg-orange-100'
    },
    {
      value: '95%',
      label: 'Satisfaction Rate',
      labelColor: 'text-[#a1a1a1]',
      insights: '+5%',
      icon: <SatisfactionIcon />,
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
const TemplatesIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UsageIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ActiveIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CategoriesIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const SatisfactionIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export { TemplatesStats };
