import React from 'react';

const DataCenterStats = () => {
  const stats = [
    {
      value: '12,200',
      label: 'Total users',
      labelColor: 'text-[#7856ff]',
      insights: '+2.5%'
    },
    {
      value: '6000',
      label: 'New users',
      labelColor: 'text-[#a1a1a1]',
      insights: '+2.5%'
    },
    {
      value: '3690',
      label: 'Retained users',
      labelColor: 'text-[#a1a1a1]',
      insights: '+2.5%'
    },
    {
      value: '3690',
      label: 'Active users',
      labelColor: 'text-[#a1a1a1]',
      insights: '+2.5%'
    },
    {
      value: '2733',
      label: 'In Active users',
      labelColor: 'text-[#a1a1a1]',
      insights: '+2.5%'
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
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
export default DataCenterStats;
