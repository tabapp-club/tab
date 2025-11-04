'use client';

import { useMemo } from 'react';
import { FunnelData } from './CustomerFunnelClient';
import { PieChart, Pie, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface FunnelChartsProps {
  data: FunnelData[];
  type: string;
}

export function FunnelCharts({ data, type }: FunnelChartsProps) {

  // Calculate customer metrics (same as funnel flow)
  const customerMetrics = (() => {
    if (!data || data.length === 0) {
      return {
        allCustomers: 0,
        newCustomers: 0,
        retainedCustomers: 0,
      };
    }

    // All customers = sum of all stages
    const allCustomers = data.reduce((sum, stage) => sum + (stage.count || 0), 0);
    
    // New customers - calculate as 15% of total (mock)
    const newCustomers = Math.round(allCustomers * 0.15);
    
    // Retained customers - active/engaged customers
    let retainedCustomers = 0;
    if (type === 'retention') {
      const highlyRetained = data.find(s => s.stage.toLowerCase().includes('highly retained'))?.count || 0;
      const retained = data.find(s => s.stage.toLowerCase() === 'retained' || (s.stage.toLowerCase().includes('retained') && !s.stage.toLowerCase().includes('highly')))?.count || 0;
      retainedCustomers = highlyRetained + retained;
    } else if (type === 'status') {
      retainedCustomers = data.find(s => s.stage.toLowerCase().includes('active'))?.count || 0;
    } else {
      // For other types, calculate as active/engaged customers (top 2 stages)
      const sortedData = [...data].sort((a, b) => (b.count || 0) - (a.count || 0));
      retainedCustomers = (sortedData[0]?.count || 0) + (sortedData[1]?.count || 0);
    }

    return {
      allCustomers,
      newCustomers,
      retainedCustomers,
    };
  })();

  // Prepare data for charts - include customer metrics only for status type
  const { allCustomers, newCustomers, retainedCustomers } = customerMetrics;
  const maxVal = Math.max(
    ...(type === 'status' ? [allCustomers] : []),
    ...data.map((stage) => stage.count || 0),
    1
  );

  // Add customer metric bars at the beginning only for status type
  const customerBars = type === 'status' ? [
    {
      name: 'All Customers',
      value: allCustomers,
      percentage: 100,
      color: '#9747FF',
      change: 0,
    },
    {
      name: 'New Customers',
      value: newCustomers,
      percentage: allCustomers > 0 ? (newCustomers / allCustomers) * 100 : 0,
      color: '#A877FF',
      change: 12.5,
    },
    {
      name: 'Retained Customers',
      value: retainedCustomers,
      percentage: allCustomers > 0 ? (retainedCustomers / allCustomers) * 100 : 0,
      color: '#B891FF',
      change: 8.3,
    },
  ] : [];

  // Map funnel stages
  const funnelStages = data.map((item) => ({
    name: item.stage,
    value: item.count,
    percentage: item.percentage,
    color: item.color,
    change: item.change,
  }));

  // Combine customer bars with funnel stages (only include customer bars for status type)
  const chartData = [...customerBars, ...funnelStages];

  // Create chart config for pie chart
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      visitors: {
        label: 'Visitors',
      },
    };
    
    chartData.forEach((item) => {
      // Create a safe key from the name
      const key = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      config[key] = {
        label: item.name,
        color: item.color,
      };
    });
    
    return config;
  }, [chartData]);

  // Format data for pie chart with fill property using actual colors
  const pieChartData = useMemo(() => {
    return chartData.map((item) => {
      const key = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return {
        name: item.name,
        value: item.value,
        fill: item.color, // Use actual color instead of CSS variable
        percentage: item.percentage,
        color: item.color,
        change: item.change,
        browser: key, // Add browser key for nameKey
      };
    });
  }, [chartData]);

  // Show empty state if no data
  if (!pieChartData || pieChartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2a2a2f] font-manrope">Distribution Analysis</h3>
          <p className="text-sm text-[#626266] font-manrope mt-1">Interactive visualizations of customer segments</p>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-[#626266]">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2a2a2f] font-manrope">Distribution Analysis</h3>
        <p className="text-sm text-[#626266] font-manrope mt-1">Interactive visualizations of customer segments</p>
      </div>

      {/* Charts */}
      <div className="w-full overflow-visible" style={{ padding: '80px 0', minHeight: '500px' }}>
        <div className="w-full overflow-visible" style={{ padding: '0 80px' }}>
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-[#2a2a2f] mx-auto overflow-visible"
            style={{ width: '100%', height: '400px' }}
          >
            <PieChart margin={{ top: 80, right: 200, bottom: 80, left: 200 }}>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                labelLine={false}
                nameKey="browser"
                dataKey="value"
                outerRadius={110}
                innerRadius={0}
                animationBegin={0}
                animationDuration={800}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

