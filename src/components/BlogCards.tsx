"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Blog Icons - Removed as icons are no longer displayed

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const blogs = [
  {
    id: 1,
    title: "The Complete Guide to Preventive Dentistry",
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    background: "/care.jpg",
    type: "dental-care",
    description: "Learn evidence-based preventive strategies that reduce treatment costs and improve patient outcomes",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Digital Impressions vs Traditional Methods",
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
    background: "/dental-technology.png",
    type: "oral-health",
    description: "Comparing accuracy, efficiency, and patient comfort in modern dental impression techniques",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "AI-Powered Treatment Planning",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    background: "/digital.webp",
    type: "technology",
    description: "How artificial intelligence is revolutionizing treatment planning and diagnosis in dentistry",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Patient Retention Strategies That Work",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    background: "/Customer-Retention.png",
    type: "business",
    description: "Proven methods to increase patient loyalty and reduce churn in your dental practice",
    readTime: "7 min read"
  }
];

const news = [
  {
    id: 5,
    title: "FDA Approves New Minimally Invasive Gum Disease Treatment",
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    background: "/oral.png",
    type: "oral-health",
    description: "Breakthrough treatment shows 95% success rate in early-stage periodontal disease",
    readTime: "4 min read"
  },
  {
    id: 6,
    title: "Study Links Oral Health to Cardiovascular Disease Risk",
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
    background: "/care.jpg",
    type: "oral-health",
    description: "New research reveals strong connection between gum health and heart disease prevention",
    readTime: "5 min read"
  },
  {
    id: 7,
    title: "3D Printing Revolutionizes Custom Dental Implants",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    background: "/dental-technology.png",
    type: "technology",
    description: "Latest 3D printing technology enables same-day custom implant fabrication",
    readTime: "6 min read"
  },
  {
    id: 8,
    title: "Dental Practice Revenue Up 12% Post-Pandemic",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    background: "/revenue-optimization.jpg",
    type: "business",
    description: "Industry report shows strong recovery and growth trends in dental practice profitability",
    readTime: "3 min read"
  }
];

interface BlogCardsProps {
  contentType?: 'blogs' | 'news';
}

export function BlogCards({ contentType = 'blogs' }: BlogCardsProps) {
  const router = useRouter();
  const [loadingCardId, setLoadingCardId] = useState<number | null>(null);

  const contentData = contentType === 'news' ? news : blogs;

  const handleBlogClick = async (blog: typeof blogs[0]) => {
    setLoadingCardId(blog.id);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to specific blog pages
    const blogRoutes: { [key: string]: string } = {
      'dental-care': '/blogs/dental-care-tips',
      'oral-health': '/blogs/oral-health-news',
      'technology': '/blogs/dental-technology',
      'business': '/blogs/practice-management'
    };
    
    router.push(blogRoutes[blog.type] || '/blogs');
    
    setLoadingCardId(null);
  };

  return (
    <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0 w-full max-w-full overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide sm:scrollbar-default">
      {contentData.map((blog) => {
        const isLoading = loadingCardId === blog.id;

        return (
          <div
            key={blog.id}
            className="relative min-w-[280px] sm:min-w-0 max-w-full bg-white border border-[#e9e9e9] rounded hover:shadow-lg transition-all duration-300 ease-out cursor-pointer group overflow-hidden flex-shrink-0 sm:flex-shrink"
            onClick={() => !isLoading && handleBlogClick(blog)}
          >
            {/* Loading Overlay */}
            {isLoading && <LoadingSpinner />}

            {/* Header with gradient background */}
            <div className={`h-16 ${blog.bgColor} rounded-t relative overflow-hidden transition-transform duration-300`} style={{backgroundImage: `url(${blog.background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300 group-hover:opacity-20"></div>

            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {blog.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {blog.readTime}
                </span>
                <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  <span>Read more</span>
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
