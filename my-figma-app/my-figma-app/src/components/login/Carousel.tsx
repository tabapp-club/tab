'use client';

import React, { useState, useEffect } from 'react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
  bgColor: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Track Performance",
    description: "Monitor your business metrics in real-time with comprehensive analytics",
    // bgColor: "from-orange-200 via-red-200 to-orange-300",
    bgColor: "bg-[#f5f4ed]",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-2xl">
          <div className="text-4xl lg:text-5xl xl:text-6xl">🎯</div>
        </div>
        <div className="absolute top-8 right-12 lg:top-12 lg:right-16 w-12 h-12 lg:w-16 lg:h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg lg:text-2xl">⭐</span>
        </div>
        <div className="absolute bottom-16 left-8 lg:bottom-20 lg:left-12 w-10 h-10 lg:w-12 lg:h-12 bg-green-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-base lg:text-xl">📊</span>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Grow Revenue",
    description: "Increase your business revenue with data-driven insights and strategies",
    // bgColor: "from-blue-200 via-purple-200 to-pink-200",
    bgColor: "bg-[#f5f4ed]",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-2xl">
          <div className="text-4xl lg:text-5xl xl:text-6xl">💳</div>
        </div>
        <div className="absolute top-12 left-16 lg:top-16 lg:left-20 w-16 h-16 lg:w-20 lg:h-20 bg-orange-300 rounded-lg flex items-center justify-center shadow-lg rotate-12">
          <span className="text-2xl lg:text-3xl">💰</span>
        </div>
        <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-16 w-12 h-12 lg:w-14 lg:h-14 bg-pink-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg lg:text-2xl">📈</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Customer Insights",
    description: "Understand your customers better with advanced segmentation and analysis",
    // bgColor: "from-green-200 via-teal-200 to-blue-200",
    bgColor: "bg-[#f5f4ed]",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-2xl">
          <div className="text-4xl lg:text-5xl xl:text-6xl">👥</div>
        </div>
        <div className="absolute top-8 right-16 lg:top-10 lg:right-20 w-12 h-12 lg:w-16 lg:h-16 bg-blue-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg lg:text-2xl">🔍</span>
        </div>
        <div className="absolute bottom-10 left-12 lg:bottom-12 lg:left-16 w-16 h-16 lg:w-18 lg:h-18 bg-yellow-300 rounded-lg flex items-center justify-center shadow-lg -rotate-12">
          <span className="text-2xl lg:text-3xl">💡</span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Smart Campaigns",
    description: "Create and manage targeted campaigns that drive engagement and conversions",
    // bgColor: "from-purple-200 via-pink-200 to-red-200",
    bgColor: "bg-[#f5f4ed]",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-2xl">
          <div className="text-4xl lg:text-5xl xl:text-6xl">🚀</div>
        </div>
        <div className="absolute top-10 left-12 lg:top-14 lg:left-16 w-12 h-12 lg:w-16 lg:h-16 bg-orange-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg lg:text-2xl">✨</span>
        </div>
        <div className="absolute bottom-14 right-10 lg:bottom-18 lg:right-12 w-12 h-12 lg:w-14 lg:h-14 bg-green-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg lg:text-2xl">🎨</span>
        </div>
      </div>
    )
  }
];

interface CarouselProps {
  autoPlayInterval?: number;
}

export function Carousel({ autoPlayInterval = 4000 }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgColor} transition-all duration-1000 ease-in-out`} />

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 lg:px-8 text-center">
        {/* Illustration */}
        <div className="mb-6 lg:mb-8 transition-all duration-700 ease-in-out transform">
          {currentSlideData.illustration}
        </div>

        {/* Text Content */}
        <div className="max-w-xs lg:max-w-md space-y-3 lg:space-y-4">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-[#2a2a2f] transition-all duration-500">
            {currentSlideData.title}
          </h2>
          <p className="text-sm lg:text-base xl:text-lg text-[#626266] font-medium leading-relaxed transition-all duration-500">
            {currentSlideData.description}
          </p>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#2a2a2f] w-4 lg:w-6'
                : 'bg-[#2a2a2f]/30 hover:bg-[#2a2a2f]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause indicator (subtle) */}
      <div className="absolute top-4 right-4 opacity-30 hover:opacity-60 transition-opacity">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    </div>
  );
}
