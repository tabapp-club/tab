"use client";

import React, { useState } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

export function SettingsContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('user-profile');
  const [activeSection, setActiveSection] = useState('account-settings');

  // Mock user data - in real app this would come from context/API
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    businessName: "Acme Corporation",
    businessAddress: "123 Business St, Suite 100, New York, NY 10001"
  };

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden h-screen">
        <div className="pt-12 lg:pt-0 h-full flex">
          {/* Settings Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('account-settings')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm font-medium transition-colors ${
                  activeSection === 'account-settings'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Account settings
              </button>
              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm transition-colors ${
                  activeSection === 'preferences'
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveSection('integrations')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm font-medium transition-colors ${
                  activeSection === 'integrations'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Integrations
              </button>
              <button
                onClick={() => setActiveSection('user-management')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm font-medium transition-colors ${
                  activeSection === 'user-management'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                User management
              </button>
              <button
                onClick={() => setActiveSection('login-security')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm font-medium transition-colors ${
                  activeSection === 'login-security'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login and security
              </button>
              <button
                onClick={() => setActiveSection('payments-billing')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm font-medium transition-colors ${
                  activeSection === 'payments-billing'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Payments & Billing
              </button>
              <button
                onClick={() => setActiveSection('data-privacy')}
                className={`w-full h-8 px-2 py-1 rounded-md text-left text-sm transition-colors ${
                  activeSection === 'data-privacy'
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Data & Privacy
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Account settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your account preferences and integrations</p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab('user-profile')}
                className={`h-8 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'user-profile'
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                User Profile
              </button>
              <button
                onClick={() => setActiveTab('business-profile')}
                className={`h-8 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'business-profile'
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Business Profile
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[400px] shadow-sm">
              {activeSection === 'account-settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {activeTab === 'user-profile' ? 'Personal Information' : 'Business Information'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Update your {activeTab === 'user-profile' ? 'personal' : 'business'} details and contact information.
                    </p>
                  </div>

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {activeTab === 'user-profile' ? 'Full Name' : 'Business Name'}
                      </label>
                      <input
                        type="text"
                        defaultValue={activeTab === 'user-profile' ? userData.name : userData.businessName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder={activeTab === 'user-profile' ? 'Enter your full name' : 'Enter business name'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue={userData.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {activeTab === 'business-profile' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Address
                        </label>
                        <textarea
                          defaultValue={userData.businessAddress}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          rows={3}
                          placeholder="Enter business address"
                        />
                      </div>
                    )}

                    <div className="pt-4 flex gap-3">
                      <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">
                        Save Changes
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                  <p className="text-gray-600 text-sm">Customize your application preferences and notification settings.</p>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your account and campaigns</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications in your browser for real-time updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
                        <p className="text-sm text-gray-500">Receive updates about new features and promotional offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                  <p className="text-gray-600 text-sm">Connect your account with third-party services and POS systems to streamline your workflow.</p>

                  <div className="space-y-4">
                    {/* POS Systems */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Square POS</h3>
                            <p className="text-sm text-gray-500">Sync sales data and customer information</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Shopify</h3>
                            <p className="text-sm text-gray-500">Connect your online store and inventory</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Stripe</h3>
                            <p className="text-sm text-gray-500">Process payments and manage transactions</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">QuickBooks</h3>
                            <p className="text-sm text-gray-500">Sync financial data and accounting records</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Clover POS</h3>
                            <p className="text-sm text-gray-500">Integrate with Clover point of sale system</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Toast POS</h3>
                            <p className="text-sm text-gray-500">Connect with Toast restaurant management system</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'user-management' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                      <p className="text-gray-600 text-sm">Manage team members and their access permissions.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Add Member
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            JD
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">John Doe</p>
                            <p className="text-sm text-gray-500">john@example.com</p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Admin</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            JS
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                            <p className="text-sm text-gray-500">jane@example.com</p>
                          </div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Member</span>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            MJ
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                            <p className="text-sm text-gray-500">mike@example.com</p>
                          </div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'login-security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Login and Security</h2>
                  <p className="text-gray-600 text-sm">Manage your login credentials and security settings.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
                          <p className="text-sm text-gray-500">Manage your active login sessions across devices</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View All
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Login History</h3>
                          <p className="text-sm text-gray-500">Review recent login attempts and locations</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'payments-billing' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Payments & Billing</h2>
                  <p className="text-gray-600 text-sm">Manage your payment methods and billing information.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Current Plan</h3>
                          <p className="text-sm text-gray-500">Pro Plan - $29/month</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                          <p className="text-sm text-gray-500">Visa ending in 4242</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Update
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Billing History</h3>
                          <p className="text-sm text-gray-500">View your past invoices and payments</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View All
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Tax Information</h3>
                          <p className="text-sm text-gray-500">Manage your tax settings and documents</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'data-privacy' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
                  <p className="text-gray-600 text-sm">Manage your data and privacy settings.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Data Export</h3>
                          <p className="text-sm text-gray-500">Download a copy of your data in JSON format</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Export
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Privacy Policy</h3>
                          <p className="text-sm text-gray-500">Read our privacy policy and data handling practices</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Cookie Preferences</h3>
                          <p className="text-sm text-gray-500">Manage your cookie and tracking preferences</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Configure
                        </button>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-red-900">Delete Account</h3>
                          <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
