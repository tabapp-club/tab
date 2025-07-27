import { useEffect, useState, useRef } from 'react';

const UserIcon = () => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M16.4062 4.66562H4.59375C4.50673 4.66562 4.42327 4.70019 4.36173 4.76172C4.3002 4.82326 4.26562 4.90672 4.26562 4.99374V16.8062C4.26562 16.8933 4.3002 16.9767 4.36173 17.0383C4.42327 17.0998 4.50673 17.1344 4.59375 17.1344H16.4062C16.4933 17.1344 16.5767 17.0998 16.6383 17.0383C16.6998 16.9767 16.7344 16.8933 16.7344 16.8062V4.99374C16.7344 4.90672 16.6998 4.82326 16.6383 4.76172C16.5767 4.70019 16.4933 4.66562 16.4062 4.66562ZM4.59375 3.68124C4.24565 3.68124 3.91181 3.81952 3.66567 4.06567C3.41953 4.31181 3.28125 4.64565 3.28125 4.99374V16.8062C3.28125 17.1543 3.41953 17.4882 3.66567 17.7343C3.91181 17.9805 4.24565 18.1187 4.59375 18.1187H16.4062C16.7543 18.1187 17.0882 17.9805 17.3343 17.7343C17.5805 17.4882 17.7188 17.1543 17.7188 16.8062V4.99374C17.7188 4.64565 17.5805 4.31181 17.3343 4.06567C17.0882 3.81952 16.7543 3.68124 16.4062 3.68124H4.59375ZM10.5 13.0328C10.6305 13.0328 10.7557 13.0847 10.848 13.177C10.9403 13.2693 10.9922 13.3945 10.9922 13.525V15.4937C10.9922 15.6243 10.9403 15.7495 10.848 15.8418C10.7557 15.9341 10.6305 15.9859 10.5 15.9859C10.3695 15.9859 10.2443 15.9341 10.152 15.8418C10.0597 15.7495 10.0078 15.6243 10.0078 15.4937V13.525C10.0078 13.3945 10.0597 13.2693 10.152 13.177C10.2443 13.0847 10.3695 13.0328 10.5 13.0328ZM7.71094 14.8375C7.71094 14.707 7.65908 14.5818 7.56678 14.4895C7.47448 14.3972 7.34929 14.3453 7.21875 14.3453C7.08821 14.3453 6.96302 14.3972 6.87072 14.4895C6.77842 14.5818 6.72656 14.707 6.72656 14.8375V15.4937C6.72656 15.6243 6.77842 15.7495 6.87072 15.8418C6.96302 15.9341 7.08821 15.9859 7.21875 15.9859C7.34929 15.9859 7.47448 15.9341 7.56678 15.8418C7.65908 15.7495 7.71094 15.6243 7.71094 15.4937V14.8375ZM13.7812 14.3453C13.9118 14.3453 14.037 14.3972 14.1293 14.4895C14.2216 14.5818 14.2734 14.707 14.2734 14.8375V15.4937C14.2734 15.6243 14.2216 15.7495 14.1293 15.8418C14.037 15.9341 13.9118 15.9859 13.7812 15.9859C13.6507 15.9859 13.5255 15.9341 13.4332 15.8418C13.3409 15.7495 13.2891 15.6243 13.2891 15.4937V14.8375C13.2891 14.707 13.3409 14.5818 13.4332 14.4895C13.5255 14.3972 13.6507 14.3453 13.7812 14.3453ZM5.88656 10.8803C5.83821 10.9254 5.79942 10.9797 5.77252 11.0401C5.74562 11.1005 5.73115 11.1656 5.72999 11.2317C5.72882 11.2978 5.74098 11.3634 5.76573 11.4247C5.79049 11.486 5.82733 11.5417 5.87407 11.5884C5.92081 11.6352 5.97648 11.672 6.03776 11.6968C6.09905 11.7215 6.16469 11.7337 6.23078 11.7325C6.29687 11.7313 6.36204 11.7169 6.42242 11.69C6.48279 11.6631 6.53713 11.6243 6.58219 11.5759L8.53125 9.62687L10.1522 11.2478C10.2445 11.34 10.3696 11.3917 10.5 11.3917C10.6304 11.3917 10.7555 11.34 10.8478 11.2478L15.1134 6.98218C15.1618 6.93712 15.2006 6.88278 15.2275 6.82241C15.2544 6.76203 15.2688 6.69686 15.27 6.63077C15.2712 6.56469 15.259 6.49904 15.2343 6.43776C15.2095 6.37647 15.1727 6.3208 15.1259 6.27406C15.0792 6.22733 15.0235 6.19048 14.9622 6.16573C14.9009 6.14097 14.8353 6.12881 14.7692 6.12998C14.7031 6.13115 14.638 6.14561 14.5776 6.17251C14.5172 6.19941 14.4629 6.2382 14.4178 6.28656L10.5 10.2044L8.87906 8.58343C8.78678 8.49126 8.66168 8.43949 8.53125 8.43949C8.40082 8.43949 8.27572 8.49126 8.18344 8.58343L5.88656 10.8803Z" fill="#7856FF"/>
</svg>

);

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4l-5 5-3-3-3 3" stroke="#e34f2f" strokeWidth="1.5" fill="none"/>
    <path d="M8 4h4v4" stroke="#e34f2f" strokeWidth="1.5" fill="none"/>
  </svg>
);


const TrendDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 10l-5-5-3 3-3-3" stroke="#17c653" strokeWidth="1.5" fill="none"/>
    <path d="M8 10h4V6" stroke="#17c653" strokeWidth="1.5" fill="none"/>
  </svg>
);

// Animated Number Component
const AnimatedNumber = ({ value, loading = false }: { value: string; loading?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

    useEffect(() => {
    if (value !== prevValueRef.current && !loading) {
      setIsAnimating(true);

      // Store the current value as the starting point for animation
      const startValue = prevValueRef.current;

      // Parse the numeric value (remove commas and non-numeric characters)
      const numericValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
      const prevNumericValue = parseInt(startValue.replace(/[^\d]/g, '')) || 0;

      // If it's a valid number, animate it
      if (numericValue > 0 && prevNumericValue > 0) {
        const duration = 1000; // 1 second
        const steps = 30;
        const increment = (numericValue - prevNumericValue) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const currentValue = Math.round(prevNumericValue + (increment * currentStep));
          setDisplayValue(currentValue.toLocaleString());

          if (currentStep >= steps) {
            setDisplayValue(value);
            setIsAnimating(false);
            clearInterval(timer);
            // Only update the ref after animation completes
            prevValueRef.current = value;
          }
        }, duration / steps);

        return () => clearInterval(timer);
      } else {
        // For non-numeric values or invalid numbers, just update immediately
        setDisplayValue(value);
        setIsAnimating(false);
        prevValueRef.current = value;
      }
    } else if (loading) {
      setDisplayValue(value);
    }
  }, [value, loading]);

  if (loading && value === "-") {
    return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
  }

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      {displayValue}
    </div>
  );
};

// Animated Percentage Component
const AnimatedPercentage = ({ value, loading = false }: { value: string; loading?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

    useEffect(() => {
    if (value !== prevValueRef.current && !loading) {
      setIsAnimating(true);

      // Store the current value as the starting point for animation
      const startValue = prevValueRef.current;

      // Parse the percentage value (remove % and convert to number)
      const numericValue = parseFloat(value.replace('%', '')) || 0;
      const prevNumericValue = parseFloat(startValue.replace('%', '')) || 0;

      // If it's a valid number, animate it
      if (!isNaN(numericValue) && !isNaN(prevNumericValue)) {
        const duration = 1000; // 1 second
        const steps = 30;
        const increment = (numericValue - prevNumericValue) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const currentValue = prevNumericValue + (increment * currentStep);
          setDisplayValue(currentValue.toFixed(2) + '%');

          if (currentStep >= steps) {
            setDisplayValue(value);
            setIsAnimating(false);
            clearInterval(timer);
            // Only update the ref after animation completes
            prevValueRef.current = value;
          }
        }, duration / steps);

        return () => clearInterval(timer);
      } else {
        // For non-numeric values or invalid numbers, just update immediately
        setDisplayValue(value);
        setIsAnimating(false);
        prevValueRef.current = value;
      }
    } else if (loading) {
      setDisplayValue(value);
    }
  }, [value, loading]);

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      {displayValue}
    </div>
  );
};

const analyticsData = [
  {
    id: 1,
    title: "All customers",
    subtitle: "5 July, 2025",
    legendLabel: "New + Retained customers",
    value: "1,258",
    unit: "users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#7856ff]"
  },
  {
    id: 2,
    title: "Unique customers",
    subtitle: "5 July, 2025",
    legendLabel: "Unique customers",
    value: "958",
    unit: "users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#7856ff]"
  },
  {
    id: 3,
    title: "Retained customers",
    subtitle: "5 July, 2025",
    legendLabel: "Retained customers",
    value: "300",
    unit: "users",
    trend: "up",
    trendValue: "11.49%",
    bgColor: "bg-[#7856ff]"
  },
  {
    id: 4,
    title: "Inactive customers",
    subtitle: "5 July, 2025",
    legendLabel: "Retained customers",
    value: "1,200",
    unit: "users",
    trend: "down",
    trendValue: "11.49%",
    bgColor: "bg-[#7856ff]"
  }
];

export function AnalyticsCards({ data, onAskReason, loading = false }: { data?: typeof analyticsData; onAskReason?: (cardType: string, cardData: any) => void; loading?: boolean }) {
  const displayData = data && data.length > 0 ? data : analyticsData;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0 w-full max-w-full">
      {displayData.map((card) => {
        const isPositiveTrend = card.trend === "up";
        const trendBgColor = isPositiveTrend ? "bg-[rgba(23,198,83,0.1)]" : "bg-[rgba(227,79,47,0.1)]";
        const trendTextColor = isPositiveTrend ? "text-[#17c653]" : "text-[#e34f2f]";

        return (
          <div
            key={card.id}
            className="min-w-0 max-w-full bg-white border border-[#e9e9e9] rounded-lg p-px overflow-hidden"
          >
            {/* Header */}
            <div className="min-h-16 border-b border-[#e9e9e9] px-4 py-2">
              <div className="flex gap-2 items-start">
                <div className="w-[21px] h-[21px] flex items-center justify-center flex-shrink-0">
                  <UserIcon />
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
            <div className="h-[263.8px] min-h-[250px] flex flex-col items-center justify-center gap-4 p-4">
              <div className="w-full flex flex-col items-center">
                {/* Legend */}
                <div className="h-6 w-full flex items-center justify-center rounded-[3px] mb-1">
                  <div className="flex items-center gap-[5px] max-w-full overflow-hidden">
                    <div className={`w-2.5 h-2.5 rounded-sm ${card.bgColor} flex-shrink-0`}></div>
                    <div className="text-[11.0625px] font-medium text-[#626266] leading-[12px] truncate">
                      {card.legendLabel}
                    </div>
                  </div>
                </div>

                {/* Main Value */}
                <div className="w-full max-w-[163px] flex flex-col items-center">
                  <div className="w-full px-0 py-1 flex items-center justify-center">
                    <div className="w-full flex flex-col items-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[63.2812px] font-bold text-[#2a2a2f] leading-tight sm:leading-[72px] tracking-[-2.88px] break-words">
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
              </div>

              {/* Trend Indicator */}
              <div className={`px-2 py-0.5 rounded-[3px] flex items-start gap-0 ${trendBgColor}`}>
                <div className="w-4 h-3.5 flex items-center justify-center flex-shrink-0">
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {isPositiveTrend ? (
                      <div className="rotate-180">
                        <TrendDownIcon />
                      </div>
                    ) : (
                      <div className="scale-y-[-1]">
                        <TrendUpIcon />
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

              {/* Ask Reason Button */}
              <button
                onClick={() => onAskReason?.(card.title, card)}
                className="mt-2 px-3 py-1.5 bg-[#7856ff] hover:bg-[#6a4de8] text-white text-xs font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Get Analysis
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
