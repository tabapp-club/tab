'use client';

import { useMemo } from 'react';
import { FunnelData, FunnelType } from './CustomerFunnelClient';
import { Info } from 'lucide-react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip, Cell } from 'recharts';

interface FunnelVisualizationProps {
  data: FunnelData[];
  type: FunnelType;
}

// Format number helper (from AnalyticsCards)
const formatNumberToIndianShort = (num: number): string => {
  if (!isFinite(num)) return '-';
  const formatBase = (base: number) => {
    const fixed = base >= 10 ? base.toFixed(0) : base.toFixed(1);
    return fixed.replace(/\.0$/, '');
  };
  if (Math.abs(num) >= 1e7) return `${formatBase(num / 1e7)}CR`;
  if (Math.abs(num) >= 1e5) return `${formatBase(num / 1e5)}L`;
  if (Math.abs(num) >= 1e3) return `${formatBase(num / 1e3)}K`;
  return num.toLocaleString('en-IN');
};

export function FunnelVisualization({ data, type }: FunnelVisualizationProps) {
  // Calculate customer metrics
  const customerMetrics = useMemo(() => {
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
      const highly = data.find(s => s.stage.toLowerCase() === 'highly')?.count || 0;
      const moderately = data.find(s => s.stage.toLowerCase() === 'moderately')?.count || 0;
      retainedCustomers = highly + moderately;
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
  }, [data, type]);

  // Transform data for bar chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const { allCustomers } = customerMetrics;

    const baseStages = [{
      name: 'All Customers',
      count: allCustomers,
      percentage: 100,
      color: '#9747FF',
      change: 0,
      pct: 100,
    }];

    const maxVal = Math.max(
      ...(type === 'status' ? [allCustomers] : []),
      ...data.map((stage) => stage.count || 0),
      1
    );

    const funnelStages = data.map((stage) => ({
      name: stage.stage,
      count: stage.count || 0,
      percentage: stage.percentage || 0,
      color: stage.color,
      change: stage.change,
      pct: Math.round((stage.count / maxVal) * 10000) / 100,
    }));

    return [...baseStages, ...funnelStages];
  }, [data, customerMetrics, type]);

  // Generate gradient IDs for each stage
  const getGradientId = (stageName: string) => `grad-${stageName.replace(/\s+/g, '-')}`;

  // Create gradient definitions for each stage
  const gradientDefs = useMemo(() => {
    return chartData.map((item) => {
      const baseColor = item.color;
      // Create lighter shade for gradient
      const lightColor = baseColor; // Use same color or create lighter variant
      return {
        id: getGradientId(item.name),
        base: baseColor,
        light: lightColor,
      };
    });
  }, [chartData]);

  // Label components
  const labelPercent = (props: any) => {
    const { x, y, width, value } = props;
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number') return null;
    const pct = Number(value);
    const text = `${pct.toFixed(2).replace(/\.00$/, '')}%`;
    return (
      <g>
        <foreignObject x={x + width / 2 - 28} y={y - 26} width={56} height={20}>
          <div style={{
            background: '#fff', borderRadius: 0, padding: '2px 8px',
            fontSize: 10, fontWeight: 700, color: '#2a2a2f', border: '1px solid #efefef',
            textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap'
          }}>
            {text}
          </div>
        </foreignObject>
      </g>
    );
  };

  const labelValue = (props: any) => {
    const { x, y, width, height, value } = props;
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') return null;
    const isInside = height > 28;
    const bgY = isInside ? y + height - 20 : y - 22;
    const formatted = formatNumberToIndianShort(Number(value));
    return (
      <g>
        <foreignObject x={x + width / 2 - 28} y={bgY} width={56} height={20}>
          <div style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 0, padding: '2px 8px',
            fontSize: 10, color: '#626266', textAlign: 'center',
            lineHeight: 1.1, whiteSpace: 'nowrap'
          }}>
            {formatted}
          </div>
        </foreignObject>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-[#efefef] bg-white/95 shadow-md px-2 py-1.5 sm:px-3 sm:py-2 min-w-[140px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f]">{data.name}</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#626266]">{data.percentage.toFixed(2).replace(/\.00$/, '')}%</div>
            <div className="text-[11px] sm:text-[12px] text-[#2a2a2f] font-bold">{formatNumberToIndianShort(data.count)}</div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state or empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e9e9e9] p-8 text-center">
        <p className="text-[#626266]">No funnel data available</p>
      </div>
    );
  }

  const maxVal = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="space-y-4 w-full">
      {/* Main Funnel Visualization */}
      <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-5 lg:p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2a2a2f] font-manrope">Funnel Flow</h2>
            <p className="text-sm text-[#626266] font-manrope mt-1">Interactive customer journey visualization</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#626266]">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Hover for details</span>
            <span className="sm:hidden">Tap for details</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#e9e9e9] mb-6"></div>

        {/* Bar Chart */}
        <div style={{ marginTop: '24px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <RBarChart data={chartData} margin={{ top: 28, right: 8, left: 8, bottom: 8 }}>
              <defs>
                {gradientDefs.map((grad) => {
                  // Create a lighter version of the color for gradient
                  const baseColor = grad.base;
                  // For brand colors, create lighter variants
                  let lightColor = baseColor;
                  if (baseColor === '#9747FF') lightColor = '#9E83FF';
                  else if (baseColor === '#A877FF') lightColor = '#B891FF';
                  else if (baseColor === '#B891FF') lightColor = '#C9A8FF';
                  else if (baseColor === '#C9A8FF') lightColor = '#D4C5FF';
                  else if (baseColor === '#7C3AED') lightColor = '#9747FF';
                  else lightColor = baseColor;

                  return (
                    <linearGradient key={grad.id} id={grad.id} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor={baseColor} />
                      <stop offset="100%" stopColor={lightColor} stopOpacity={0.6} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#626266' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide domain={[0, maxVal]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" barSize={96} radius={[4,4,0,0]} animationDuration={900}>
                <LabelList dataKey="pct" content={labelPercent} />
                <LabelList dataKey="count" content={labelValue} />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#${getGradientId(entry.name)})`} />
                ))}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

