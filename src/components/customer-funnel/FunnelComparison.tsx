'use client';

import { useState } from 'react';
import { FunnelData } from './CustomerFunnelClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';

interface FunnelComparisonProps {
  data: FunnelData[];
}

export function FunnelComparison({ data }: FunnelComparisonProps) {
  const [comparisonType, setComparisonType] = useState<'current' | 'previous'>('current');

  // Mock previous period data
  const previousData = data.map((item) => ({
    stage: item.stage,
    current: item.count,
    previous: Math.floor(item.count * (1 - (item.change || 0) / 100)),
    color: item.color,
    change: item.change,
  }));

  const comparisonData = previousData.map((item) => ({
    name: item.stage,
    Current: item.current,
    Previous: item.previous,
    color: item.color,
    change: item.change,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-sm text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Current:</span> {data.Current?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Previous:</span> {data.Previous?.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-gray-900">
              <span className="font-medium">Difference:</span>{' '}
              {((data.Current - data.Previous) / data.Previous * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#9747FF]/20 to-[#9747FF]/10 rounded-lg flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-[#9747FF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2a2a2f] font-manrope">Period Comparison</h3>
            <p className="text-sm text-[#626266] font-manrope mt-1">Compare current vs previous period</p>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#626266' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#626266' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar
              dataKey="Previous"
              fill="#B891FF"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              name="Previous Period"
            />
            <Bar
              dataKey="Current"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              name="Current Period"
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Change Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonData.map((item) => {
          const change = ((item.Current - item.Previous) / item.Previous) * 100;
          return (
            <div
              key={item.name}
              className="p-4 rounded-lg border border-[#e9e9e9]"
            >
              <p className="text-sm font-medium text-[#626266] mb-2">{item.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#2a2a2f]">
                  {item.Current.toLocaleString()}
                </span>
                <span
                  className={`text-sm font-semibold flex items-center gap-1 ${
                    change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4 rotate-180" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-[#626266] mt-1">vs {item.Previous.toLocaleString()} previous</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

