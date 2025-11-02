"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Growth Tips Icons - Removed as icons are no longer displayed

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const growthTips = [
  {
    id: 1,
    title: "Patient Experience",
    bgColor: "bg-gradient-to-br from-pink-500 to-pink-700",
    background: "/oral.png",
    type: "patient-experience",
    description: "Create exceptional patient experiences",
    readTime: "5 min read",
    tips: ["Comfort amenities", "Clear communication", "Follow-up care"]
  },
  {
    id: 2,
    title: "Customer Retention",
    bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    background: "/Customer-Retention.png",
    type: "customer-retention",
    description: "Build lasting relationships with patients",
    readTime: "6 min read",
    tips: ["Implement loyalty programs", "Send appointment reminders", "Follow up after treatments"]
  },
  {
    id: 3,
    title: "Revenue Optimization",
    bgColor: "bg-gradient-to-br from-amber-400 to-amber-600",
    background: "/revenue-optimization.jpg",
    type: "revenue-optimization",
    description: "Maximize your practice's earning potential",
    readTime: "7 min read",
    tips: ["Offer premium services", "Implement payment plans", "Optimize appointment scheduling"]
  },
  {
    id: 4,
    title: "Operational Efficiency",
    bgColor: "bg-gradient-to-br from-rose-500 to-rose-700",
    background: "/Operational.webp",
    type: "operational-efficiency",
    description: "Streamline your practice operations",
    readTime: "5 min read",
    tips: ["Automate appointment scheduling", "Use practice management software", "Optimize staff workflows"]
  },
  {
    id: 5,
    title: "Staff Training",
    bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    background: "/care.jpg",
    type: "staff-training",
    description: "Develop your team for better patient care",
    readTime: "6 min read",
    tips: ["Cross-training programs", "Customer service excellence", "Technical skill development"]
  },
  {
    id: 6,
    title: "Technology Integration",
    bgColor: "bg-gradient-to-br from-violet-500 to-violet-700",
    background: "/dental-technology.png",
    type: "technology-integration",
    description: "Leverage modern dental technology",
    readTime: "9 min read",
    tips: ["Digital imaging systems", "CAD/CAM technology", "Practice management software"]
  },
  {
    id: 7,
    title: "Financial Management",
    bgColor: "bg-gradient-to-br from-teal-400 to-teal-600",
    background: "/practice.png",
    type: "financial-management",
    description: "Optimize your practice's financial health",
    readTime: "7 min read",
    tips: ["Budget planning", "Cash flow management", "Investment strategies"]
  },
  {
    id: 8,
    title: "Digital Marketing",
    bgColor: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    background: "/digital-marketing.webp",
    type: "digital-marketing",
    description: "Social media strategies and online presence tips",
    readTime: "8 min read",
    tips: ["Create engaging social media content", "Use Google My Business effectively", "Implement email marketing campaigns"]
  }
];

export function BusinessGrowthCards() {
  const router = useRouter();
  const [loadingCardId, setLoadingCardId] = useState<number | null>(null);

  const handleGrowthTipClick = async (tip: typeof growthTips[0]) => {
    setLoadingCardId(tip.id);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to growth tip content
    router.push(`/business-growth/${tip.type}`);
    
    setLoadingCardId(null);
  };

  return (
    <div className="flex gap-3 sm:gap-4 min-w-0 w-full max-w-full business-growth-scroll pb-2">
      {growthTips.map((tip) => {
        const isLoading = loadingCardId === tip.id;

        return (
          <div
            key={tip.id}
            className="relative min-w-[280px] sm:min-w-[300px] max-w-full bg-white border border-[#e9e9e9] rounded transition-all duration-300 ease-out cursor-pointer group overflow-hidden flex-shrink-0 flex-grow-0"
            onClick={() => !isLoading && handleGrowthTipClick(tip)}
          >
            {/* Loading Overlay */}
            {isLoading && <LoadingSpinner />}

            {/* Header with gradient background */}
            <div className={`h-16 ${tip.bgColor} rounded-t relative overflow-hidden transition-transform duration-300`} style={{backgroundImage: `url(${tip.background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300 group-hover:opacity-20"></div>

            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {tip.title}
              </h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {tip.description}
              </p>
              
              {/* Quick Tips Preview */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Quick Tips:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {tip.tips.slice(0, 2).map((quickTip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-1">•</span>
                      <span className="line-clamp-1">{quickTip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {tip.readTime}
                </span>
                <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
