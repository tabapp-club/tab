'use client';

interface FunnelFiltersProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

const timeRanges = [
  { value: '7d' as const, label: '7 Days' },
  { value: '30d' as const, label: '30 Days' },
  { value: '90d' as const, label: '90 Days' },
  { value: '1y' as const, label: '1 Year' },
];

export function FunnelFilters({
  timeRange,
  onTimeRangeChange,
}: FunnelFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-end">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:justify-end">
        {/* Time Range Filter */}
        <div className="flex-1 sm:flex-initial">
          <label className="block text-xs text-[#626266] mb-2 font-manrope">Time Range</label>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`h-10 px-3 text-xs font-medium rounded-md border ${
                  timeRange === range.value
                    ? 'bg-white border-[#9747FF] text-[#9747FF]'
                    : 'bg-white border-[#e9e9e9] text-[#2a2a2f]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

