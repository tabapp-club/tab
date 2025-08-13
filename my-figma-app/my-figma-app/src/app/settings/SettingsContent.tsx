"use client";

import React, { useState } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

export function SettingsContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('user-profile');
  const [activeSection, setActiveSection] = useState('account-settings');
  const [preferencesTab, setPreferencesTab] = useState('notifications');

  // Mock user data - in real app this would come from context/API
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    employeeId: "EMP001",
    govtId: "A123456789",
    businessName: "Acme Corporation",
    businessEmails: ["contact@acme.com", "support@acme.com"],
    businessPhones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    businessAddress: "123 Business St, Suite 100, New York, NY 10001",
    businessPAN: "ABCDE1234F",
    gstNumber: "22AAAAA0000A1Z5",
    businessId: "BIZ001",
    primaryPOC: {
      name: "Sarah Johnson",
      email: "sarah.johnson@acme.com",
      phone: "+1 (555) 111-2222",
      designation: "Operations Manager"
    }
  };

  // Editable state (simulating full functionality)
  const [profile, setProfile] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    employeeId: userData.employeeId,
    govtId: userData.govtId,
  });
  const [business, setBusiness] = useState({
    businessName: userData.businessName,
    businessEmails: userData.businessEmails,
    businessPhones: userData.businessPhones,
    businessAddress: userData.businessAddress,
    businessPAN: userData.businessPAN,
    gstNumber: userData.gstNumber,
    businessId: userData.businessId,
    primaryPOC: userData.primaryPOC,
  });
  const [savedProfile, setSavedProfile] = useState(profile);
  const [savedBusiness, setSavedBusiness] = useState(business);

  // Preferences
  const [prefs, setPrefs] = useState({ email: true, push: false, marketing: true });
  
  // Extended notification preferences
  const [notifications, setNotifications] = useState({
    email: {
      campaigns: true,
      reports: true,
      system: true,
      marketing: false,
      security: true,
      billing: true
    },
    push: {
      campaigns: false,
      reports: true,
      system: true,
      marketing: false,
      security: true,
      billing: false
    },
    sms: {
      campaigns: false,
      reports: false,
      system: true,
      marketing: false,
      security: true,
      billing: false
    },
    inApp: {
      campaigns: true,
      reports: true,
      system: true,
      marketing: true,
      security: true,
      billing: true
    }
  });

  // Invoice preferences
  const [invoicePrefs, setInvoicePrefs] = useState({
    syncWithTabEngage: true,
    sendViaTabApp: true,
    smsBackup: false
  });

  // Integrations state
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    square: false,
    shopify: false,
    stripe: false,
    quickbooks: false,
    clover: false,
    toast: false,
  });

  // User management
  type Member = { 
    initials: string; 
    name: string; 
    email: string; 
    phone: string; 
    role: 'Owner' | 'Admin' | 'Member'; 
    employeeId: string; 
  };
  const [members, setMembers] = useState<Member[]>([
    { initials: 'JD', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', role: 'Owner', employeeId: 'EMP001' },
    { initials: 'JS', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543', role: 'Admin', employeeId: 'EMP002' },
    { initials: 'MJ', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 555-1234', role: 'Member', employeeId: 'EMP003' },
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    role: 'Member' as 'Owner' | 'Admin' | 'Member', 
    employeeId: '' 
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editMember, setEditMember] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    role: 'Member' as 'Owner' | 'Admin' | 'Member', 
    employeeId: '' 
  });
  const [showEditRoleDropdown, setShowEditRoleDropdown] = useState(false);

  // Security
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showSessions, setShowSessions] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  // Billing
  const [plan, setPlan] = useState<'Pro' | 'Basic'>('Pro');
  const [paymentMethod, setPaymentMethod] = useState({ brand: 'Visa', last4: '4242' });
  const [showInvoices, setShowInvoices] = useState(false);

  // Data & Privacy
  const handleExportData = () => {
    const blob = new Blob([
      JSON.stringify({ profile: savedProfile, business: savedBusiness, prefs, integrations }, null, 2)
    ], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tab-dashboard-export.json';
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden h-screen bg-[#f6f6f6]">
        <div className="pt-12 lg:pt-0 h-full flex">
          {/* Settings Sidebar */}
          <div className="w-[232px] bg-white border-r border-[#e9e9e9] px-4 py-0 pt-10 space-y-4 h-full fixed left-[232px] top-0">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('account-settings')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm font-medium transition-colors ${
                  activeSection === 'account-settings'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Account settings
              </button>
              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm transition-colors ${
                  activeSection === 'preferences'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveSection('integrations')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm font-medium transition-colors ${
                  activeSection === 'integrations'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Integrations
              </button>
              <button
                onClick={() => setActiveSection('user-management')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm font-medium transition-colors ${
                  activeSection === 'user-management'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                User management
              </button>
              <button
                onClick={() => setActiveSection('login-security')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm font-medium transition-colors ${
                  activeSection === 'login-security'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Login and security
              </button>
              <button
                onClick={() => setActiveSection('payments-billing')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm font-medium transition-colors ${
                  activeSection === 'payments-billing'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Payments & Billing
              </button>
              <button
                onClick={() => setActiveSection('data-privacy')}
                className={`w-full h-8 px-2 py-1 rounded-[2px] text-left text-sm transition-colors ${
                  activeSection === 'data-privacy'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                Data & Privacy
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-[248px] flex flex-col h-full">
            {/* Fixed Header Area */}
            <div className="p-6 pb-4 bg-[#f6f6f6] border-b border-[#e9e9e9]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[24px] leading-[39.2px] tracking-[-0.1px] font-bold text-[#2a2a2f]">
                  {activeSection === 'preferences' ? 'Preferences' : 'Account settings'}
              </h1>
                <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px] mt-1">
                  {activeSection === 'preferences' 
                    ? 'Customize your application preferences and notification settings'
                    : 'Manage your account preferences and integrations'
                  }
                </p>
            </div>

            {/* Tab Navigation */}
              {activeSection === 'account-settings' && (
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab('user-profile')}
                    className={`h-8 px-3 py-1 rounded-md text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                  activeTab === 'user-profile'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                }`}
              >
                User Profile
              </button>
              <button
                onClick={() => setActiveTab('business-profile')}
                    className={`h-8 px-3 py-1 rounded-md text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                  activeTab === 'business-profile'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                }`}
              >
                Business Profile
              </button>
            </div>
              )}

              {activeSection === 'preferences' && (
                <div className="mb-6 flex gap-2">
                  <button
                    onClick={() => setPreferencesTab('notifications')}
                    className={`h-8 px-3 py-1 rounded-md text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                      preferencesTab === 'notifications'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                    }`}
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => setPreferencesTab('invoices')}
                    className={`h-8 px-3 py-1 rounded-md text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                      preferencesTab === 'invoices'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                    }`}
                  >
                    Invoices
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white border border-[#e9e9e9] rounded-xl p-6 min-h-[400px]">
              {activeSection === 'account-settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-2">
                      {activeTab === 'user-profile' ? 'Personal Information' : 'Business Information'}
                    </h2>
                    <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px]">
                      Update your {activeTab === 'user-profile' ? 'personal' : 'business'} details and contact information.
                    </p>
                  </div>

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                        {activeTab === 'user-profile' ? 'Full Name' : 'Business Name'}
                      </label>
                      <input
                        type="text"
                        value={activeTab === 'user-profile' ? profile.name : business.businessName}
                        onChange={(e) => activeTab === 'user-profile'
                          ? setProfile(v => ({ ...v, name: e.target.value }))
                          : setBusiness(v => ({ ...v, businessName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder={activeTab === 'user-profile' ? 'Enter your full name' : 'Enter business name'}
                      />
                    </div>

                    <div>
                      <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(v => ({ ...v, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(v => ({ ...v, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={profile.employeeId}
                        onChange={(e) => setProfile(v => ({ ...v, employeeId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter employee ID"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                        Government ID
                      </label>
                      <input
                        type="text"
                        value={profile.govtId}
                        onChange={(e) => setProfile(v => ({ ...v, govtId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter government ID (Aadhar, PAN, etc.)"
                      />
                    </div>

                    {activeTab === 'business-profile' && (
                      <>
                        {/* Business Email IDs */}
                      <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Business Email IDs
                          </label>
                          <div className="space-y-2">
                            {business.businessEmails.map((email, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => {
                                    const newEmails = [...business.businessEmails];
                                    newEmails[index] = e.target.value;
                                    setBusiness(v => ({ ...v, businessEmails: newEmails }));
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                  placeholder="Enter business email"
                                />
                                {business.businessEmails.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const newEmails = business.businessEmails.filter((_, i) => i !== index);
                                      setBusiness(v => ({ ...v, businessEmails: newEmails }));
                                    }}
                                    className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            {business.businessEmails.length < 3 && (
                              <button
                                onClick={() => {
                                  setBusiness(v => ({ 
                                    ...v, 
                                    businessEmails: [...v.businessEmails, ''] 
                                  }));
                                }}
                                className="text-[#6E4EFF] hover:text-[#5A3FD9] text-sm font-medium transition-colors"
                              >
                                + Add Email ID
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Business Phone Numbers */}
                        <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Business Phone Numbers
                          </label>
                          <div className="space-y-2">
                            {business.businessPhones.map((phone, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => {
                                    const newPhones = [...business.businessPhones];
                                    newPhones[index] = e.target.value;
                                    setBusiness(v => ({ ...v, businessPhones: newPhones }));
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                  placeholder="Enter business phone number"
                                />
                                {business.businessPhones.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const newPhones = business.businessPhones.filter((_, i) => i !== index);
                                      setBusiness(v => ({ ...v, businessPhones: newPhones }));
                                    }}
                                    className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            {business.businessPhones.length < 3 && (
                              <button
                                onClick={() => {
                                  setBusiness(v => ({ 
                                    ...v, 
                                    businessPhones: [...v.businessPhones, ''] 
                                  }));
                                }}
                                className="text-[#6E4EFF] hover:text-[#5A3FD9] text-sm font-medium transition-colors"
                              >
                                + Add Phone Number
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Business Address */}
                        <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                          Business Address
                        </label>
                        <textarea
                            value={business.businessAddress}
                            onChange={(e) => setBusiness(v => ({ ...v, businessAddress: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          rows={3}
                          placeholder="Enter business address"
                        />
                      </div>

                        {/* Business PAN */}
                        <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Business PAN
                          </label>
                          <input
                            type="text"
                            value={business.businessPAN}
                            onChange={(e) => setBusiness(v => ({ ...v, businessPAN: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Enter business PAN"
                          />
                        </div>

                        {/* GST Number */}
                        <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            GST Number
                          </label>
                          <input
                            type="text"
                            value={business.gstNumber}
                            onChange={(e) => setBusiness(v => ({ ...v, gstNumber: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Enter GST number"
                          />
                        </div>

                        {/* Business ID */}
                        <div>
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Business ID
                          </label>
                          <input
                            type="text"
                            value={business.businessId}
                            onChange={(e) => setBusiness(v => ({ ...v, businessId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Enter business ID"
                          />
                        </div>

                        {/* Primary POC Details */}
                        <div className="border-t pt-4 mt-4">
                          <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">
                            Primary POC Details
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                POC Name
                              </label>
                              <input
                                type="text"
                                value={business.primaryPOC.name}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, name: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter POC name"
                              />
                            </div>

                            <div>
                              <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                POC Email
                              </label>
                              <input
                                type="email"
                                value={business.primaryPOC.email}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, email: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter POC email"
                              />
                            </div>

                            <div>
                              <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                POC Phone
                              </label>
                              <input
                                type="tel"
                                value={business.primaryPOC.phone}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, phone: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter POC phone number"
                              />
                            </div>

                            <div>
                              <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                POC Designation
                              </label>
                              <input
                                type="text"
                                value={business.primaryPOC.designation}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, designation: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter POC designation"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => { setSavedProfile(profile); setSavedBusiness(business); }}
                        className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => { setProfile(savedProfile); setBusiness(savedBusiness); }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-[4px] hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  {preferencesTab === 'notifications' && (
                  <div className="space-y-6">
                      <div>
                        <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-2">
                          Notification Preferences
                        </h2>
                        <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px]">
                          Choose how you want to receive notifications for different types of activities.
                        </p>
                      </div>

                      {/* Email Notifications */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            📧
                          </span>
                          Email Notifications
                        </h3>
                        <div className="space-y-3">
                          {Object.entries({
                            campaigns: 'Campaign updates and status changes',
                            reports: 'Weekly and monthly reports',
                            system: 'System maintenance and updates',
                            marketing: 'New features and promotional offers',
                            security: 'Security alerts and login notifications',
                            billing: 'Payment confirmations and invoices'
                          }).map(([key, description]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">{key}</p>
                                <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={notifications.email[key as keyof typeof notifications.email]}
                                  onChange={() => setNotifications(v => ({
                                    ...v,
                                    email: { ...v.email, [key]: !v.email[key as keyof typeof v.email] }
                                  }))} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E4EFF]"></div>
                      </label>
                            </div>
                          ))}
                        </div>
                    </div>

                      {/* Push Notifications */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            🔔
                          </span>
                          Push Notifications
                        </h3>
                        <div className="space-y-3">
                          {Object.entries({
                            campaigns: 'Real-time campaign alerts',
                            reports: 'Report generation completed',
                            system: 'System status updates',
                            marketing: 'Feature announcements',
                            security: 'Security alerts',
                            billing: 'Payment reminders'
                          }).map(([key, description]) => (
                            <div key={key} className="flex items-center justify-between">
                      <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">{key}</p>
                                <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={notifications.push[key as keyof typeof notifications.push]}
                                  onChange={() => setNotifications(v => ({
                                    ...v,
                                    push: { ...v.push, [key]: !v.push[key as keyof typeof v.push] }
                                  }))} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E4EFF]"></div>
                      </label>
                            </div>
                          ))}
                        </div>
                    </div>

                      {/* SMS Notifications */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            💬
                          </span>
                          SMS Notifications
                        </h3>
                        <div className="space-y-3">
                          {Object.entries({
                            campaigns: 'Critical campaign alerts only',
                            reports: 'Monthly summary via SMS',
                            system: 'Emergency system notifications',
                            marketing: 'Special offers and promotions',
                            security: 'Security breach alerts',
                            billing: 'Payment due reminders'
                          }).map(([key, description]) => (
                            <div key={key} className="flex items-center justify-between">
                      <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">{key}</p>
                                <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={notifications.sms[key as keyof typeof notifications.sms]}
                                  onChange={() => setNotifications(v => ({
                                    ...v,
                                    sms: { ...v.sms, [key]: !v.sms[key as keyof typeof v.sms] }
                                  }))} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E4EFF]"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* In-App Notifications */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            🔕
                          </span>
                          In-App Notifications
                        </h3>
                        <div className="space-y-3">
                          {Object.entries({
                            campaigns: 'Campaign status updates in dashboard',
                            reports: 'Report availability notifications',
                            system: 'System announcements in app',
                            marketing: 'Feature highlights and tips',
                            security: 'Security notifications in app',
                            billing: 'Billing status in dashboard'
                          }).map(([key, description]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">{key}</p>
                                <p className="text-xs text-gray-500">{description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={notifications.inApp[key as keyof typeof notifications.inApp]}
                                  onChange={() => setNotifications(v => ({
                                    ...v,
                                    inApp: { ...v.inApp, [key]: !v.inApp[key as keyof typeof v.inApp] }
                                  }))} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E4EFF]"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-4 flex gap-3">
                        <button className="bg-[#6E4EFF] text-white px-4 py-2 rounded-[4px] hover:bg-[#5A3FD9] transition-colors font-medium">
                          Save Notification Preferences
                        </button>
                      </div>
                    </div>
                  )}

                                    {preferencesTab === 'invoices' && (
                  <div className="space-y-6">
                      <div>
                        <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-2">
                          Invoice Delivery Settings
                        </h2>
                        <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px]">
                          Configure how invoices are synchronized and delivered to your users.
                        </p>
                      </div>

                      {/* Sync with tab-engage */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Sync invoices with tab-engage</h3>
                            <p className="text-xs text-gray-500 mt-1">Automatically synchronize all invoices with the tab-engage platform for seamless integration</p>
                            <p className="text-xs text-orange-600 mt-2 font-medium">Contact support to disable this feature</p>
                          </div>
                          <div className="relative inline-flex items-center">
                            <div className="w-11 h-6 bg-[#6E4EFF] rounded-full relative">
                              <div className="absolute top-[2px] right-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Send via tab-app */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Send invoices to user via tab-app</h3>
                            <p className="text-xs text-gray-500 mt-1">Deliver invoices directly through the tab-app mobile application for instant access</p>
                            <p className="text-xs text-orange-600 mt-2 font-medium">Contact support to disable this feature</p>
                          </div>
                          <div className="relative inline-flex items-center">
                            <div className="w-11 h-6 bg-[#6E4EFF] rounded-full relative">
                              <div className="absolute top-[2px] right-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SMS backup */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                      <div>
                            <h3 className="text-sm font-medium text-gray-900">SMS backup delivery</h3>
                            <p className="text-xs text-gray-500 mt-1">If the app is not installed on the user&apos;s device, send invoice via SMS as a backup delivery method</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={invoicePrefs.smsBackup}
                              onChange={() => setInvoicePrefs(v => ({ ...v, smsBackup: !v.smsBackup }))} 
                            />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                      {/* Save Button */}
                      <div className="pt-4 flex gap-3">
                        <button className="bg-[#6E4EFF] text-white px-4 py-2 rounded-[4px] hover:bg-[#5A3FD9] transition-colors font-medium">
                          Save Invoice Settings
                        </button>
                      </div>
                    </div>
                  )}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, square: !v.square }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.square ? 'Disconnect' : 'Connect'}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, shopify: !v.shopify }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.shopify ? 'Disconnect' : 'Connect'}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, stripe: !v.stripe }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.stripe ? 'Disconnect' : 'Connect'}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, quickbooks: !v.quickbooks }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.quickbooks ? 'Disconnect' : 'Connect'}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, clover: !v.clover }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.clover ? 'Disconnect' : 'Connect'}
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
                        <button onClick={() => setIntegrations(v => ({ ...v, toast: !v.toast }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {integrations.toast ? 'Disconnect' : 'Connect'}
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
                      <h2 className="text-lg font-semibold text-gray-900">Employee Management</h2>
                      <p className="text-gray-600 text-sm">Manage team members and their access permissions.</p>
                    </div>
                      <button onClick={() => setShowAddMember(!showAddMember)} className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98]">
                        {showAddMember ? 'Close' : 'Add Employee'}
                    </button>
                  </div>
                  {showAddMember && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="w-full">
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                            placeholder="Enter full name" 
                            value={newMember.name} 
                            onChange={e => setNewMember({ ...newMember, name: e.target.value })} 
                          />
                  </div>

                        <div className="w-full">
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input 
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                            placeholder="Enter email address" 
                            value={newMember.email} 
                            onChange={e => setNewMember({ ...newMember, email: e.target.value })} 
                          />
                          </div>

                        <div className="w-full">
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                            placeholder="Enter phone number" 
                            value={newMember.phone} 
                            onChange={e => setNewMember({ ...newMember, phone: e.target.value })} 
                          />
                          </div>

                        <div className="w-full relative">
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-[4px] bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors flex items-center justify-between"
                            >
                              <span className="text-gray-900">{newMember.role}</span>
                              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {showRoleDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[4px] shadow-lg">
                                {['Owner', 'Admin', 'Member'].map((role) => (
                                  <button
                                    key={role}
                                    type="button"
                                    onClick={() => {
                                      setNewMember({ ...newMember, role: role as 'Owner' | 'Admin' | 'Member' });
                                      setShowRoleDropdown(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${
                                      newMember.role === role ? 'bg-[#6E4EFF0D] text-[#6E4EFF]' : 'text-gray-900'
                                    } ${role === 'Owner' ? 'rounded-t-[4px]' : role === 'Member' ? 'rounded-b-[4px]' : ''}`}
                                  >
                                    {role}
                                  </button>
                                ))}
                        </div>
                            )}
                      </div>
                    </div>

                        <div className="w-full lg:col-span-2">
                          <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                            Employee ID
                          </label>
                          <input 
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                            placeholder="Enter employee ID" 
                            value={newMember.employeeId} 
                            onChange={e => setNewMember({ ...newMember, employeeId: e.target.value })} 
                          />
                          </div>
                          </div>
                      
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => {
                            // Validate mandatory fields
                            if (!newMember.name.trim() || !newMember.phone.trim()) {
                              alert('Please fill in all mandatory fields (Name and Phone Number)');
                              return;
                            }
                            
                            const initials = newMember.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
                            setMembers(m => [...m, { 
                              initials, 
                              name: newMember.name, 
                              email: newMember.email, 
                              phone: newMember.phone,
                              role: newMember.role,
                              employeeId: newMember.employeeId
                            }]);
                            setNewMember({ name: '', email: '', phone: '', role: 'Member', employeeId: '' });
                            setShowAddMember(false);
                            setShowRoleDropdown(false);
                          }} 
                          className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98] w-full sm:w-auto"
                        >
                          Add Employee
                        </button>
                        <button 
                          onClick={() => {
                            setNewMember({ name: '', email: '', phone: '', role: 'Member', employeeId: '' });
                            setShowAddMember(false);
                            setShowRoleDropdown(false);
                          }}
                          className="h-9 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-gray-200 hover:to-gray-300 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98] w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                        </div>
                      </div>
                  )}

                                     <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {members.map((m, idx) => {
                      const memberKey = `${m.email}-${m.employeeId}-${idx}`;
                      const isEditing = editingMember === memberKey;
                      
                      return (
                        <div key={memberKey} className={`p-4 ${idx !== 0 ? 'border-t border-gray-200' : ''} ${idx===0 ? 'bg-gray-50' : ''}`}>
                          {isEditing ? (
                            // Edit Form
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                                  <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                  </label>
                                  <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                                    placeholder="Enter full name" 
                                    value={editMember.name} 
                                    onChange={e => setEditMember({ ...editMember, name: e.target.value })} 
                                  />
                          </div>
                                
                                <div>
                                  <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                    Email
                                  </label>
                                  <input 
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                                    placeholder="Enter email address" 
                                    value={editMember.email} 
                                    onChange={e => setEditMember({ ...editMember, email: e.target.value })} 
                                  />
                        </div>

                                <div>
                                  <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                  </label>
                                  <input 
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                                    placeholder="Enter phone number" 
                                    value={editMember.phone} 
                                    onChange={e => setEditMember({ ...editMember, phone: e.target.value })} 
                                  />
                                </div>

                                <div className="relative">
                                  <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                    Role <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setShowEditRoleDropdown(!showEditRoleDropdown)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-[4px] bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors flex items-center justify-between"
                                    >
                                      <span className="text-gray-900">{editMember.role}</span>
                                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${showEditRoleDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                    {showEditRoleDropdown && (
                                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[4px] shadow-lg">
                                        {['Owner', 'Admin', 'Member'].map((role) => (
                                          <button
                                            key={role}
                                            type="button"
                                            onClick={() => {
                                              setEditMember({ ...editMember, role: role as 'Owner' | 'Admin' | 'Member' });
                                              setShowEditRoleDropdown(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${
                                              editMember.role === role ? 'bg-[#6E4EFF0D] text-[#6E4EFF]' : 'text-gray-900'
                                            } ${role === 'Owner' ? 'rounded-t-[4px]' : role === 'Member' ? 'rounded-b-[4px]' : ''}`}
                                          >
                                            {role}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                      </div>
                    </div>

                                <div className="lg:col-span-2">
                                  <label className="block text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium text-gray-700 mb-1">
                                    Employee ID
                                  </label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors" 
                                    placeholder="Enter employee ID" 
                                    value={editMember.employeeId} 
                                    onChange={e => setEditMember({ ...editMember, employeeId: e.target.value })} 
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button 
                                  onClick={() => {
                                    if (!editMember.name.trim() || !editMember.phone.trim()) {
                                      alert('Please fill in all mandatory fields (Name and Phone Number)');
                                      return;
                                    }
                                    
                                    const initials = editMember.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
                                    setMembers(members => members.map((member, index) => 
                                      index === idx ? { 
                                        ...editMember,
                                        initials
                                      } : member
                                    ));
                                    setEditingMember(null);
                                    setShowEditRoleDropdown(false);
                                  }} 
                                  className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98] w-full sm:w-auto"
                                >
                                  Save Changes
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingMember(null);
                                    setShowEditRoleDropdown(false);
                                  }}
                                  className="h-9 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-gray-200 hover:to-gray-300 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98] w-full sm:w-auto"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display Mode
                      <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                                  m.role === 'Owner' ? 'bg-purple-500' : 
                                  m.role === 'Admin' ? 'bg-green-500' : 
                                  'bg-blue-500'
                                }`}>
                                  {m.initials}
                          </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                                      <p className="text-xs text-gray-500">{m.phone}</p>
                          </div>
                                    {m.email && (
                                      <div className="min-w-0">
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="text-xs text-gray-600 truncate">{m.email}</p>
                        </div>
                                    )}
                                    {m.employeeId && (
                                      <div className="min-w-0">
                                        <p className="text-xs text-gray-400">Employee ID</p>
                                        <p className="text-xs text-gray-600">{m.employeeId}</p>
                      </div>
                                    )}
                    </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  m.role === 'Owner' ? 'bg-purple-100 text-purple-800' : 
                                  m.role === 'Admin' ? 'bg-green-100 text-green-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {m.role}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingMember(memberKey);
                                    setEditMember({
                                      name: m.name,
                                      email: m.email,
                                      phone: m.phone,
                                      role: m.role,
                                      employeeId: m.employeeId
                                    });
                                  }}
                                  className="text-[#6E4EFF] hover:text-[#5A3FD9] text-xs font-medium transition-colors px-2 py-1 hover:bg-[#6E4EFF0D] rounded-[4px]"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                        <button onClick={() => setShowChangePassword(!showChangePassword)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{showChangePassword ? 'Close' : 'Change'}</button>
                      </div>
                      {showChangePassword && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input type="password" className="px-3 py-2 border rounded-md" placeholder="Current" value={passwords.current} onChange={e => setPasswords(v => ({ ...v, current: e.target.value }))} />
                          <input type="password" className="px-3 py-2 border rounded-md" placeholder="New" value={passwords.next} onChange={e => setPasswords(v => ({ ...v, next: e.target.value }))} />
                          <input type="password" className="px-3 py-2 border rounded-md" placeholder="Confirm" value={passwords.confirm} onChange={e => setPasswords(v => ({ ...v, confirm: e.target.value }))} />
                          <div className="md:col-span-3"><button onClick={() => setShowChangePassword(false)} className="bg-black text-white px-3 py-1 rounded-md text-sm">Save password</button></div>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button onClick={() => setTwoFAEnabled(v => !v)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{twoFAEnabled ? 'Disable' : 'Enable'}</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
                          <p className="text-sm text-gray-500">Manage your active login sessions across devices</p>
                        </div>
                        <button onClick={() => setShowSessions(v => !v)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{showSessions ? 'Hide' : 'View All'}</button>
                      </div>
                      {showSessions && (
                        <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
                          <li>Chrome on macOS • New York, USA</li>
                          <li>Safari on iPhone • Last active 2h ago</li>
                        </ul>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Login History</h3>
                          <p className="text-sm text-gray-500">Review recent login attempts and locations</p>
                        </div>
                        <button onClick={() => setShowLoginHistory(v => !v)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{showLoginHistory ? 'Hide' : 'View History'}</button>
                      </div>
                      {showLoginHistory && (
                        <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
                          <li>Aug 10, 10:13 AM • New login • Chrome • NYC</li>
                          <li>Aug 08, 08:44 PM • Successful login • iPhone</li>
                        </ul>
                      )}
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
                          <p className="text-sm text-gray-500">{plan} Plan {plan==='Pro' ? ' - $29/month' : ' - $0/month'}</p>
                        </div>
                        <button onClick={() => setPlan(p => p==='Pro' ? 'Basic' : 'Pro')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Change Plan</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                          <p className="text-sm text-gray-500">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
                        </div>
                        <button onClick={() => setPaymentMethod(v => ({ ...v, last4: v.last4==='4242' ? '1111' : '4242' }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Update</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Billing History</h3>
                          <p className="text-sm text-gray-500">View your past invoices and payments</p>
                        </div>
                        <button onClick={() => setShowInvoices(v => !v)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{showInvoices ? 'Hide' : 'View All'}</button>
                      </div>
                      {showInvoices && (
                        <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
                          <li>Invoice #1023 • $29 • Paid</li>
                          <li>Invoice #1019 • $29 • Paid</li>
                        </ul>
                      )}
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
                        <button onClick={handleExportData} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Export</button>
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
      </div>
    </main>
  );
}
