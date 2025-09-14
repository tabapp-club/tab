"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", whatsapp: 1247, sms: 892 },
  { date: "2024-04-02", whatsapp: 1156, sms: 934 },
  { date: "2024-04-03", whatsapp: 1089, sms: 876 },
  { date: "2024-04-04", whatsapp: 1324, sms: 1023 },
  { date: "2024-04-05", whatsapp: 1456, sms: 1156 },
  { date: "2024-04-06", whatsapp: 1389, sms: 1089 },
  { date: "2024-04-07", whatsapp: 1203, sms: 945 },
  { date: "2024-04-08", whatsapp: 1567, sms: 1234 },
  { date: "2024-04-09", whatsapp: 987, sms: 756 },
  { date: "2024-04-10", whatsapp: 1345, sms: 1089 },
  { date: "2024-04-11", whatsapp: 1423, sms: 1156 },
  { date: "2024-04-12", whatsapp: 1298, sms: 1023 },
  { date: "2024-04-13", whatsapp: 1456, sms: 1189 },
  { date: "2024-04-14", whatsapp: 1123, sms: 876 },
  { date: "2024-04-15", whatsapp: 1089, sms: 834 },
  { date: "2024-04-16", whatsapp: 1156, sms: 901 },
  { date: "2024-04-17", whatsapp: 1567, sms: 1234 },
  { date: "2024-04-18", whatsapp: 1423, sms: 1156 },
  { date: "2024-04-19", whatsapp: 1298, sms: 1023 },
  { date: "2024-04-20", whatsapp: 987, sms: 756 },
  { date: "2024-04-21", whatsapp: 1123, sms: 876 },
  { date: "2024-04-22", whatsapp: 1203, sms: 945 },
  { date: "2024-04-23", whatsapp: 1156, sms: 901 },
  { date: "2024-04-24", whatsapp: 1456, sms: 1189 },
  { date: "2024-04-25", whatsapp: 1324, sms: 1023 },
  { date: "2024-04-26", whatsapp: 987, sms: 756 },
  { date: "2024-04-27", whatsapp: 1567, sms: 1234 },
  { date: "2024-04-28", whatsapp: 1089, sms: 834 },
  { date: "2024-04-29", whatsapp: 1345, sms: 1089 },
  { date: "2024-04-30", whatsapp: 1456, sms: 1156 },
  { date: "2024-05-01", whatsapp: 1203, sms: 945 },
  { date: "2024-05-02", whatsapp: 1389, sms: 1089 },
  { date: "2024-05-03", whatsapp: 1298, sms: 1023 },
  { date: "2024-05-04", whatsapp: 1456, sms: 1156 },
  { date: "2024-05-05", whatsapp: 1567, sms: 1234 },
  { date: "2024-05-06", whatsapp: 1423, sms: 1156 },
  { date: "2024-05-07", whatsapp: 1389, sms: 1089 },
  { date: "2024-05-08", whatsapp: 1123, sms: 876 },
  { date: "2024-05-09", whatsapp: 1203, sms: 945 },
  { date: "2024-05-10", whatsapp: 1345, sms: 1089 },
  { date: "2024-05-11", whatsapp: 1423, sms: 1156 },
  { date: "2024-05-12", whatsapp: 1156, sms: 901 },
  { date: "2024-05-13", whatsapp: 1089, sms: 834 },
  { date: "2024-05-14", whatsapp: 1567, sms: 1234 },
  { date: "2024-05-15", whatsapp: 1456, sms: 1156 },
  { date: "2024-05-16", whatsapp: 1389, sms: 1089 },
  { date: "2024-05-17", whatsapp: 1423, sms: 1156 },
  { date: "2024-05-18", whatsapp: 1345, sms: 1089 },
  { date: "2024-05-19", whatsapp: 1203, sms: 945 },
  { date: "2024-05-20", whatsapp: 1156, sms: 901 },
  { date: "2024-05-21", whatsapp: 987, sms: 756 },
  { date: "2024-05-22", whatsapp: 1023, sms: 789 },
  { date: "2024-05-23", whatsapp: 1298, sms: 1023 },
  { date: "2024-05-24", whatsapp: 1389, sms: 1089 },
  { date: "2024-05-25", whatsapp: 1203, sms: 945 },
  { date: "2024-05-26", whatsapp: 1156, sms: 901 },
  { date: "2024-05-27", whatsapp: 1456, sms: 1156 },
  { date: "2024-05-28", whatsapp: 1324, sms: 1023 },
  { date: "2024-05-29", whatsapp: 987, sms: 756 },
  { date: "2024-05-30", whatsapp: 1345, sms: 1089 },
  { date: "2024-05-31", whatsapp: 1203, sms: 945 },
  { date: "2024-06-01", whatsapp: 1156, sms: 901 },
  { date: "2024-06-02", whatsapp: 1456, sms: 1156 },
  { date: "2024-06-03", whatsapp: 1089, sms: 834 },
  { date: "2024-06-04", whatsapp: 1423, sms: 1156 },
  { date: "2024-06-05", whatsapp: 987, sms: 756 },
  { date: "2024-06-06", whatsapp: 1298, sms: 1023 },
  { date: "2024-06-07", whatsapp: 1345, sms: 1089 },
  { date: "2024-06-08", whatsapp: 1389, sms: 1089 },
  { date: "2024-06-09", whatsapp: 1456, sms: 1156 },
  { date: "2024-06-10", whatsapp: 1123, sms: 876 },
  { date: "2024-06-11", whatsapp: 1023, sms: 789 },
  { date: "2024-06-12", whatsapp: 1423, sms: 1156 },
  { date: "2024-06-13", whatsapp: 987, sms: 756 },
  { date: "2024-06-14", whatsapp: 1389, sms: 1089 },
  { date: "2024-06-15", whatsapp: 1345, sms: 1089 },
  { date: "2024-06-16", whatsapp: 1324, sms: 1023 },
  { date: "2024-06-17", whatsapp: 1456, sms: 1156 },
  { date: "2024-06-18", whatsapp: 1089, sms: 834 },
  { date: "2024-06-19", whatsapp: 1345, sms: 1089 },
  { date: "2024-06-20", whatsapp: 1423, sms: 1156 },
  { date: "2024-06-21", whatsapp: 1203, sms: 945 },
  { date: "2024-06-22", whatsapp: 1298, sms: 1023 },
  { date: "2024-06-23", whatsapp: 1456, sms: 1156 },
  { date: "2024-06-24", whatsapp: 1123, sms: 876 },
  { date: "2024-06-25", whatsapp: 1156, sms: 901 },
  { date: "2024-06-26", whatsapp: 1423, sms: 1156 },
  { date: "2024-06-27", whatsapp: 1456, sms: 1156 },
  { date: "2024-06-28", whatsapp: 1203, sms: 945 },
  { date: "2024-06-29", whatsapp: 1089, sms: 834 },
  { date: "2024-06-30", whatsapp: 1389, sms: 1089 },
];

const chartConfig = {
  whatsapp: {
    label: "WhatsApp",
    color: "#6E4EFF",
  },
  sms: {
    label: "SMS",
    color: "#e34f2f",
  },
} satisfies ChartConfig;

export function WhatsAppSMSComparisonChart() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>WhatsApp vs SMS Performance</CardTitle>
          <CardDescription>
            Comparing message volumes and engagement across channels
          </CardDescription>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hidden w-[160px] h-8 px-3 py-px border border-[#e9e9e9] rounded-md bg-white flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors sm:ml-auto sm:flex"
            aria-label="Select a time range"
          >
            <span className="text-[13.453px] font-normal text-[#2a2a2f]">
              {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </span>
            <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
              <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          
          {/* Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-[#e9e9e9] rounded z-50 w-[160px]">
              {/* Header */}
              <div className="px-4 py-2 bg-white border-b border-gray-100">
                <span className="text-[12px] text-[#626266]">Select time range</span>
              </div>
              
              {/* Options */}
              <div className="py-2">
                {[
                  { value: '7d', label: 'Last 7 days' },
                  { value: '30d', label: 'Last 30 days' },
                  { value: '90d', label: 'Last 90 days' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${
                      timeRange === option.value ? 'bg-[#7856ff]/5' : ''
                    }`}
                  >
                    <div className={`w-[18px] h-[18px] flex items-center justify-center ${
                      timeRange === option.value
                        ? 'text-[#7856ff]'
                        : 'text-[#e9e9e9]'
                    }`}>
                      {timeRange === option.value && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-[14px] text-[#2a2a2f] tracking-[0.15px]">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-4 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillWhatsApp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#6E4EFF"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#6E4EFF"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSMS" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#e34f2f"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#e34f2f"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                
                const whatsappItem = payload.find((p: any) => p.dataKey === 'whatsapp');
                const smsItem = payload.find((p: any) => p.dataKey === 'sms');
                const whatsappVal = whatsappItem ? Number(whatsappItem.value).toLocaleString() : '0';
                const smsVal = smsItem ? Number(smsItem.value).toLocaleString() : '0';
                const total = Number(whatsappItem?.value || 0) + Number(smsItem?.value || 0);
                const whatsappPct = total > 0 ? ((Number(whatsappItem?.value || 0) / total) * 100).toFixed(1) : '0';
                const smsPct = total > 0 ? ((Number(smsItem?.value || 0) / total) * 100).toFixed(1) : '0';
                
                return (
                  <div className="rounded-md border border-[#efefef] bg-white/95 shadow-md px-2 py-1.5 sm:px-3 sm:py-2 min-w-[140px]">
                    <div className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f] mb-2">
                      {new Date(label).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6E4EFF' }} />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f]">WhatsApp</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#626266]">{whatsappPct}%</div>
                        <div className="text-[11px] sm:text-[12px] text-[#2a2a2f] font-bold">{whatsappVal}</div>
                      </div>
                    </div>
                    <div className="h-px bg-[#efefef] my-1" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e34f2f' }} />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f]">SMS</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#626266]">{smsPct}%</div>
                        <div className="text-[11px] sm:text-[12px] text-[#2a2a2f] font-bold">{smsVal}</div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="sms"
              type="natural"
              fill="url(#fillSMS)"
              stroke="#e34f2f"
              stackId="a"
            />
            <Area
              dataKey="whatsapp"
              type="natural"
              fill="url(#fillWhatsApp)"
              stroke="#6E4EFF"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
