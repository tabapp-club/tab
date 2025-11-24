import { useEffect, useState, useRef } from 'react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip } from 'recharts';

const UserIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M16.4062 4.66562H4.59375C4.50673 4.66562 4.42327 4.70019 4.36173 4.76172C4.3002 4.82326 4.26562 4.90672 4.26562 4.99374V16.8062C4.26562 16.8933 4.3002 16.9767 4.36173 17.0383C4.42327 17.0998 4.50673 17.1344 4.59375 17.1344H16.4062C16.4933 17.1344 16.5767 17.0998 16.6383 17.0383C16.6998 16.9767 16.7344 16.8933 16.7344 16.8062V4.99374C16.7344 4.90672 16.6998 4.82326 16.6383 4.76172C16.5767 4.70019 16.4933 4.66562 16.4062 4.66562ZM4.59375 3.68124C4.24565 3.68124 3.91181 3.81952 3.66567 4.06567C3.41953 4.31181 3.28125 4.64565 3.28125 4.99374V16.8062C3.28125 17.1543 3.41953 17.4882 3.66567 17.7343C3.91181 17.9805 4.24565 18.1187 4.59375 18.1187H16.4062C16.7543 18.1187 17.0882 17.9805 17.3343 17.7343C17.5805 17.4882 17.7188 17.1543 17.7188 16.8062V4.99374C17.7188 4.64565 17.5805 4.31181 17.3343 4.06567C17.0882 3.81952 16.7543 3.68124 16.4062 3.68124H4.59375ZM10.5 13.0328C10.6305 13.0328 10.7557 13.0847 10.848 13.177C10.9403 13.2693 10.9922 13.3945 10.9922 13.525V15.4937C10.9922 15.6243 10.9403 15.7495 10.848 15.8418C10.7557 15.9341 10.6305 15.9859 10.5 15.9859C10.3695 15.9859 10.2443 15.9341 10.152 15.8418C10.0597 15.7495 10.0078 15.6243 10.0078 15.4937V13.525C10.0078 13.3945 10.0597 13.2693 10.152 13.177C10.2443 13.0847 10.3695 13.0328 10.5 13.0328ZM7.71094 14.8375C7.71094 14.707 7.65908 14.5818 7.56678 14.4895C7.47448 14.3972 7.34929 14.3453 7.21875 14.3453C7.08821 14.3453 6.96302 14.3972 6.87072 14.4895C6.77842 14.5818 6.72656 14.707 6.72656 14.8375V15.4937C6.72656 15.6243 6.77842 15.7495 6.87072 15.8418C6.96302 15.9341 7.08821 15.9859 7.21875 15.9859C7.34929 15.9859 7.47448 15.9341 7.56678 15.8418C7.65908 15.7495 7.71094 15.6243 7.71094 15.4937V14.8375ZM13.7812 14.3453C13.9118 14.3453 14.037 14.3972 14.1293 14.4895C14.2216 14.5818 14.2734 14.707 14.2734 14.8375V15.4937C14.2734 15.6243 14.2216 15.7495 14.1293 15.8418C14.037 15.9341 13.9118 15.9859 13.7812 15.9859C13.6507 15.9859 13.5255 15.9341 13.4332 15.8418C13.3409 15.7495 13.2891 15.6243 13.2891 15.4937V14.8375C13.2891 14.707 13.3409 14.5818 13.4332 14.4895C13.5255 14.3972 13.6507 14.3453 13.7812 14.3453ZM5.88656 10.8803C5.83821 10.9254 5.79942 10.9797 5.77252 11.0401C5.74562 11.1005 5.73115 11.1656 5.72999 11.2317C5.72882 11.2978 5.74098 11.3634 5.76573 11.4247C5.79049 11.486 5.82733 11.5417 5.87407 11.5884C5.92081 11.6352 5.97648 11.672 6.03776 11.6968C6.09905 11.7215 6.16469 11.7337 6.23078 11.7325C6.29687 11.7313 6.36204 11.7169 6.42242 11.69C6.48279 11.6631 6.53713 11.6243 6.58219 11.5759L8.53125 9.62687L10.1522 11.2478C10.2445 11.34 10.3696 11.3917 10.5 11.3917C10.6304 11.3917 10.7555 11.34 10.8478 11.2478L15.1134 6.98218C15.1618 6.93712 15.2006 6.88278 15.2275 6.82241C15.2544 6.76203 15.2688 6.69686 15.27 6.63077C15.2712 6.56469 15.259 6.49904 15.2343 6.43776C15.2095 6.37647 15.1727 6.3208 15.1259 6.27406C15.0792 6.22733 15.0235 6.19048 14.9622 6.16573C14.9009 6.14097 14.8353 6.12881 14.7692 6.12998C14.7031 6.13115 14.638 6.14561 14.5776 6.17251C14.5172 6.19941 14.4629 6.2382 14.4178 6.28656L10.5 10.2044L8.87906 8.58343C8.78678 8.49126 8.66168 8.43949 8.53125 8.43949C8.40082 8.43949 8.27572 8.49126 8.18344 8.58343L5.88656 10.8803Z" fill="#9747FF"/>
</svg>

);

const SalesIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3L9 9L15 3L21 9" stroke="#17c653" strokeWidth="2" fill="none"/>
    <path d="M3 15L9 9L15 15L21 9" stroke="#17c653" strokeWidth="2" fill="none"/>
    <path d="M3 3V19H21" stroke="#17c653" strokeWidth="2" fill="none"/>
  </svg>
);

const PurchaseIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#17c653" strokeWidth="2" fill="none"/>
    <path d="M3 6H21" stroke="#17c653" strokeWidth="2" fill="none"/>
    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#17c653" strokeWidth="2" fill="none"/>
  </svg>
);

const RupeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-[#2a2a2f]">
    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
  </svg>
);

const TrendUpIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4l-5 5-3-3-3 3" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M8 4h4v4" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);


const TrendDownIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 10l-5-5-3 3-3-3" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M8 10h4V6" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);

const NumbersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 1v14M10 1v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="2" height="6" fill="currentColor" rx="1"/>
    <rect x="7" y="6" width="2" height="8" fill="currentColor" rx="1"/>
    <rect x="11" y="4" width="2" height="10" fill="currentColor" rx="1"/>
  </svg>
);

// Toggle Slider Component
const ToggleSlider = ({ isChart, onToggle }: { isChart: boolean; onToggle: () => void }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`text-xs font-medium transition-colors duration-200 ${
        !isChart ? 'text-[#9747FF]' : 'text-[#626266]'
      }`}>
        Numbers
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#9747FF] focus:ring-opacity-50 ${
          isChart
            ? 'bg-[#9747FF] hover:bg-[#9747FF]'
            : 'bg-[#e9e9e9] hover:bg-[#d1d1d1]'
        }`}
        type="button"
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
            isChart ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <div className={`text-xs font-medium transition-colors duration-200 ${
        isChart ? 'text-[#9747FF]' : 'text-[#626266]'
      }`}>
        Graph
      </div>
    </div>
  );
};

// Helpers for Indian short number format (K, L, CR)
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

const extractNumericFromString = (raw: string): number => {
  // Remove non-digit except decimal point, then parse
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const formatFromValueString = (raw: string): string => {
  if (raw === '-') return '-';
  const n = extractNumericFromString(raw);
  return formatNumberToIndianShort(n);
};

// Easing helpers for smoother, less abrupt animations
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Animated Number Component
const AnimatedNumber = ({ value, loading = false }: { value: string; loading?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(formatFromValueString(value));
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === prevValueRef.current || loading) {
      setDisplayValue(formatFromValueString(value));
      return;
    }

    const end = extractNumericFromString(value);
    const start = extractNumericFromString(prevValueRef.current);
    if (end <= 0 || start < 0) {
      setDisplayValue(formatFromValueString(value));
      prevValueRef.current = value;
      return;
    }

    setIsAnimating(true);
    const duration = 2600; // longer + eased for smoothness
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = easeInOutCubic(elapsed);
      const current = start + (end - start) * eased;
      setDisplayValue(formatNumberToIndianShort(current));
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(formatFromValueString(value));
        setIsAnimating(false);
        prevValueRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, loading]);

  if (loading && value === "-") {
    return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
  }

  return (
    <div className={`transition-transform duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      {displayValue}
    </div>
  );
};

// Bar Chart Component (updated with smoother animation & styling)`
const BarChart = ({ currentValue, previousValue, title, trend }: {
  currentValue: string;
  previousValue: string;
  title: string;
  trend: string;
}) => {
  const [animatedPrevHeight, setAnimatedPrevHeight] = useState(0);
  const [animatedCurrHeight, setAnimatedCurrHeight] = useState(0);

  // Parse numeric values from strings
  const current = parseInt(currentValue.replace(/[^\d]/g, '')) || 0;
  const previous = parseInt(previousValue.replace(/[^\d]/g, '')) || Math.floor(current * 0.8);

  // Calculate max value for scaling
  const maxValue = Math.max(current, previous);
  const targetCurrentHeight = maxValue > 0 ? (current / maxValue) * 100 : 0;
  const targetPreviousHeight = maxValue > 0 ? (previous / maxValue) * 100 : 0;

  useEffect(() => {
    // Animate from 0 to target heights on mount/prop change
    const raf = requestAnimationFrame(() => {
      setAnimatedPrevHeight(targetPreviousHeight);
      setAnimatedCurrHeight(targetCurrentHeight);
    });
    return () => cancelAnimationFrame(raf);
  }, [targetPreviousHeight, targetCurrentHeight]);

  const isPositiveTrend = trend === "up";
  const currentBarGradient = "bg-gradient-to-t from-[#9747FF] to-[#9e83ff]";
  const previousBarGradient = "bg-gradient-to-t from-[#c7bbff] to-[#a795ff]";

  return (
    <div className="w-full h-32 flex items-end justify-center gap-6 px-4">
      {/* Previous Value Bar */}
      <div className="flex flex-col items-center gap-2 relative group">
        <div className="h-32 w-[52px] bg-[#9747FF]/10 rounded-md flex items-end overflow-hidden">
          <div
            className={`w-full ${previousBarGradient} rounded-md transition-all duration-700 ease-out will-change-[height,transform]  hover:shadow-lg`}
            style={{ height: `${animatedPrevHeight}%` }}
          />
        </div>
        <div className="text-xs text-[#626266] font-medium">Previous</div>

        {/* Tooltip for Previous Value */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0  group-hover:opacity-100  transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-gray-700 z-[9999]">
          <div className="font-semibold text-white mb-1">{title}</div>
          <div className="text-gray-200">Previous: {previousValue}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>

      {/* Current Value Bar */}
      <div className="flex flex-col items-center gap-2 relative group">
        <div className="h-32 w-[52px] bg-[#9747FF]/10 rounded-md flex items-end overflow-hidden">
          <div
            className={`w-full ${currentBarGradient} rounded-md transition-all duration-700 ease-out will-change-[height,transform]  hover:shadow-lg`}
            style={{ height: `${animatedCurrHeight}%` }}
          />
        </div>
        <div className="text-xs text-[#626266] font-medium">Current</div>

        {/* Tooltip for Current Value */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0  group-hover:opacity-100  transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-gray-700 z-[9999]">
          <div className="font-semibold text-white mb-1">{title}</div>
          <div className="text-gray-200">Current: {currentValue}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
};

// Recharts-based Comparison Bar (for business report cards)
const RechartsComparisonBar = ({ currentValue, previousValue, title }: {
  currentValue: string;
  previousValue: string;
  title: string;
}) => {
  const current = parseInt(currentValue.replace(/[^\d]/g, '')) || 0;
  const previous = parseInt(previousValue.replace(/[^\d]/g, '')) || 0;
  const maxVal = Math.max(current, previous, 1);
  const isCurrentHigher = current >= previous;

  const data = [
    {
      name: 'pair',
      prev: previous,
      curr: current,
      prevPct: Math.round((previous / maxVal) * 10000) / 100,
      currPct: Math.round((current / maxVal) * 10000) / 100,
    },
  ];

  // Elegant palettes
  const purple = { base: '#9747FF', light: '#9E83FF' };
  const purpleNeutral = { base: '#C7BBFF', light: '#E2DBFF' };
  const coral = { base: '#FF6B6B', light: '#FF9A9A' };

  // If current is higher → current: purple, previous: neutral purple
  // If current is lower → current: coral, previous: purple
  const currentColors = isCurrentHigher ? purple : coral;
  const previousColors = isCurrentHigher ? purpleNeutral : purple;

  const gradIdPrev = `grad-prev-${title.replace(/\s+/g, '-')}`;
  const gradIdCurr = `grad-curr-${title.replace(/\s+/g, '-')}`;

  const labelPercent = (key: 'prevPct' | 'currPct') => {
    const LabelPercentComponent = (props: any) => {
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
    LabelPercentComponent.displayName = 'LabelPercentComponent';
    return LabelPercentComponent;
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
    const prevItem = payload.find((p: any) => p.dataKey === 'prev');
    const currItem = payload.find((p: any) => p.dataKey === 'curr');
    const prevVal = prevItem ? formatNumberToIndianShort(Number(prevItem.value)) : undefined;
    const currVal = currItem ? formatNumberToIndianShort(Number(currItem.value)) : undefined;
    const prevPct = data[0].prevPct;
    const currPct = data[0].currPct;
    return (
      <div className="rounded-md border border-[#efefef] bg-white/95 shadow-md px-2 py-1.5 sm:px-3 sm:py-2 min-w-[140px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previousColors.base }} />
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f]">Previous</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#626266]">{prevPct.toFixed(2).replace(/\.00$/, '')}%</div>
            <div className="text-[11px] sm:text-[12px] text-[#2a2a2f] font-bold">{prevVal}</div>
          </div>
        </div>
        <div className="h-px bg-[#efefef] my-1" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColors.base }} />
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#2a2a2f]">Current</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#626266]">{currPct.toFixed(2).replace(/\.00$/, '')}%</div>
            <div className="text-[11px] sm:text-[12px] text-[#2a2a2f] font-bold">{currVal}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <RBarChart data={data} margin={{ top: 28, right: 8, left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id={gradIdPrev} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={previousColors.base} />
            <stop offset="100%" stopColor={previousColors.light} stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id={gradIdCurr} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={currentColors.base} />
            <stop offset="100%" stopColor={currentColors.light} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f3" />
        <XAxis dataKey="name" hide axisLine={false} tickLine={false} />
        <YAxis hide domain={[0, maxVal]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="prev" barSize={64} radius={[4,4,0,0]} fill={`url(#${gradIdPrev})`} animationDuration={900}>
          <LabelList dataKey="prevPct" content={labelPercent('prevPct')} />
          <LabelList dataKey="prev" content={labelValue} />
        </Bar>
        <Bar dataKey="curr" barSize={64} radius={[4,4,0,0]} fill={`url(#${gradIdCurr})`} animationDuration={900}>
          <LabelList dataKey="currPct" content={labelPercent('currPct')} />
          <LabelList dataKey="curr" content={labelValue} />
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
};

// Animated Percentage Component
const AnimatedPercentage = ({ value, loading = false }: { value: string; loading?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === prevValueRef.current || loading) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    const end = parseFloat(value.replace('%', '')) || 0;
    const start = parseFloat(prevValueRef.current.replace('%', '')) || 0;
    const duration = 2200;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = easeInOutCubic(elapsed);
      const current = start + (end - start) * eased;
      setDisplayValue(current.toFixed(2) + '%');
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
        prevValueRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, loading]);

  return (
    <div className={`transition-transform duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      {displayValue}
    </div>
  );
};

const analyticsData = [
  {
    id: 1,
    title: "Total Patients/Clients",
    subtitle: "5 July, 2025",
    legendLabel: "Patients/Clients",
    value: "₹1,25,000",
    previousValue: "₹1,11,000",
    unit: "Users",
    trend: "up",
    trendValue: "12.5%",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 2,
    title: "Total Business",
    subtitle: "5 July, 2025",
    legendLabel: "Total Business",
    value: "₹85,000",
    previousValue: "₹92,500",
    unit: "Rupees",
    trend: "down",
    trendValue: "8.2%",
    bgColor: "bg-[#17c653]"
  },
  {
    id: 3,
    title: "All patients/clients",
    subtitle: "5 July, 2025",
    legendLabel: "New + Retained patients/clients",
    value: "1,258",
    previousValue: "1,422",
    unit: "Users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 4,
    title: "New patients/clients",
    subtitle: "5 July, 2025",
    legendLabel: "New patients/clients",
    value: "958",
    previousValue: "1,082",
    unit: "Users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 5,
    title: "Retained patients/clients",
    subtitle: "5 July, 2025",
    legendLabel: "Retained patients/clients",
    value: "300",
    previousValue: "269",
    unit: "Users",
    trend: "up",
    trendValue: "11.49%",
    bgColor: "bg-[#9747FF]"
  },
  {
    id: 6,
    title: "Active patients/clients",
    subtitle: "5 July, 2025",
    legendLabel: "Active patients/clients",
    value: "1,200",
    previousValue: "1,356",
    unit: "Users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#9747FF]"
  }
];

export function AnalyticsCards({ data, onAskReason, loading = false }: { data?: typeof analyticsData; onAskReason?: (cardType: string, cardData: any) => void; loading?: boolean }) {
  const displayData = data && data.length > 0 ? data : analyticsData;

  // State to track view mode for business metrics (single toggle for all)
  const [businessMetricsView, setBusinessMetricsView] = useState<'numbers' | 'chart'>('chart');

  const toggleBusinessMetricsView = () => {
    setBusinessMetricsView(prev => prev === 'chart' ? 'numbers' : 'chart');
  };

  const getCardIcon = (cardTitle: string) => {
    switch (cardTitle) {
      case "Total Patients/Clients":
        return <SalesIcon />;
      case "Total Business":
        return <PurchaseIcon />;
      default:
        return <UserIcon />;
    }
  };

  // Separate data into business metrics and patient/client metrics
  const businessMetrics = displayData.filter(card =>
    card.title === "Total Patients/Clients" || card.title === "Total Business"
  );
  const customerMetrics = displayData.filter(card =>
    card.title !== "Total Patients/Clients" && card.title !== "Total Business"
  );

  // Derived: Overall Growth Rate (average of Total Patients/Clients and Total Business percentage changes)
  const growthRateCard = (() => {
    const sales = businessMetrics.find(c => c.title === "Total Patients/Clients");
    const purchase = businessMetrics.find(c => c.title === "Total Business");
    if (!sales || !purchase) return null;

    const parseTrend = (card: any) => {
      const numeric = parseFloat(String(card.trendValue || '0').toString().replace('%', '')) || 0;
      return (card.trend === 'down' ? -numeric : numeric);
    };

    const avg = (parseTrend(sales) + parseTrend(purchase)) / 2;
    const isUp = avg >= 0;
    const pct = Math.abs(avg).toFixed(2) + '%';

    return {
      id: 10001,
      title: "Overall growth rate",
      subtitle: sales.subtitle || purchase.subtitle || '',
      legendLabel: "Growth rate",
      value: pct,
      previousValue: '-',
      unit: 'Percent',
      trend: isUp ? 'up' : 'down',
      trendValue: pct,
      bgColor: isUp ? "bg-[#17c653]" : "bg-[#e34f2f]",
    };
  })();

  return (
    <div className="space-y-6">
      {/* Business Metrics Section */}
      <div className="bg-white rounded-lg border border-[#e9e9e9] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2a2a2f]">Business Metrics</h2>
          <ToggleSlider
            isChart={businessMetricsView === 'chart'}
            onToggle={toggleBusinessMetricsView}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {businessMetrics.map((card) => {
        const isPositiveTrend = card.trend === "up";
        const trendBgColor = isPositiveTrend ? "bg-[rgba(23,198,83,0.1)]" : "bg-[rgba(227,79,47,0.1)]";
        const trendTextColor = isPositiveTrend ? "text-[#17c653]" : "text-[#e34f2f]";
        const trendIndicatorColor = isPositiveTrend ? "bg-[#17c653]" : "bg-[#e34f2f]";
            const trendIconColor = isPositiveTrend ? "#17c653" : "#e34f2f";

        return (
          <div
            key={card.id}
                className="bg-white border border-[#e9e9e9] rounded-lg p-px overflow-hidden"
          >
            {/* Header */}
            <div className="min-h-16 border-b border-[#e9e9e9] px-4 py-2">
              <div className="flex gap-2 items-start">
                <div className="w-[21px] h-[21px] flex items-center justify-center flex-shrink-0">
                      {<UserIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
                    {card.title}
                  </div>
                  <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px]">
                    {card.subtitle}
                  </div>
                </div>
              </div>
            </div>

                                    {/* Content */}
            <div className="h-[263.8px] min-h-[250px] flex flex-col items-center justify-center gap-4 p-4 relative">
              {/* Numbers View */}
              <div className={`absolute inset-0 p-4 flex flex-col items-center justify-center gap-4 mb-10 transition-all duration-500 ease-in-out ${
                businessMetricsView === 'chart'
                  ? 'opacity-0 transform translate-x-[-100%] pointer-events-none'
                  : 'opacity-100 transform translate-x-0'
              }`}>
                <div className="w-full flex flex-col items-center">
                  {/* Legend */}
                  <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-1">
                    <div className="flex items-center gap-[5px] max-w-full overflow-hidden">
                      <div className={`w-2.5 h-2.5 rounded-sm ${trendIndicatorColor} flex-shrink-0`}></div>
                      <div className="text-[11.0625px] font-medium text-[#626266] leading-[12px] truncate">
                        {card.legendLabel}
                      </div>
                    </div>
                  </div>

                  {/* Main Value */}
                  <div className="w-full max-w-[163px] flex flex-col items-center">
                    <div className="w-full px-0 py-1 flex items-center justify-center">
                      <div className="w-full flex flex-col items-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[63.2812px] font-bold text-[#2a2a2f] leading-tight sm:leading-[72px] tracking-[-2.88px] break-words flex items-center gap-1">
                          { card.title === "Total Business" ? (<div className="text-xl sm:text-2xl md:text-3xl lg:text-[48px] font-bold text-[#2a2a2f] leading-tight sm:leading-[72px] tracking-[-2.88px] break-words flex items-center gap-1">₹</div>): null }<AnimatedNumber value={card.value} loading={loading} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="text-[10.875px] font-normal text-[#626266] leading-[16.8px] tracking-[-0.1px] whitespace-nowrap">
                        {card.unit}
                      </div>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  <div className={`px-2 py-0.5 rounded-[3px] flex items-start gap-0 ${trendBgColor} mt-4`}>
                    <div className="w-4 h-3.5 flex items-center justify-center flex-shrink-0">
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        {isPositiveTrend ? (
                          <div className="rotate-180">
                                <TrendDownIcon color={trendIconColor} />
                          </div>
                        ) : (
                          <div className="scale-y-[-1]">
                                <TrendUpIcon color={trendIconColor} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center self-stretch">
                      <div className="flex flex-col items-start justify-start h-full">
                        <div className={`text-[12px] font-normal leading-[16.8px] tracking-[-0.1px] max-h-[16.8px] whitespace-nowrap ${trendTextColor}`}>
                          <AnimatedPercentage value={card.trendValue} loading={loading} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                  {/* Chart View */}
                <div className={`absolute inset-0 p-4 flex flex-col mb-10 transition-all duration-500 ease-in-out ${
                  businessMetricsView === 'chart'
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-[100%] pointer-events-none'
                }`}>
                <div className="w-full h-full flex flex-col">
                  {/* Legend */}
                  <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-4">
                    <div className="flex items-center gap-[5px] max-w-full overflow-hidden">
                      {/* <div className={`w-2.5 h-2.5 rounded-sm ${trendIndicatorColor} flex-shrink-0`}></div>
                      <div className="text-[11.0625px] font-medium text-[#626266] leading-[12px] truncate">
                        {card.legendLabel}
                      </div> */}
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[260px]">
                      <RechartsComparisonBar
                        currentValue={card.value}
                        previousValue={card.previousValue || card.value}
                        title={card.title}
                      />
                    </div>
                  </div>

                  {/* Values Display */}
                  {/* <div className="flex justify-between items-center text-xs text-[#626266] mt-2">
                    <div>Previous: {card.previousValue || "N/A"}</div>
                    <div>Current: {card.value}</div>
                  </div> */}
                </div>
                  </div>

                  {/* Ask Reason Text Button */}
                  <button
                    onClick={() => onAskReason?.(card.title, card)}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-9 px-3 text-[#9747FF] bg-transparent hover:bg-[#9747FF]/10  transition-all duration-300 ease-in-out  text-[14px] font-semibold rounded flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Get analysis</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            );
          })}

          {growthRateCard && (
            <div
              key={growthRateCard.id}
              className="bg-white border border-[#e9e9e9] rounded-lg p-px overflow-hidden"
            >
              {/* Header */}
              <div className="min-h-16 border-b border-[#e9e9e9] px-4 py-2">
                <div className="flex gap-2 items-start">
                  <div className="w-[21px] h-[21px] flex items-center justify-center flex-shrink-0">
                    {<UserIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
                      {growthRateCard.title}
                    </div>
                    <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px]">
                      {growthRateCard.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content with toggle views */}
              <div className="h-[263.8px] min-h-[250px] flex flex-col items-center justify-center gap-4 p-4 relative">
                {/* Numbers View */}
                <div className={`absolute inset-0 p-4 flex flex-col items-center justify-center gap-4 mb-10 transition-all duration-500 ease-in-out ${
                  businessMetricsView === 'chart'
                    ? 'opacity-0 transform translate-x-[-100%] pointer-events-none'
                    : 'opacity-100 transform translate-x-0'
                }`}>
                  <div className="w-full flex flex-col items-center">
                    {/* Legend */}
                    <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-1">
                      <div className="flex items-center gap-[5px] max-w-full overflow-hidden">
                        <div className={`w-2.5 h-2.5 rounded-sm ${growthRateCard.trend === 'up' ? 'bg-[#17c653]' : 'bg-[#e34f2f]'} flex-shrink-0`}></div>
                        <div className="text-[11.0625px] font-medium text-[#626266] leading-[12px] truncate">
                          {growthRateCard.legendLabel}
                        </div>
                      </div>
                    </div>

                    {/* Main Value */}
                    <div className="w-full max-w-[163px] flex flex-col items-center">
                      <div className="w-full px-0 py-1 flex items-center justify-center">
                        <div className="w-full flex flex-col items-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[63.2812px] font-bold text-[#2a2a2f] leading-tight sm:leading-[72px] tracking-[-2.88px] break-words flex items-center gap-1">
                            <AnimatedPercentage value={growthRateCard.value} loading={loading} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="text-[10.875px] font-normal text-[#626266] leading-[16.8px] tracking-[-0.1px] whitespace-nowrap">
                          {growthRateCard.unit}
                        </div>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className={`px-2 py-0.5 rounded-[3px] flex items-start gap-0 ${growthRateCard.trend === 'up' ? 'bg-[rgba(23,198,83,0.1)]' : 'bg-[rgba(227,79,47,0.1)]'} mt-4`}>
                      <div className="w-4 h-3.5 flex items-center justify-center flex-shrink-0">
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                          {growthRateCard.trend === 'up' ? (
                            <div className="rotate-180">
                              <TrendDownIcon color="#17c653" />
                            </div>
                          ) : (
                            <div className="scale-y-[-1]">
                              <TrendUpIcon color="#e34f2f" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center self-stretch">
                        <div className="flex flex-col items-start justify-start h-full">
                          <div className={`text-[12px] font-normal leading-[16.8px] tracking-[-0.1px] max-h-[16.8px] whitespace-nowrap ${growthRateCard.trend === 'up' ? 'text-[#17c653]' : 'text-[#e34f2f]'}`}>
                            <AnimatedPercentage value={growthRateCard.trendValue} loading={loading} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart View */}
                <div className={`absolute inset-0 p-4 flex flex-col mb-10 transition-all duration-500 ease-in-out ${
                  businessMetricsView === 'chart'
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-[100%] pointer-events-none'
                }`}>
                  <div className="w-full h-full flex flex-col">
                    {/* Legend placeholder (hidden as in other charts) */}
                    <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-4">
                      <div className="flex items-center gap-[5px] max-w-full overflow-hidden" />
                    </div>
                    {/* Bar Chart using average of Total Patients/Clients and Total Business values */}
                    <div className="flex-1 flex items-center justify-center">
                      {(() => {
                        const sales = businessMetrics.find(c => c.title === 'Total Patients/Clients');
                        const purchase = businessMetrics.find(c => c.title === 'Total Business');
                        const currAvg = Math.round((extractNumericFromString(sales?.value || '0') + extractNumericFromString(purchase?.value || '0')) / 2);
                        const prevAvg = Math.round((extractNumericFromString(sales?.previousValue || '0') + extractNumericFromString(purchase?.previousValue || '0')) / 2);
                        return (
                          <div className="w-full max-w-[260px]">
                            <RechartsComparisonBar
                              currentValue={currAvg.toLocaleString('en-IN')}
                              previousValue={prevAvg.toLocaleString('en-IN')}
                              title={growthRateCard.title}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Ask Reason Text Button */}
                <button
                  onClick={() => onAskReason?.(growthRateCard.title, growthRateCard)}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-9 px-3 text-[#9747FF] bg-transparent hover:bg-[#9747FF]/10  transition-all duration-300 ease-in-out  text-[14px] font-semibold rounded flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Get analysis</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patient/Client Metrics Section */}
      <div className="bg-white rounded-lg border border-[#e9e9e9] p-6">
        <h2 className="text-xl font-bold text-[#2a2a2f] mb-4">Patient/Client Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {customerMetrics.map((card) => {
            const isPositiveTrend = card.trend === "up";
            let trendBgColor = isPositiveTrend ? "bg-[rgba(23,198,83,0.1)]" : "bg-[rgba(227,79,47,0.1)]";
            let trendTextColor = isPositiveTrend ? "text-[#17c653]" : "text-[#e34f2f]";
            let trendIndicatorColor = isPositiveTrend ? "bg-[#17c653]" : "bg-[#e34f2f]";
            let trendIconColor = isPositiveTrend ? "#17c653" : "#e34f2f";
            if (card.title === "Inactive patients/clients") {
              trendIndicatorColor = isPositiveTrend ? "bg-[#e34f2f]" : "bg-[#17c653]";
              trendBgColor = isPositiveTrend ? "bg-[rgba(227,79,47,0.1)]" : "bg-[rgba(23,198,83,0.1)]";
              trendTextColor = isPositiveTrend ? "text-[#e34f2f]" : "text-[#17c653]";
              trendIconColor = isPositiveTrend ? "#e34f2f" : "#17c653";
            }

            return (
              <div
                key={card.id}
                className="bg-white border border-[#e9e9e9] rounded-lg p-px overflow-hidden"
              >
                {/* Header */}
                <div className="min-h-16 border-b border-[#e9e9e9] px-4 py-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-[21px] h-[21px] flex items-center justify-center flex-shrink-0">
                      {getCardIcon(card.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
                        {card.title}
                      </div>
                      <div className="text-[13.5625px] font-normal text-[#626266] leading-[19.6px] tracking-[-0.1px]">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="h-[263.8px] min-h-[250px] flex flex-col items-center justify-center gap-4 p-4 relative overflow-hidden">
                  {/* Numbers View */}
                  <div className="w-full flex flex-col items-center mb-10">
                    {/* Legend */}
                    <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-1">
                      <div className="flex items-center gap-[5px] max-w-full overflow-hidden">
                        <div className={`w-2.5 h-2.5 rounded-sm ${trendIndicatorColor} flex-shrink-0`}></div>
                        <div className="text-[11.0625px] font-medium text-[#626266] leading-[12px] truncate">
                          {card.legendLabel}
                        </div>
                      </div>
                    </div>

                    {/* Main Value */}
                    <div className="w-full max-w-[163px] flex flex-col items-center">
                      <div className="w-full px-0 py-1 flex items-center justify-center">
                        <div className="w-full flex flex-col items-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[63.2812px] font-bold text-[#2a2a2f] leading-tight sm:leading-[72px] tracking-[-2.88px] break-words flex items-center gap-1">
                            <AnimatedNumber value={card.value} loading={loading} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="text-[10.875px] font-normal text-[#626266] leading-[16.8px] tracking-[-0.1px] whitespace-nowrap">
                          {card.unit}
                        </div>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className={`px-2 py-0.5 rounded-[3px] flex items-start gap-0 ${trendBgColor} mt-4`}>
                      <div className="w-4 h-3.5 flex items-center justify-center flex-shrink-0">
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                          {isPositiveTrend ? (
                            <div className="rotate-180">
                              <TrendDownIcon color={trendIconColor} />
                            </div>
                          ) : (
                            <div className="scale-y-[-1]">
                              <TrendUpIcon color={trendIconColor} />
                </div>
              )}
                        </div>
                      </div>
                      <div className="flex items-center self-stretch">
                        <div className="flex flex-col items-start justify-start h-full">
                          <div className={`text-[12px] font-normal leading-[16.8px] tracking-[-0.1px] max-h-[16.8px] whitespace-nowrap ${trendTextColor}`}>
                            <AnimatedPercentage value={card.trendValue} loading={loading} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

              {/* Ask Reason Text Button */}
              <button
                onClick={() => onAskReason?.(card.title, card)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-9 px-3 text-[#9747FF] bg-transparent hover:bg-[#9747FF]/10  transition-all duration-300 ease-in-out  text-[14px] font-semibold rounded flex items-center gap-1 whitespace-nowrap"
              >
                <span>Get analysis</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        );
      })}
        </div>
      </div>
    </div>
  );
}
