"use client";

import React, { useState } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";

// Icons for the service cards
const UpsellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
    <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="currentColor"/>
    <path d="M5 15L5.5 17.5L8 18L5.5 18.5L5 21L4.5 18.5L2 18L4.5 17.5L5 15Z" fill="currentColor"/>
  </svg>
);

const CrossSellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H21V21H3V3ZM5 5V19H19V5H5Z" fill="currentColor"/>
    <path d="M7 7H17V9H7V7Z" fill="currentColor"/>
    <path d="M7 11H17V13H7V11Z" fill="currentColor"/>
    <path d="M7 15H13V17H7V15Z" fill="currentColor"/>
  </svg>
);

const ElectronicsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z" fill="currentColor"/>
    <path d="M4 6H16V8H4V6Z" fill="white"/>
    <path d="M4 10H16V12H4V10Z" fill="white"/>
    <path d="M4 14H12V16H4V14Z" fill="white"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L12.5 7.5H18L14 11L16.5 16.5L10 12.5L3.5 16.5L6 11L2 7.5H7.5L10 2Z" fill="currentColor"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6C15 7.65685 13.6569 9 12 9C10.3431 9 9 7.65685 9 6Z" fill="currentColor"/>
    <path d="M3 18C3 15.2386 5.23858 13 8 13H16C18.7614 13 21 15.2386 21 18V20H3V18Z" fill="currentColor"/>
  </svg>
);

export function UpsellCrossSellContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<'upsell' | 'cross-sell' | null>(null);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleServiceSelect = (service: 'upsell' | 'cross-sell') => {
    setSelectedService(service);
  };

  const handleGetStarted = () => {
    if (selectedService === 'upsell') {
      // Navigate to upsell campaign creation
      console.log('Starting upsell campaign...');
    } else if (selectedService === 'cross-sell') {
      // Navigate to cross-sell campaign creation
      console.log('Starting cross-sell campaign...');
    }
  };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileMenuToggle />
      </header>

      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6]">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-[#2a2a2f] text-[24px] font-bold tracking-[-0.1px] leading-[1.2] mb-2">
            Upsell & Cross Sell
          </h1>
          <p className="text-[#a1a1a1] text-[14px] leading-relaxed max-w-3xl">
            Maximize your revenue by selling additional products and services to your customers. 
            Choose between targeted upsell campaigns for your existing audience or broader cross-sell campaigns for maximum reach.
          </p>
        </div>

        {/* Service Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upsell Card */}
          <div
            className={`relative bg-white border rounded p-6 cursor-pointer transition-all duration-300 group ${
              selectedService === 'upsell'
                ? 'border-[#6E4EFF] bg-gradient-to-br from-[#6E4EFF]/5 to-[#8B6AFF]/5'
                : 'border-[#e9e9e9] hover:border-[#6E4EFF]/50 hover:bg-gradient-to-br hover:from-[#6E4EFF]/2 hover:to-[#8B6AFF]/2'
            }`}
            onClick={() => handleServiceSelect('upsell')}
          >
            {/* Selection Indicator */}
            {selectedService === 'upsell' && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#6E4EFF] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-14 h-14 rounded flex items-center justify-center transition-colors ${
                selectedService === 'upsell' 
                  ? 'bg-[#6E4EFF] text-white' 
                  : 'bg-[#6E4EFF]/10 text-[#6E4EFF] group-hover:bg-[#6E4EFF] group-hover:text-white'
              }`}>
                <UpsellIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-[20px] font-bold text-[#2a2a2f] mb-2">Upsell</h3>
                <p className="text-[#626266] text-[14px] leading-relaxed">
                  Sell premium products and services to your existing customers
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-[#2a2a2f] text-[14px] leading-relaxed mb-4">
                Target your existing customer base with higher-value products, premium services, 
                or upgraded versions of what they already own. Perfect for increasing average order value.
              </p>
              
              {/* Electronics Example */}
              <div className="bg-white border border-[#e9e9e9] rounded p-3">
                <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">iPhone 15 Pro → Premium Accessories</h4>
                <p className="text-[12px] text-[#626266] leading-relaxed">
                  Customer purchased iPhone 15 Pro (₹1,29,900)? Offer AirPods Pro 2 (₹24,900), 
                  MagSafe Charger (₹4,500), and AppleCare+ (₹3,500) with 15% bundle discount.
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#6E4EFF]">35%</div>
                <div className="text-[10px] text-[#626266] font-medium">Avg. Conversion</div>
              </div>
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#04b440]">2.4x</div>
                <div className="text-[10px] text-[#626266] font-medium">Revenue Boost</div>
              </div>
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#ff6b35]">78%</div>
                <div className="text-[10px] text-[#626266] font-medium">Customer Satisfaction</div>
              </div>
            </div>

            {/* Action Button */}
            <div className={`w-full py-3 px-4 rounded text-center text-[14px] font-semibold transition-colors ${
              selectedService === 'upsell'
                ? 'bg-[#6E4EFF] text-white'
                : 'bg-gray-100 text-[#626266] group-hover:bg-[#6E4EFF] group-hover:text-white'
            }`}>
              {selectedService === 'upsell' ? 'Selected - Ready to Start' : 'Select Upsell Service'}
            </div>
          </div>

          {/* Cross-Sell Card */}
          <div
            className={`relative bg-white border rounded p-6 cursor-pointer transition-all duration-300 group ${
              selectedService === 'cross-sell'
                ? 'border-[#10b981] bg-gradient-to-br from-[#10b981]/5 to-[#34d399]/5'
                : 'border-[#e9e9e9] hover:border-[#10b981]/50 hover:bg-gradient-to-br hover:from-[#10b981]/2 hover:to-[#34d399]/2'
            }`}
            onClick={() => handleServiceSelect('cross-sell')}
          >
            {/* Selection Indicator */}
            {selectedService === 'cross-sell' && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-14 h-14 rounded flex items-center justify-center transition-colors ${
                selectedService === 'cross-sell' 
                  ? 'bg-[#10b981] text-white' 
                  : 'bg-[#10b981]/10 text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white'
              }`}>
                <CrossSellIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-[20px] font-bold text-[#2a2a2f] mb-2">Cross-Sell</h3>
                <p className="text-[#626266] text-[14px] leading-relaxed">
                  Reach broader audience with complementary products and services
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-[#2a2a2f] text-[14px] leading-relaxed mb-4">
                Expand your market reach by promoting complementary products to a wider audience. 
                Perfect for introducing new product lines and increasing brand awareness.
              </p>
              
              {/* Electronics Example */}
              <div className="bg-white border border-[#e9e9e9] rounded p-3">
                <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">Samsung Galaxy → Smart Home Bundle</h4>
                <p className="text-[12px] text-[#626266] leading-relaxed">
                  Target Samsung Galaxy users with SmartThings Hub (₹8,999), Smart Bulbs (₹2,499), 
                  and Smart Door Lock (₹15,999) - 20% off for first-time smart home buyers.
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#10b981]">28%</div>
                <div className="text-[10px] text-[#626266] font-medium">Avg. Conversion</div>
              </div>
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#04b440]">1.8x</div>
                <div className="text-[10px] text-[#626266] font-medium">Revenue Boost</div>
              </div>
              <div className="text-center p-2 bg-white border border-[#e9e9e9] rounded">
                <div className="text-[16px] font-bold text-[#ff6b35]">85%</div>
                <div className="text-[10px] text-[#626266] font-medium">Brand Awareness</div>
              </div>
            </div>

            {/* Action Button */}
            <div className={`w-full py-3 px-4 rounded text-center text-[14px] font-semibold transition-colors ${
              selectedService === 'cross-sell'
                ? 'bg-[#10b981] text-white'
                : 'bg-gray-100 text-[#626266] group-hover:bg-[#10b981] group-hover:text-white'
            }`}>
              {selectedService === 'cross-sell' ? 'Selected - Ready to Start' : 'Select Cross-Sell Service'}
            </div>
          </div>
        </div>

        {/* Business Context Section */}
        <div className="bg-white border border-[#e9e9e9] rounded p-6 mb-6">
          <div className="mb-5">
            <h3 className="text-[18px] font-bold text-[#2a2a2f] mb-2">Why Choose Upsell & Cross-Sell?</h3>
            <p className="text-[#626266] text-[14px] leading-relaxed">
              Strategic product recommendations can significantly boost your revenue and customer lifetime value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white border border-[#e9e9e9] rounded">
              <div className="w-10 h-10 bg-[#6E4EFF]/10 rounded flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-[#6E4EFF]" />
              </div>
              <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">Revenue Growth</h4>
              <p className="text-[11px] text-[#626266] leading-relaxed">
                Increase average order value by 40-60% with strategic product recommendations
              </p>
            </div>

            <div className="text-center p-3 bg-white border border-[#e9e9e9] rounded">
              <div className="w-10 h-10 bg-[#10b981]/10 rounded flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-[#10b981]" />
              </div>
              <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">Customer Retention</h4>
              <p className="text-[11px] text-[#626266] leading-relaxed">
                Build stronger relationships through personalized product suggestions
              </p>
            </div>

            <div className="text-center p-3 bg-white border border-[#e9e9e9] rounded">
              <div className="w-10 h-10 bg-[#ff6b35]/10 rounded flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-[#ff6b35]" />
              </div>
              <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">Market Expansion</h4>
              <p className="text-[11px] text-[#626266] leading-relaxed">
                From MacBook → Gaming Setup: Introduce gaming chairs (₹25,000), mechanical keyboards (₹8,500), and monitors (₹35,000)
              </p>
            </div>

            <div className="text-center p-3 bg-white border border-[#e9e9e9] rounded">
              <div className="w-10 h-10 bg-[#9c27b0]/10 rounded flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-5 h-5 text-[#9c27b0]" />
              </div>
              <h4 className="text-[13px] font-semibold text-[#2a2a2f] mb-2">Data-Driven</h4>
              <p className="text-[11px] text-[#626266] leading-relaxed">
                AI-powered recommendations based on customer behavior and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        {selectedService && (
          <div className="bg-gradient-to-r from-[#6E4EFF]/5 to-[#8B6AFF]/5 border border-[#6E4EFF]/20 rounded p-6">
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-[#2a2a2f] mb-2">
                Ready to Start Your {selectedService === 'upsell' ? 'Upsell' : 'Cross-Sell'} Campaign?
              </h3>
              <p className="text-[#626266] text-[13px] mb-5 max-w-2xl mx-auto">
                {selectedService === 'upsell' 
                  ? 'Create targeted campaigns to sell premium products to your existing customers and maximize their lifetime value.'
                  : 'Launch broad-reaching campaigns to introduce complementary products to new audiences and expand your market reach.'
                }
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-[#6E4EFF] hover:bg-[#5a3fd8] text-white font-semibold py-2.5 px-6 rounded transition-colors duration-200 text-[14px]"
              >
                Get Started with {selectedService === 'upsell' ? 'Upsell' : 'Cross-Sell'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
