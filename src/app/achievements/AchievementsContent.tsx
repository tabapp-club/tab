"use client";

import React, { useState, useEffect } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import Button from "@/components/ui/Button";
import { useAchievementsData } from "@/hooks/useAchievementsData";
import { CreateTargetModal } from "@/components/CreateTargetModal";



export function AchievementsContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [openKebabMenu, setOpenKebabMenu] = useState<string | null>(null);
  
  const { milestones, aiTargets, aiMetrics, loading, createMilestone } = useAchievementsData();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
      if (!target.closest('.kebab-menu')) {
        setOpenKebabMenu(null);
      }
    };

    if (isStatusDropdownOpen || openKebabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen, openKebabMenu]);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Filter milestones based on selected filters
  const filteredMilestones = milestones.filter(milestone => {
    const categoryMatch = selectedCategory === 'all' || milestone.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || milestone.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      {/* Main Content */}
        <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden bg-white">
        <div className="pt-12 lg:pt-0 space-y-8">
          
                                {/* 1. Top Section - Cover Page with Summary */}
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-slate-100 mb-20">
                         <div className="flex flex-col items-center gap-8">
               <div className="flex-1 text-center">
                                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                   Achievements & Milestones
              </h1>
                                   <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                    Track your progress, celebrate successes, and discover AI-powered insights to accelerate your business growth
                  </p>
                                  <div className="flex flex-wrap gap-4 justify-center">
                   <div className="bg-white rounded-lg px-4 py-3 border border-purple-200">
                     <div className="text-2xl font-bold text-purple-600">
                       {loading ? '...' : milestones.length}
                     </div>
                     <div className="text-sm text-gray-600">Active Targets</div>
                   </div>
                   <div className="bg-white rounded-lg px-4 py-3 border border-purple-200">
                     <div className="text-2xl font-bold text-green-600">
                       {loading ? '...' : milestones.length > 0 ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length) : 0}%
                     </div>
                     <div className="text-sm text-gray-600">Avg Progress</div>
                   </div>
                   <div className="bg-white rounded-lg px-4 py-3 border border-purple-200">
                     <div className="text-2xl font-bold text-blue-600">
                       {loading ? '...' : aiTargets.length}
                     </div>
                     <div className="text-sm text-gray-600">AI Suggestions</div>
                   </div>
                 </div>
              </div>
              
            </div>
            </div>

                      {/* 2. Filters Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-20">
            <div className="space-y-4 w-full lg:w-auto">
              {/* Category Filters */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Categories', icon: '📊', color: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200' },
                    { value: 'sales', label: 'Sales', icon: '💰', color: 'bg-white text-green-700 hover:bg-green-50 border border-green-200' },
                    { value: 'customers', label: 'Customers', icon: '👥', color: 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200' },
                    { value: 'engagement', label: 'Engagement', icon: '📈', color: 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200' },
                    { value: 'retention', label: 'Retention', icon: '🔄', color: 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200' }
                  ].map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedCategory === category.value
                          ? category.color.replace('hover:', '') + ' ring-2 ring-offset-2 ring-purple-500'
                          : category.color
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
                            {/* Status Filter Dropdown */}
              <div className="relative status-dropdown">
            <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`bg-white h-10 px-3 py-2 border border-[#e9e9e9] rounded-md flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors relative w-28 sm:w-32 ${
                    selectedStatus !== 'all'
                      ? 'border-[#7856ff] bg-[#7856ff]/5'
                      : 'border-[#e9e9e9]'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
                      {selectedStatus === 'all' ? 'All Status' : 
                       selectedStatus === 'active' ? '🟢 Active' :
                       selectedStatus === 'completed' ? '✅ Completed' :
                       selectedStatus === 'overdue' ? '⚠️ Overdue' : 'All Status'}
                    </span>
                    {selectedStatus !== 'all' && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#7856ff] rounded-full flex-shrink-0">
                        1
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
                    <svg 
                      width="7.5" 
                      height="4.518" 
                      viewBox="0 0 7.5 4.518" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Dropdown Panel */}
                {isStatusDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-[#e9e9e9] rounded-md z-50 w-full min-w-[180px] shadow-lg">
                    {/* Header */}
                    <div className="px-4 py-2 bg-white border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-[#626266]">Filter by Status</span>
                        <button 
                          className="text-[12px] text-[#626266] hover:text-[#7856ff]"
                          onClick={() => {
                            setSelectedStatus('all');
                            setIsStatusDropdownOpen(false);
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="py-2">
                      {[
                        { value: 'all', label: 'All Status', icon: '📋' },
                        { value: 'active', label: 'Active', icon: '🟢' },
                        { value: 'completed', label: 'Completed', icon: '✅' },
                        { value: 'overdue', label: 'Overdue', icon: '⚠️' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedStatus(option.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-left ${
                            selectedStatus === option.value ? 'bg-[#7856ff]/5' : ''
                          }`}
                        >
                          <div className="w-[18px] h-[18px] flex items-center justify-center">
                            {selectedStatus === option.value && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8L7 12L13 4" stroke="#7856ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14px] text-[#2a2a2f] tracking-[0.15px]">
                            {option.icon} {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowCreateTarget(true)}
                variant="primary"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Create New Target
              </Button>
            </div>
          </div>

          {/* 3. Active Milestone Cards - Grid View */}
          <div className="space-y-6 mb-20">
                         <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-gray-900">Active Milestones</h2>
               <span className="text-sm text-gray-500">
                 {loading ? 'Loading...' : `${filteredMilestones.length} targets`}
               </span>
             </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {loading ? (
                 // Loading skeleton
                 Array.from({ length: 3 }).map((_, index) => (
                   <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                     <div className="flex items-start justify-between mb-4">
                       <div className="w-8 h-8 bg-gray-200 rounded"></div>
                       <div className="w-16 h-6 bg-gray-200 rounded"></div>
                     </div>
                     <div className="space-y-3">
                       <div className="h-6 bg-gray-200 rounded"></div>
                       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                       <div className="h-2 bg-gray-200 rounded-full"></div>
                       <div className="flex justify-between">
                         <div className="h-8 bg-gray-200 rounded w-16"></div>
                         <div className="h-8 bg-gray-200 rounded w-16"></div>
                       </div>
                     </div>
                   </div>
                 ))
               ) : (
                 filteredMilestones.map((milestone) => (
                                                  <div key={milestone.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:bg-gray-50 transition-colors relative">
                   {/* Kebab Menu */}
                   <div className="absolute top-4 right-4 kebab-menu">
                                           <button
                        onClick={() => setOpenKebabMenu(openKebabMenu === milestone.id ? null : milestone.id)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.00049 12.6377C9.70434 12.6379 10.2747 13.2083 10.2749 13.9121C10.2749 14.6161 9.70447 15.1873 9.00049 15.1875C8.29633 15.1875 7.7251 14.6163 7.7251 13.9121C7.72531 13.2081 8.29646 12.6377 9.00049 12.6377ZM9.00049 7.72461C9.70447 7.72482 10.2749 8.29597 10.2749 9C10.2747 9.7039 9.70437 10.2742 9.00049 10.2744C8.29642 10.2744 7.72526 9.70403 7.7251 9C7.7251 8.29584 8.29633 7.72461 9.00049 7.72461ZM9.00049 2.8125C9.70447 2.81271 10.2749 3.38386 10.2749 4.08789C10.2747 4.79174 9.70434 5.36209 9.00049 5.3623C8.29646 5.3623 7.72531 4.79187 7.7251 4.08789C7.7251 3.38373 8.29633 2.8125 9.00049 2.8125Z" fill="#A1A1A1"/>
              </svg>
            </button>

                     {/* Dropdown Menu */}
                     {openKebabMenu === milestone.id && (
                       <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px]">
                         <div className="py-1">
                           <button
                             onClick={() => {
                               // Edit milestone logic
                               setOpenKebabMenu(null);
                             }}
                             className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                           >
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M18.5 2.50023C18.8978 2.1025 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1025 21.5 2.50023C21.8978 2.89795 22.1214 3.43762 22.1214 4.00023C22.1214 4.56285 21.8978 5.10252 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                             Edit Target
                           </button>
                           <button
                             onClick={() => {
                               // Update progress logic
                               setOpenKebabMenu(null);
                             }}
                             className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                           >
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                             </svg>
                             Update Progress
                           </button>
                           <button
                             onClick={() => {
                               // Mark as completed logic
                               setOpenKebabMenu(null);
                             }}
                             className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                           >
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                             Mark Complete
                           </button>
                           <div className="border-t border-gray-100 my-1"></div>
                           <button
                             onClick={() => {
                               // Delete milestone logic
                               setOpenKebabMenu(null);
                             }}
                             className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                           >
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                             Delete Target
                           </button>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Icon, Title and Description Group */}
                   <div className="flex items-start gap-3 mb-4">
                     <div className="text-2xl flex-shrink-0">{milestone.icon}</div>
                     <div className="flex-1 min-w-0">
                       <h3 className="text-base font-bold text-gray-900 mb-1">{milestone.title}</h3>
                       <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                     </div>
                   </div>
                  
                                     {/* Progress Bar */}
                   <div className="mb-4">
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-gray-600">Progress</span>
                       <span className="font-semibold text-base">{milestone.progress}%</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-1">
                       <div 
                         className={`h-1 rounded-full transition-all duration-500 ${milestone.color}`}
                         style={{ width: `${milestone.progress}%` }}
                       ></div>
                     </div>
                   </div>

                                                        {/* Current vs Target */}
                   <div className="flex justify-between items-center mb-4">
                     <div className="text-center">
                       <div className="text-lg font-bold text-gray-900">
                         {milestone.unit === '₹' ? '₹' : ''}{milestone.current.toLocaleString()}
                         {milestone.unit === '%' ? '%' : ''}
                       </div>
                       <div className="text-xs text-gray-500">Current</div>
                     </div>
                     <div className="text-center">
                       <div className="text-lg font-bold text-gray-900">
                         {milestone.unit === '₹' ? '₹' : ''}{milestone.target.toLocaleString()}
                         {milestone.unit === '%' ? '%' : ''}
                       </div>
                       <div className="text-xs text-gray-500">Target</div>
                     </div>
                   </div>

                   {/* Date and Status Group */}
                   <div className="flex items-center justify-between">
                     <div className="text-xs text-gray-500">
                       Due: {new Date(milestone.deadline).toLocaleDateString()}
                     </div>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                       {milestone.status}
                     </span>
                   </div>
          </div>
               ))
             )}
        </div>
      </div>

                    {/* 4. AI Insights & Suggestions Container */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl border border-gray-200 p-8 mb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights</h2>
                <p className="text-gray-600">Intelligent suggestions and business analytics powered by AI</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Real-time AI Analysis
              </div>
            </div>

            {/* AI Suggested Targets Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Suggested Targets</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  // Loading skeleton for AI targets
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-20 h-6 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  aiTargets.map((target) => (
                    <div key={target.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">🤖</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(target.impact)}`}>
                          {target.impact} impact
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{target.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{target.description}</p>
                      
                      {/* Target Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Target</span>
                          <span className="text-lg font-bold text-gray-900">
                            {target.unit === '₹' ? '₹' : ''}{target.target}
                            {target.unit === '%' ? '%' : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Confidence</span>
                          <span className="text-sm font-bold text-purple-600">{target.confidence}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Timeframe</span>
                          <span className="text-sm text-gray-600">{target.timeframe}</span>
                        </div>
                      </div>

                      {/* Rationale */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Rationale</h4>
                        <p className="text-xs text-gray-600">{target.rationale}</p>
                      </div>

                      {/* Data Points */}
                      <div className="space-y-1">
                        {target.dataPoints.map((point, index) => (
                          <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            {point}
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        Create Target
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-8"></div>

            {/* AI Business Insights Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Business Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // Loading skeleton for AI metrics
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  aiMetrics.map((metric) => (
                    <div key={metric.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">📊</div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                          <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                            {metric.trendValue}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-4">{metric.value}</div>
                      
                      {/* Insight */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Insight</h4>
                        <p className="text-sm text-blue-800">{metric.insight}</p>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <h4 className="text-sm font-medium text-green-900 mb-2">🎯 Recommendation</h4>
                        <p className="text-sm text-green-800">{metric.recommendation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 6. Footer Cover with Quote */}
          <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-10 text-gray-800 relative overflow-hidden mb-20 border border-gray-200">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6 border border-purple-200">
                  <span className="text-3xl">🏆</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                  Celebrate Your Success
                </h2>
              </div>
              
              <div className="max-w-3xl mx-auto mb-10">
                <blockquote className="text-base italic text-gray-700 leading-relaxed mb-4">
                  "The only way to achieve the impossible is to believe it is possible. Every milestone reached is a testament to your dedication and the power of setting meaningful goals."
                </blockquote>
                <div className="text-sm text-gray-600">— Charles Kingsleigh</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2 text-gray-800">24</div>
                  <div className="text-sm text-gray-600 mb-1">Targets Completed</div>
                  <div className="text-xs text-gray-500">This quarter</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2 text-gray-800">92%</div>
                  <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                  <div className="text-xs text-gray-500">Above industry avg</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2 text-gray-800">₹4.2M</div>
                  <div className="text-sm text-gray-600 mb-1">Revenue Impact</div>
                  <div className="text-xs text-gray-500">From achievements</div>
                </div>
              </div>
              

              
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

       {/* Create Target Modal */}
       <CreateTargetModal
         isOpen={showCreateTarget}
         onClose={() => setShowCreateTarget(false)}
         onCreateTarget={createMilestone}
       />
    </main>
  );
}
