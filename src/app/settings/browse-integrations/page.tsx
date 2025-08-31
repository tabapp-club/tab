"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  status: 'available' | 'connected' | 'coming_soon';
  features: string[];
  rating: number;
  users: number;
  setupTime: string;
  pricing: string;
}

export default function BrowseIntegrationsPage() {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Kebab menu state
  const [openKebabMenu, setOpenKebabMenu] = useState<string | null>(null);
  
  // Integrations state (simulating connected integrations)
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set(['square', 'shopify']));

  // Sample integrations data
  const integrations: Integration[] = [
    // POS Systems
    {
      id: 'square',
      name: 'Square POS',
      description: 'Point of sale & payment processing for businesses of all sizes',
      category: 'pos',
      icon: '💳',
      color: 'green',
      status: 'connected',
      features: ['Payment Processing', 'Inventory Management', 'Analytics', 'Customer Management'],
      rating: 4.8,
      users: 2500000,
      setupTime: '5 minutes',
      pricing: 'Free + 2.6% per transaction'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Complete e-commerce platform for online and offline sales',
      category: 'pos',
      icon: '🛒',
      color: 'purple',
      status: 'connected',
      features: ['Online Store', 'POS System', 'Payment Gateway', 'Inventory Sync'],
      rating: 4.7,
      users: 1800000,
      setupTime: '15 minutes',
      pricing: '$29/month + transaction fees'
    },
    {
      id: 'clover',
      name: 'Clover POS',
      description: 'Flexible point of sale system for restaurants and retail',
      category: 'pos',
      icon: '🍽️',
      color: 'red',
      status: 'available',
      features: ['Restaurant Management', 'Order Management', 'Employee Management', 'Reporting'],
      rating: 4.5,
      users: 850000,
      setupTime: '10 minutes',
      pricing: '$14.95/month + hardware'
    },
    {
      id: 'toast',
      name: 'Toast POS',
      description: 'Restaurant management system with integrated payments',
      category: 'pos',
      icon: '🍕',
      color: 'indigo',
      status: 'available',
      features: ['Restaurant POS', 'Online Ordering', 'Kitchen Display', 'Analytics'],
      rating: 4.6,
      users: 620000,
      setupTime: '20 minutes',
      pricing: '$165/month + hardware'
    },
    {
      id: 'lightspeed',
      name: 'Lightspeed',
      description: 'Cloud-based POS for retail and restaurant businesses',
      category: 'pos',
      icon: '⚡',
      color: 'blue',
      status: 'coming_soon',
      features: ['Retail POS', 'Restaurant POS', 'E-commerce', 'Multi-location'],
      rating: 4.4,
      users: 450000,
      setupTime: '30 minutes',
      pricing: '$69/month + hardware'
    },

    // Payment Processing
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing platform for online businesses',
      category: 'payments',
      icon: '💳',
      color: 'orange',
      status: 'available',
      features: ['Online Payments', 'Subscription Billing', 'Marketplace Payments', 'International'],
      rating: 4.9,
      users: 3200000,
      setupTime: '5 minutes',
      pricing: '2.9% + 30¢ per transaction'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Global payment solution for businesses and consumers',
      category: 'payments',
      icon: '🔵',
      color: 'blue',
      status: 'available',
      features: ['Online Payments', 'Mobile Payments', 'International', 'Buyer Protection'],
      rating: 4.6,
      users: 4300000,
      setupTime: '10 minutes',
      pricing: '2.9% + 30¢ per transaction'
    },
    {
      id: 'square-payments',
      name: 'Square Payments',
      description: 'Payment processing integrated with Square POS',
      category: 'payments',
      icon: '💳',
      color: 'green',
      status: 'available',
      features: ['In-person Payments', 'Online Payments', 'Mobile Payments', 'Analytics'],
      rating: 4.7,
      users: 2500000,
      setupTime: '5 minutes',
      pricing: '2.6% + 10¢ per transaction'
    },

    // Accounting
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Accounting and financial management software',
      category: 'accounting',
      icon: '📊',
      color: 'blue',
      status: 'available',
      features: ['Bookkeeping', 'Invoicing', 'Expense Tracking', 'Tax Preparation'],
      rating: 4.5,
      users: 2900000,
      setupTime: '30 minutes',
      pricing: '$30/month'
    },
    {
      id: 'xero',
      name: 'Xero',
      description: 'Cloud-based accounting software for small businesses',
      category: 'accounting',
      icon: '📈',
      color: 'teal',
      status: 'coming_soon',
      features: ['Cloud Accounting', 'Bank Reconciliation', 'Invoicing', 'Multi-currency'],
      rating: 4.4,
      users: 3800000,
      setupTime: '45 minutes',
      pricing: '$25/month'
    },

    // Marketing
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation platform',
      category: 'marketing',
      icon: '📧',
      color: 'yellow',
      status: 'available',
      features: ['Email Marketing', 'Automation', 'Templates', 'Analytics'],
      rating: 4.3,
      users: 15000000,
      setupTime: '15 minutes',
      pricing: 'Free + $10/month for paid plans'
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo',
      description: 'E-commerce marketing automation platform',
      category: 'marketing',
      icon: '🚀',
      color: 'purple',
      status: 'coming_soon',
      features: ['Email Marketing', 'SMS Marketing', 'Segmentation', 'E-commerce Integration'],
      rating: 4.6,
      users: 200000,
      setupTime: '20 minutes',
      pricing: 'Free + $20/month for paid plans'
    },

    // Analytics
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Web analytics service to track and report website traffic',
      category: 'analytics',
      icon: '📊',
      color: 'blue',
      status: 'available',
      features: ['Website Analytics', 'Traffic Analysis', 'Conversion Tracking', 'Real-time Data'],
      rating: 4.7,
      users: 50000000,
      setupTime: '10 minutes',
      pricing: 'Free'
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      description: 'Product analytics for mobile and web applications',
      category: 'analytics',
      icon: '📈',
      color: 'green',
      status: 'coming_soon',
      features: ['Event Tracking', 'Funnel Analysis', 'A/B Testing', 'User Segmentation'],
      rating: 4.4,
      users: 35000,
      setupTime: '25 minutes',
      pricing: 'Free + $25/month for paid plans'
    }
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories', count: integrations.length },
    { id: 'pos', name: 'Point of Sale', count: integrations.filter(i => i.category === 'pos').length },
    { id: 'payments', name: 'Payment Processing', count: integrations.filter(i => i.category === 'payments').length },
    { id: 'accounting', name: 'Accounting', count: integrations.filter(i => i.category === 'accounting').length },
    { id: 'marketing', name: 'Marketing', count: integrations.filter(i => i.category === 'marketing').length },
    { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length }
  ];

  // Status options
  const statusOptions = [
    { id: 'all', name: 'All Status', count: integrations.length },
    { id: 'available', name: 'Available', count: integrations.filter(i => i.status === 'available').length },
    { id: 'connected', name: 'Connected', count: integrations.filter(i => i.status === 'connected').length },
    { id: 'coming_soon', name: 'Coming Soon', count: integrations.filter(i => i.status === 'coming_soon').length }
  ];

  // Filter integrations
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort integrations
  const sortedIntegrations = [...filteredIntegrations].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'users':
        return b.users - a.users;
      case 'setupTime':
        return parseInt(a.setupTime) - parseInt(b.setupTime);
      default:
        return 0;
    }
  });

  // Close kebab menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutside = !(event.target as Element).closest('.kebab-menu-container');
      if (isOutside) {
        setOpenKebabMenu(null);
      }
    }

    if (openKebabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openKebabMenu]);

  // Handle integration connection
  const handleConnect = (integrationId: string) => {
    setConnectedIntegrations(prev => new Set([...prev, integrationId]));
  };

  // Handle integration disconnection
  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.delete(integrationId);
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'coming_soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'available': return 'Available';
      case 'coming_soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <MobileMenuToggle />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Browse Integrations</h1>
              <p className="text-sm text-gray-600">Connect your business with powerful third-party services</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E4EFF]"
          >
            ← Back to Settings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Integrations
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-[#6E4EFF] focus:border-[#6E4EFF]"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#6E4EFF] focus:border-[#6E4EFF]"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#6E4EFF] focus:border-[#6E4EFF]"
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name} ({status.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-[#6E4EFF] focus:border-[#6E4EFF]"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="users">Users</option>
                <option value="setupTime">Setup Time</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredIntegrations.length} of {integrations.length} integrations
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIntegrations.map((integration) => (
            <div key={integration.id} className="bg-white border border-gray-200 rounded-lg hover:border-[#6E4EFF]/30 hover:shadow-lg transition-all duration-300">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${integration.color}-100 to-${integration.color}-200 rounded-lg flex items-center justify-center text-2xl`}>
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                    </div>
                  </div>
                  
                  {/* Kebab Menu */}
                  <div className="relative kebab-menu-container">
                    <button
                      onClick={() => setOpenKebabMenu(openKebabMenu === integration.id ? null : integration.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="More options"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                      </svg>
                    </button>
                    
                    {openKebabMenu === integration.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            View Documentation
                          </button>
                          {connectedIntegrations.has(integration.id) && (
                            <>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                Settings
                              </button>
                              <div className="border-t border-gray-100">
                                <button 
                                  onClick={() => {
                                    handleDisconnect(integration.id);
                                    setOpenKebabMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                  </svg>
                                  Disconnect
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {getStatusText(integration.status)}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>⭐ {integration.rating}</span>
                    <span>•</span>
                    <span>{integration.users.toLocaleString()}+ users</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Key Features</h4>
                <div className="space-y-2">
                  {integration.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                  {integration.features.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{integration.features.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Setup Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Setup Time:</span>
                      <div className="font-medium text-gray-900">{integration.setupTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pricing:</span>
                      <div className="font-medium text-gray-900">{integration.pricing}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6">
                {integration.status === 'coming_soon' ? (
                  <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded text-sm font-medium cursor-not-allowed">
                    Coming Soon
                  </button>
                ) : connectedIntegrations.has(integration.id) ? (
                  <div className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 rounded text-sm font-medium border border-green-200">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Connected
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="w-full px-4 py-2 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-sm font-normal hover:bg-[#6E4EFF]/10 transition-colors"
                  >
                    Connect Integration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedIntegrations.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No integrations found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
