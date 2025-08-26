"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

export function SettingsContent() {
  const router = useRouter();
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

  // Kebab menu state
  const [openKebabMenu, setOpenKebabMenu] = useState<string | null>(null);

  // Integration states
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    square: false,
    shopify: false,
    stripe: false,
    quickbooks: false,
    clover: false,
    toast: false,
  });

  // Manual integrations state
  const [manualIntegrations, setManualIntegrations] = useState({
    zapier: { connected: false, webhookUrl: '', apiKey: '' },
    webhooks: { enabled: false, endpoints: [], secret: '' },
    api: { enabled: false, apiKey: '', rateLimit: 1000 },
    csv: { enabled: false, lastSync: null },
    scheduled: { enabled: false, frequency: 'daily', nextSync: null }
  });

  // Loading states
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});

  // Modal states
  const [showZapierModal, setShowZapierModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);

  // Form states for modals
  const [zapierForm, setZapierForm] = useState({ webhookUrl: '', apiKey: '' });
  const [webhookForm, setWebhookForm] = useState({ endpoint: '', secret: '', events: [] });
  const [apiForm, setApiForm] = useState({ apiKey: '', rateLimit: 1000 });
  const [csvForm, setCsvForm] = useState({ enabled: false, fields: [] });
  const [scheduledForm, setScheduledForm] = useState({ frequency: 'daily', time: '09:00' });

  // Integration functions
  const connectIntegration = async (integrationId: string) => {
    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));
    setErrorStates(prev => ({ ...prev, [integrationId]: '' }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(prev => ({ ...prev, [integrationId]: true }));
      
      // Show success notification
      console.log(`${integrationId} integration connected successfully`);
    } catch (error) {
      setErrorStates(prev => ({ ...prev, [integrationId]: 'Failed to connect integration' }));
      console.error(`Error connecting ${integrationId}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  const disconnectIntegration = async (integrationId: string) => {
    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));
    setErrorStates(prev => ({ ...prev, [integrationId]: '' }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => ({ ...prev, [integrationId]: false }));
      
      // Show success notification
      console.log(`${integrationId} integration disconnected successfully`);
    } catch (error) {
      setErrorStates(prev => ({ ...prev, [integrationId]: 'Failed to disconnect integration' }));
      console.error(`Error disconnecting ${integrationId}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  const syncIntegration = async (integrationId: string) => {
    setLoadingStates(prev => ({ ...prev, [`${integrationId}_sync`]: true }));
    
    try {
      // Simulate sync API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success notification
      console.log(`${integrationId} data synced successfully`);
    } catch (error) {
      console.error(`Error syncing ${integrationId}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`${integrationId}_sync`]: false }));
    }
  };

  const openIntegrationSettings = (integrationId: string) => {
    // Navigate to integration settings or open modal
    console.log(`Opening settings for ${integrationId}`);
  };

  const viewIntegrationDocs = (integrationId: string) => {
    // Open documentation in new tab
    const docsUrls = {
      square: 'https://developer.squareup.com/docs',
      shopify: 'https://shopify.dev/docs',
      stripe: 'https://stripe.com/docs',
      quickbooks: 'https://developer.intuit.com/docs',
      clover: 'https://docs.clover.com',
      toast: 'https://developer.toasttab.com/docs'
    };
    
    const url = docsUrls[integrationId as keyof typeof docsUrls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Manual integration functions
  const setupZapierIntegration = async () => {
    setLoadingStates(prev => ({ ...prev, zapier: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setManualIntegrations(prev => ({
        ...prev,
        zapier: { ...prev.zapier, connected: true, ...zapierForm }
      }));
      
      setShowZapierModal(false);
      console.log('Zapier integration setup successfully');
    } catch (error) {
      console.error('Error setting up Zapier:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, zapier: false }));
    }
  };

  const setupWebhookIntegration = async () => {
    setLoadingStates(prev => ({ ...prev, webhooks: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setManualIntegrations(prev => ({
        ...prev,
        webhooks: { 
          ...prev.webhooks, 
          enabled: true, 
          endpoints: [...prev.webhooks.endpoints, webhookForm.endpoint],
          secret: webhookForm.secret
        }
      }));
      
      setShowWebhookModal(false);
      console.log('Webhook integration setup successfully');
    } catch (error) {
      console.error('Error setting up webhooks:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, webhooks: false }));
    }
  };

  const setupApiIntegration = async () => {
    setLoadingStates(prev => ({ ...prev, api: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setManualIntegrations(prev => ({
        ...prev,
        api: { ...prev.api, enabled: true, ...apiForm }
      }));
      
      setShowApiModal(false);
      console.log('API integration setup successfully');
    } catch (error) {
      console.error('Error setting up API:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, api: false }));
    }
  };

  // Close kebab menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if click is outside any kebab menu
      const isOutside = !document.querySelector('.kebab-menu-container')?.contains(event.target as Node);
      if (isOutside) {
        setOpenKebabMenu(null);
      }
    }

    if (openKebabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openKebabMenu]);

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
          <div className={`w-[272px] bg-white border-r border-[#e9e9e9] px-4 py-0 pt-8 h-full fixed top-0 transition-all duration-300 overflow-y-auto ${
            actualIsCollapsed ? 'left-16' : 'left-[232px]'
          }`}>

            
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('account-settings')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'account-settings'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Account settings</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Personal & business profile information
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'preferences'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Preferences</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Notifications & invoice delivery settings
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('integrations')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'integrations'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Integrations</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Connect POS systems & third-party apps
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('user-management')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'user-management'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">User management</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Manage team members & access permissions
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('login-security')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'login-security'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Login and security</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Password, 2FA & session management
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('payments-billing')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'payments-billing'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Payments & Billing</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Subscription plans & payment methods
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection('data-privacy')}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'data-privacy'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Data & Privacy</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Export data, privacy settings & account deletion
                  </span>
                </div>
              </button>
            </div>
            
            {/* Settings Footer */}
            <div className="mt-auto pt-4 pb-4 border-t border-gray-100">
              <div className="bg-blue-50 rounded-[4px] p-2">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Need help?</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Visit our <span className="underline cursor-pointer">help center</span> or <span className="underline cursor-pointer">contact support</span> for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${
            actualIsCollapsed ? 'ml-[256px]' : 'ml-[256px]'
          }`}>
            {/* Fixed Header Area */}
            <div className="px-2 pt-2 pb-3 bg-[#f6f6f6] border-b border-[#e9e9e9] -mt-2">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-[20px] leading-[28px] tracking-[-0.1px] font-bold text-[#2a2a2f]">
                  {activeSection === 'preferences' ? 'Preferences' : 'Account settings'}
              </h1>
                <p className="text-[#626266] text-[14px] leading-[20px] tracking-[-0.1px] mt-1 font-normal">
                  {activeSection === 'preferences' 
                    ? 'Customize your application preferences and notification settings'
                    : 'Manage your account preferences and integrations'
                  }
                </p>
            </div>

            {/* Tab Navigation */}
              {activeSection === 'account-settings' && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setActiveTab('user-profile')}
                    className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                  activeTab === 'user-profile'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                }`}
              >
                User Profile
              </button>
              <button
                onClick={() => setActiveTab('business-profile')}
                    className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
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
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setPreferencesTab('notifications')}
                    className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                      preferencesTab === 'notifications'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                    }`}
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => setPreferencesTab('invoices')}
                    className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
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
            <div className="flex-1 overflow-y-auto px-2 py-3">
              <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 min-h-[400px]">
              {activeSection === 'account-settings' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-0">
                      {activeTab === 'user-profile' ? 'Personal Information' : 'Business Information'}
                    </h2>
                    <p className="text-[#626266] text-[12px] leading-[16px] tracking-[-0.1px] font-normal">
                      Update your {activeTab === 'user-profile' ? 'personal' : 'business'} details and contact information.
                    </p>
                  </div>

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        {activeTab === 'user-profile' ? 'Full Name' : 'Business Name'}
                      </label>
                      <input
                        type="text"
                        value={activeTab === 'user-profile' ? profile.name : business.businessName}
                        onChange={(e) => activeTab === 'user-profile'
                          ? setProfile(v => ({ ...v, name: e.target.value }))
                          : setBusiness(v => ({ ...v, businessName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder={activeTab === 'user-profile' ? 'Enter your full name' : 'Enter business name'}
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(v => ({ ...v, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(v => ({ ...v, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={profile.employeeId}
                        onChange={(e) => setProfile(v => ({ ...v, employeeId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="Enter employee ID"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Government ID
                      </label>
                      <input
                        type="text"
                        value={profile.govtId}
                        onChange={(e) => setProfile(v => ({ ...v, govtId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="Enter government ID (Aadhar, PAN, etc.)"
                      />
                    </div>

                    {activeTab === 'business-profile' && (
                      <>
                        {/* Business Email IDs */}
                      <div>
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
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
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
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
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
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
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
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
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Business Address
                        </label>
                        <textarea
                            value={business.businessAddress}
                            onChange={(e) => setBusiness(v => ({ ...v, businessAddress: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          rows={3}
                          placeholder="Enter business address"
                        />
                      </div>

                        {/* Business PAN */}
                        <div>
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Business PAN
                          </label>
                          <input
                            type="text"
                            value={business.businessPAN}
                            onChange={(e) => setBusiness(v => ({ ...v, businessPAN: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                            placeholder="Enter business PAN"
                          />
                        </div>

                        {/* GST Number */}
                        <div>
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            GST Number
                          </label>
                          <input
                            type="text"
                            value={business.gstNumber}
                            onChange={(e) => setBusiness(v => ({ ...v, gstNumber: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                            placeholder="Enter GST number"
                          />
                        </div>

                        {/* Business ID */}
                        <div>
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Business ID
                          </label>
                          <input
                            type="text"
                            value={business.businessId}
                            onChange={(e) => setBusiness(v => ({ ...v, businessId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
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
                              <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                POC Name
                              </label>
                              <input
                                type="text"
                                value={business.primaryPOC.name}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, name: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                                placeholder="Enter POC name"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                POC Email
                              </label>
                              <input
                                type="email"
                                value={business.primaryPOC.email}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, email: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                                placeholder="Enter POC email"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                POC Phone
                              </label>
                              <input
                                type="tel"
                                value={business.primaryPOC.phone}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, phone: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                                placeholder="Enter POC phone number"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                POC Designation
                              </label>
                              <input
                                type="text"
                                value={business.primaryPOC.designation}
                                onChange={(e) => setBusiness(v => ({ 
                                  ...v, 
                                  primaryPOC: { ...v.primaryPOC, designation: e.target.value } 
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
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
                        className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded-[4px] font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98]"
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
                <div className="space-y-4">
                  {preferencesTab === 'notifications' && (
                  <div className="space-y-4">
                      <div>
                        <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-2">
                          Notification Preferences
                        </h2>
                        <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px]">
                          Choose how you want to receive notifications for different types of activities.
                        </p>
                      </div>

                      {/* Email Notifications */}
                      <div className="border border-gray-200 rounded-[4px] p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-blue-100 rounded-[4px] flex items-center justify-center mr-3">
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
                      <div className="border border-gray-200 rounded-[4px] p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-green-100 rounded-[4px] flex items-center justify-center mr-3">
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
                      <div className="border border-gray-200 rounded-[4px] p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-yellow-100 rounded-[4px] flex items-center justify-center mr-3">
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
                      <div className="border border-gray-200 rounded-[4px] p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-purple-100 rounded-[4px] flex items-center justify-center mr-3">
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
                  <div className="space-y-4">
                      <div>
                        <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-2">
                          Invoice Delivery Settings
                        </h2>
                        <p className="text-[#626266] text-[13.563px] leading-[19.6px] tracking-[-0.1px]">
                          Configure how invoices are synchronized and delivered to your users.
                        </p>
                      </div>

                      {/* Sync with tab-engage */}
                      <div className="border border-gray-200 rounded-[4px] p-4">
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
                      <div className="border border-gray-200 rounded-[4px] p-4">
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
                      <div className="border border-gray-200 rounded-[4px] p-4">
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
                  {/* Header Section */}
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-[18px] leading-[24px] font-bold text-[#2a2a2f] tracking-[-0.1px] mb-1">
                          Integrations
                        </h2>
                        <p className="text-[14px] leading-[20px] text-[#626266] tracking-[-0.1px] font-normal max-w-lg">
                          Connect your business tools and POS systems to unlock powerful automation and insights. Sync data seamlessly across your tech stack.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {Object.values(integrations).filter(Boolean).length} Connected
                        </span>
                        <button 
                          onClick={() => router.push('/settings/browse-integrations')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E4EFF]"
                        >
                          Browse All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">POS Systems</p>
                          <p className="text-xs text-gray-500">3 available</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                          </div>
                          <div>
                          <p className="text-sm font-medium text-gray-900">Payments</p>
                          <p className="text-xs text-gray-500">2 available</p>
                          </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zm-2 1a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1zm-2-1a1 1 0 100 2h.01a1 1 0 100-2H9zm-2 1a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Accounting</p>
                          <p className="text-xs text-gray-500">1 available</p>
                        </div>
                      </div>
                      </div>
                    </div>

                  {/* Manual Integrations Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Manual Integrations</h3>
                        <p className="text-sm text-gray-600">Connect with custom solutions, automation tools, and third-party services</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                          Advanced
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Zapier Integration */}
                      <div className="group relative bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-[#6E4EFF]/30 hover:bg-gray-50/80 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div>
                              <h4 className="text-sm font-semibold text-gray-900">Zapier</h4>
                              <p className="text-xs text-gray-500">Automation platform</p>
                          </div>
                        </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          Automate workflows by connecting Tab with 5000+ apps through Zapier's no-code platform.
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span>5000+ apps</span>
                          </div>
                          <button 
                            onClick={() => setShowZapierModal(true)}
                            className="px-3 py-1.5 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-xs font-normal hover:bg-[#6E4EFF]/10 transition-all duration-200"
                          >
                            {manualIntegrations.zapier.connected ? 'Connected' : 'Setup Guide'}
                          </button>
                      </div>
                    </div>

                      {/* Webhooks Integration */}
                      <div className="group relative bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-[#6E4EFF]/30 hover:bg-gray-50/80 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                          </div>
                          <div>
                              <h4 className="text-sm font-semibold text-gray-900">Webhooks</h4>
                              <p className="text-xs text-gray-500">Real-time notifications</p>
                          </div>
                        </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          Receive real-time notifications when events occur in your Tab account via HTTP webhooks.
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span>Real-time</span>
                          </div>
                          <button 
                            onClick={() => setShowWebhookModal(true)}
                            className="px-3 py-1.5 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-xs font-normal hover:bg-[#6E4EFF]/10 transition-all duration-200"
                          >
                            {manualIntegrations.webhooks.enabled ? 'Active' : 'Configure'}
                          </button>
                      </div>
                    </div>

                      {/* API Integration */}
                      <div className="group relative bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-[#6E4EFF]/30 hover:bg-gray-50/80 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                            </svg>
                          </div>
                          <div>
                              <h4 className="text-sm font-semibold text-gray-900">REST API</h4>
                              <p className="text-xs text-gray-500">Developer access</p>
                          </div>
                        </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          Build custom integrations using our comprehensive REST API with full CRUD operations.
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span>Full CRUD</span>
                          </div>
                          <button 
                            onClick={() => setShowApiModal(true)}
                            className="px-3 py-1.5 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-xs font-normal hover:bg-[#6E4EFF]/10 transition-all duration-200"
                          >
                            {manualIntegrations.api.enabled ? 'Enabled' : 'API Docs'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Manual Integration Options */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Other Integration Methods</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                          <div>
                              <h5 className="text-sm font-medium text-gray-900">CSV Import/Export</h5>
                              <p className="text-xs text-gray-500">Bulk data operations</p>
                          </div>
                        </div>
                          <button className="text-xs text-[#6E4EFF] hover:text-[#5D3EE8] font-medium">
                            Learn More
                        </button>
                      </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">Scheduled Sync</h5>
                              <p className="text-xs text-gray-500">Automated data sync</p>
                            </div>
                          </div>
                          <button className="text-xs text-[#6E4EFF] hover:text-[#5D3EE8] font-medium">
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Integrations */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4 flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#6E4EFF] rounded-full mr-2"></span>
                      Featured Integrations
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Square POS */}
                      <div className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-[#6E4EFF]/30 hover:shadow-md transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 mb-1">Square POS</h4>
                            <p className="text-sm text-gray-500">Point of sale & payment processing</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          Sync sales data, inventory, and customer information from your Square POS system in real-time.
                        </p>

                        

                                                {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                                                        {!integrations.square ? (
                              <button 
                                onClick={() => connectIntegration('square')}
                                disabled={loadingStates.square}
                                className="px-4 py-2 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-sm font-normal hover:bg-[#6E4EFF]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingStates.square ? (
                                  <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting...
                                  </div>
                                ) : 'Connect'}
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm font-medium border border-green-200">
                                ✓ Connected
                              </span>
                            )}
                          </div>
                          
                          {/* Kebab Menu */}
                          <div className="relative kebab-menu-container">
                            <button
                              onClick={() => setOpenKebabMenu(openKebabMenu === 'square' ? null : 'square')}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="More options"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                              </svg>
                            </button>
                            
                            {openKebabMenu === 'square' && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button 
                                    onClick={() => {
                                      viewIntegrationDocs('square');
                                      setOpenKebabMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                    </svg>
                                    View Documentation
                                  </button>
                                  {integrations.square && (
                                    <>
                                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        Settings
                                      </button>
                                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        Sync Now
                                      </button>
                                      <div className="border-t border-gray-100">
                                        <button 
                                          onClick={() => {
                                            disconnectIntegration('square');
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
                    </div>

                      {/* Shopify */}
                      <div className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-[#6E4EFF]/30 hover:shadow-md transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                                                     <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                             <svg width="32" height="36" viewBox="0 0 64 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <g clipPath="url(#clip0_1177_7483)">
                                 <path d="M55.9433 14.3346C55.893 13.9696 55.5733 13.7676 55.309 13.7453C53.3605 13.5989 51.4119 13.4537 49.4633 13.3096C49.4633 13.3096 45.5865 9.46084 45.161 9.03484C44.7353 8.60909 43.9038 8.73859 43.581 8.83359C43.5335 8.84759 42.734 9.09434 41.4115 9.50359C40.1165 5.77709 37.831 2.35259 33.8103 2.35259C33.6993 2.35259 33.585 2.35709 33.4708 2.36359C32.3273 0.851336 30.9108 0.194336 29.6873 0.194336C20.321 0.194336 15.8463 11.9031 14.4433 17.8531C10.8038 18.9808 8.21828 19.7826 7.88803 19.8863C5.85653 20.5236 5.79228 20.5876 5.52553 22.5018C5.32478 23.9511 0.00927734 65.0583 0.00927734 65.0583L41.4288 72.8188L63.8713 67.9638C63.8713 67.9638 55.9928 14.6996 55.9433 14.3346ZM39.1223 10.2116L35.6175 11.2963C35.6188 11.0493 35.62 10.8063 35.62 10.5406C35.62 8.22459 35.2985 6.35984 34.7828 4.88159C36.8545 5.14159 38.2343 7.49884 39.1223 10.2116ZM32.2128 5.34084C32.7888 6.78409 33.1633 8.85534 33.1633 11.6503C33.1633 11.7933 33.162 11.9241 33.1608 12.0563C30.8815 12.7623 28.4048 13.5288 25.9225 14.2978C27.3163 8.91884 29.9288 6.32084 32.2128 5.34084ZM29.43 2.70659C29.8343 2.70659 30.2415 2.84384 30.6313 3.11209C27.6295 4.52459 24.412 8.08209 23.0533 15.1863L17.3318 16.9583C18.9233 11.5396 22.7025 2.70659 29.43 2.70659Z" fill="#95BF46"/>
                                 <path d="M55.3094 13.746C53.3609 13.5996 51.4123 13.4543 49.4637 13.3102C49.4637 13.3102 45.5869 9.46149 45.1614 9.03549C45.0022 8.87699 44.7874 8.79574 44.5629 8.76074L41.4312 72.819L63.8717 67.9645C63.8717 67.9645 55.9932 14.7002 55.9437 14.3352C55.8934 13.9702 55.5737 13.7682 55.3094 13.746Z" fill="#5E8E3E"/>
                                 <path d="M33.8104 26.146L31.0432 34.3775C31.0432 34.3775 28.6187 33.0835 25.6467 33.0835C21.2897 33.0835 21.0704 35.8178 21.0704 36.5068C21.0704 40.2663 30.8704 41.7068 30.8704 50.5128C30.8704 57.441 26.4762 61.9023 20.5512 61.9023C13.4412 61.9023 9.80518 57.4773 9.80518 57.4773L11.7089 51.1873C11.7089 51.1873 15.4464 54.396 18.6002 54.396C20.6609 54.396 21.4992 52.7735 21.4992 51.588C21.4992 46.684 13.4592 46.4653 13.4592 38.407C13.4592 31.6248 18.3272 25.0615 28.1537 25.0615C31.9399 25.0615 33.8104 26.146 33.8104 26.146Z" fill="white"/>
                               </g>
                               <defs>
                                 <clipPath id="clip0_1177_7483">
                                   <rect width="64" height="73" fill="white"/>
                                 </clipPath>
                               </defs>
                            </svg>
                          </div>
                                                    <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 mb-1">Shopify</h4>
                            <p className="text-sm text-gray-500">E-commerce platform</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          Connect your online store to sync products, orders, and customer data automatically across all channels.
                        </p>



                                                {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                                                        {!integrations.shopify ? (
                              <button 
                                onClick={() => connectIntegration('shopify')}
                                disabled={loadingStates.shopify}
                                className="px-4 py-2 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded-md text-sm font-normal hover:bg-[#6E4EFF]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingStates.shopify ? (
                                  <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting...
                                  </div>
                                ) : 'Connect'}
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm font-medium border border-green-200">
                                ✓ Connected
                              </span>
                            )}
                          </div>
                          
                          {/* Kebab Menu */}
                          <div className="relative kebab-menu-container">
                            <button
                              onClick={() => setOpenKebabMenu(openKebabMenu === 'shopify' ? null : 'shopify')}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="More options"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                              </svg>
                            </button>
                            
                            {openKebabMenu === 'shopify' && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                    </svg>
                                    View Documentation
                                  </button>
                                  {integrations.shopify && (
                                    <>
                                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        Settings
                                      </button>
                                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        Sync Now
                                      </button>
                                      <div className="border-t border-gray-100">
                                        <button 
                                          onClick={() => {
                                            setIntegrations(v => ({ ...v, shopify: !v.shopify }));
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
                      </div>
                      </div>
                    </div>

                  {/* All Integrations by Category */}
                  <div className="space-y-6">
                    {/* Payment Processing */}
                          <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          Payment Processing
                        </h3>
                        <span className="text-xs text-gray-500">2 available</span>
                          </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                {/* Stripe */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                                                                                                                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                 <svg width="24" height="10" viewBox="0 0 256 107" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <g clipPath="url(#clip0_1177_7493)">
                                     <path d="M256 55.04C256 36.8355 247.182 22.471 230.329 22.471C213.404 22.471 203.164 36.836 203.164 54.898C203.164 76.302 215.254 87.111 232.604 87.111C241.067 87.111 247.467 85.191 252.302 82.489V68.2665C247.467 70.6845 241.92 72.178 234.88 72.178C227.982 72.178 221.867 69.76 221.085 61.369H255.858C255.858 60.444 256 56.7465 256 55.04ZM220.871 48.2845C220.871 40.249 225.778 36.9065 230.258 36.9065C234.595 36.9065 239.218 40.249 239.218 48.2845H220.871ZM175.716 22.471C168.747 22.471 164.266 25.742 161.778 28.018L160.853 23.609H145.209V106.524L162.986 102.756L163.058 82.631C165.618 84.48 169.387 87.111 175.645 87.111C188.374 87.111 199.964 76.871 199.964 54.329C199.893 33.7065 188.16 22.471 175.715 22.471M171.449 71.4665C167.253 71.4665 164.763 69.9735 163.057 68.1245L162.986 41.742C164.835 39.68 167.395 38.258 171.449 38.258C177.92 38.258 182.4 45.511 182.4 54.8265C182.4 64.3555 177.991 71.4665 171.449 71.4665ZM120.746 18.2755L138.596 14.4355V0L120.746 3.769V18.2755ZM120.746 23.68H138.596V85.902H120.746V23.68ZM101.618 28.942L100.48 23.68H85.12V85.902H102.898V43.7335C107.093 38.258 114.204 39.2535 116.409 40.0355V23.68C114.133 22.8265 105.813 21.262 101.618 28.942ZM66.062 8.249L48.711 11.9465L48.64 68.9065C48.64 79.4315 56.5335 87.182 67.058 87.182C72.889 87.182 77.1555 86.1155 79.502 84.8355V70.4C77.227 71.3245 65.991 74.5955 65.991 64.071V38.8265H79.502V23.68H65.991L66.062 8.249ZM17.991 41.742C17.991 38.969 20.2665 37.902 24.036 37.902C29.44 37.902 36.2665 39.538 41.671 42.4535V25.742C35.769 23.3955 29.938 22.471 24.036 22.471C9.6 22.471 0 30.009 0 42.596C0 62.222 27.022 59.0935 27.022 67.556C27.022 70.8265 24.178 71.8935 20.1955 71.8935C14.2935 71.8935 6.7555 69.4755 0.782 66.2045V83.129C7.3955 85.9735 14.08 87.182 20.1955 87.182C34.9865 87.182 45.1555 79.858 45.1555 67.129C45.0845 45.938 17.991 49.7065 17.991 41.742Z" fill="#635BFF"/>
                                   </g>
                                   <defs>
                                     <clipPath id="clip0_1177_7493">
                                       <rect width="256" height="107" fill="white"/>
                                     </clipPath>
                                   </defs>
                                 </svg>
                        </div>
                              <div className="flex items-center gap-3 flex-1">
                          <div>
                                  <h4 className="text-sm font-medium text-gray-900">Stripe</h4>
                                  <p className="text-xs text-gray-500">Payment processing platform</p>
                          </div>
                                {!integrations.stripe ? (
                                                                    <button 
                                    onClick={() => setIntegrations(v => ({ ...v, stripe: !v.stripe }))}
                                    className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                  >
                                    Connect
                        </button>
                                ) : (
                                  <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                    ✓ Connected
                                  </span>
                                )}
                      </div>
                    </div>

                            {/* Kebab Menu */}
                            <div className="relative kebab-menu-container ml-2">
                              <button
                                onClick={() => setOpenKebabMenu(openKebabMenu === 'stripe' ? null : 'stripe')}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="More options"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                            </svg>
                              </button>
                              
                              {openKebabMenu === 'stripe' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                      </svg>
                                      View Documentation
                                    </button>
                                    {integrations.stripe && (
                                      <>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                          </svg>
                                          Settings
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                          </svg>
                                          Sync Now
                                        </button>
                                        <div className="border-t border-gray-100">
                                          <button 
                                            onClick={() => {
                                              setIntegrations(v => ({ ...v, stripe: !v.stripe }));
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
                    </div>

                                                {/* QuickBooks */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">qb</span>
                              </div>
                              <div className="flex items-center gap-3 flex-1">
                          <div>
                                  <h4 className="text-sm font-medium text-gray-900">QuickBooks</h4>
                                  <p className="text-xs text-gray-500">Accounting & financial management</p>
                          </div>
                                {!integrations.quickbooks ? (
                                                                    <button 
                                    onClick={() => setIntegrations(v => ({ ...v, quickbooks: !v.quickbooks }))}
                                    className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                  >
                                    Connect
                                  </button>
                                ) : (
                                  <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                    ✓ Connected
                                  </span>
                                )}
                      </div>
                    </div>

                            {/* Kebab Menu */}
                            <div className="relative kebab-menu-container ml-2">
                              <button
                                onClick={() => setOpenKebabMenu(openKebabMenu === 'quickbooks' ? null : 'quickbooks')}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="More options"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                            </svg>
                              </button>
                              
                              {openKebabMenu === 'quickbooks' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                      </svg>
                                      View Documentation
                                    </button>
                                    {integrations.quickbooks && (
                                      <>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                          </svg>
                                          Settings
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                          </svg>
                                          Sync Now
                                        </button>
                                        <div className="border-t border-gray-100">
                                          <button 
                                            onClick={() => {
                                              setIntegrations(v => ({ ...v, quickbooks: !v.quickbooks }));
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
                        </div>
                      </div>
                    </div>

                    {/* Point of Sale */}
                          <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          Point of Sale Systems
                        </h3>
                        <span className="text-xs text-gray-500">2 available</span>
                          </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                {/* Clover */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <div className="relative w-6 h-6">
                                  {/* Top-left leaf (filled) */}
                                  <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                                  {/* Top-right leaf (filled) */}
                                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                                  {/* Bottom-right leaf (filled) */}
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                                  {/* Bottom-left leaf (outline) */}
                                  <div className="absolute bottom-0 left-0 w-3 h-3 border-2 border-green-500 rounded-full bg-transparent"></div>
                        </div>
                              </div>
                              <div className="flex items-center gap-3 flex-1">
                          <div>
                                  <h4 className="text-sm font-medium text-gray-900">Clover POS</h4>
                                  <p className="text-xs text-gray-500">Point of sale system</p>
                          </div>
                                {!integrations.clover ? (
                                                                    <button 
                                    onClick={() => setIntegrations(v => ({ ...v, clover: !v.clover }))}
                                    className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                  >
                                    Connect
                                  </button>
                                ) : (
                                  <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                    ✓ Connected
                                  </span>
                                )}
                      </div>
                    </div>

                            {/* Kebab Menu */}
                            <div className="relative kebab-menu-container ml-2">
                              <button
                                onClick={() => setOpenKebabMenu(openKebabMenu === 'clover' ? null : 'clover')}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="More options"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                            </svg>
                              </button>
                              
                              {openKebabMenu === 'clover' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                      </svg>
                                      View Documentation
                                    </button>
                                    {integrations.clover && (
                                      <>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                          </svg>
                                          Settings
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                          </svg>
                                          Sync Now
                                        </button>
                                        <div className="border-t border-gray-100">
                                          <button 
                                            onClick={() => {
                                              setIntegrations(v => ({ ...v, clover: !v.clover }));
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
                    </div>

                                                {/* Toast */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M8 16h8M8 8h8M6 6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V6z" />
                                </svg>
                              </div>
                              <div className="flex items-center gap-3 flex-1">
                          <div>
                                  <h4 className="text-sm font-medium text-gray-900">Toast POS</h4>
                                  <p className="text-xs text-gray-500">Restaurant management system</p>
                          </div>
                                {!integrations.toast ? (
                                  <button 
                                    onClick={() => setIntegrations(v => ({ ...v, toast: !v.toast }))}
                                    className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                  >
                                    Connect
                                  </button>
                                ) : (
                                  <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                    ✓ Connected
                                  </span>
                                )}
                        </div>
                            </div>
                            
                            {/* Kebab Menu */}
                            <div className="relative kebab-menu-container ml-2">
                              <button
                                onClick={() => setOpenKebabMenu(openKebabMenu === 'toast' ? null : 'toast')}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="More options"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                              </button>
                              
                              {openKebabMenu === 'toast' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                      </svg>
                                      View Documentation
                                    </button>
                                    {integrations.toast && (
                                      <>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                          </svg>
                                          Settings
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                          </svg>
                                          Sync Now
                                        </button>
                                        <div className="border-t border-gray-100">
                                          <button 
                                            onClick={() => {
                                              setIntegrations(v => ({ ...v, toast: !v.toast }));
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
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help & Support Section */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mt-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Need help with integrations?</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Our team can help you set up integrations, troubleshoot issues, or recommend the best tools for your business.
                        </p>
                        <div className="flex gap-3">
                          <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                            View Documentation
                          </button>
                          <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                            Contact Support
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'user-management' && (
                <div className="space-y-4">
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
                    <div className="border border-gray-200 rounded-[4px] p-4 mb-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="w-full">
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                            placeholder="Enter full name" 
                            value={newMember.name} 
                            onChange={e => setNewMember({ ...newMember, name: e.target.value })} 
                          />
                  </div>

                        <div className="w-full">
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Email
                          </label>
                          <input 
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                            placeholder="Enter email address" 
                            value={newMember.email} 
                            onChange={e => setNewMember({ ...newMember, email: e.target.value })} 
                          />
                          </div>

                        <div className="w-full">
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                            placeholder="Enter phone number" 
                            value={newMember.phone} 
                            onChange={e => setNewMember({ ...newMember, phone: e.target.value })} 
                          />
                          </div>

                        <div className="w-full relative">
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-[4px] bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors flex items-center justify-between text-[14px] font-normal"
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
                          <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Employee ID
                          </label>
                          <input 
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
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

                                     <div className="border border-gray-200 rounded-[4px] overflow-hidden">
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
                                  <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                  </label>
                                  <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                                    placeholder="Enter full name" 
                                    value={editMember.name} 
                                    onChange={e => setEditMember({ ...editMember, name: e.target.value })} 
                                  />
                          </div>
                                
                                <div>
                                  <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                    Email
                                  </label>
                                  <input 
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                                    placeholder="Enter email address" 
                                    value={editMember.email} 
                                    onChange={e => setEditMember({ ...editMember, email: e.target.value })} 
                                  />
                        </div>

                                <div>
                                  <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                  </label>
                                  <input 
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
                                    placeholder="Enter phone number" 
                                    value={editMember.phone} 
                                    onChange={e => setEditMember({ ...editMember, phone: e.target.value })} 
                                  />
                                </div>

                                <div className="relative">
                                  <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                    Role <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setShowEditRoleDropdown(!showEditRoleDropdown)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-[4px] bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors flex items-center justify-between text-[14px] font-normal"
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
                                  <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                                    Employee ID
                                  </label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent transition-colors text-[14px] font-normal" 
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
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Login and Security</h2>
                  <p className="text-gray-600 text-sm">Manage your login credentials and security settings.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <button onClick={() => setShowChangePassword(!showChangePassword)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{showChangePassword ? 'Close' : 'Change'}</button>
                      </div>
                      {showChangePassword && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input type="password" className="px-3 py-2 border rounded-[4px] text-[14px] font-normal" placeholder="Current" value={passwords.current} onChange={e => setPasswords(v => ({ ...v, current: e.target.value }))} />
                          <input type="password" className="px-3 py-2 border rounded-[4px] text-[14px] font-normal" placeholder="New" value={passwords.next} onChange={e => setPasswords(v => ({ ...v, next: e.target.value }))} />
                          <input type="password" className="px-3 py-2 border rounded-[4px] text-[14px] font-normal" placeholder="Confirm" value={passwords.confirm} onChange={e => setPasswords(v => ({ ...v, confirm: e.target.value }))} />
                          <div className="md:col-span-3"><button onClick={() => setShowChangePassword(false)} className="bg-black text-white px-3 py-1 rounded-[4px] text-sm">Save password</button></div>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button onClick={() => setTwoFAEnabled(v => !v)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{twoFAEnabled ? 'Disable' : 'Enable'}</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-[4px] p-4">
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

                    <div className="border border-gray-200 rounded-[4px] p-4">
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
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Payments & Billing</h2>
                  <p className="text-gray-600 text-sm">Manage your payment methods and billing information.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Current Plan</h3>
                          <p className="text-sm text-gray-500">{plan} Plan {plan==='Pro' ? ' - $29/month' : ' - $0/month'}</p>
                        </div>
                        <button onClick={() => setPlan(p => p==='Pro' ? 'Basic' : 'Pro')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Change Plan</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                          <p className="text-sm text-gray-500">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
                        </div>
                        <button onClick={() => setPaymentMethod(v => ({ ...v, last4: v.last4==='4242' ? '1111' : '4242' }))} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Update</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-[4px] p-4">
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

                    <div className="border border-gray-200 rounded-[4px] p-4">
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
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
                  <p className="text-gray-600 text-sm">Manage your data and privacy settings.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Data Export</h3>
                          <p className="text-sm text-gray-500">Download a copy of your data in JSON format</p>
                        </div>
                        <button onClick={handleExportData} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Export</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-[4px] p-4">
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

                    <div className="border border-gray-200 rounded-[4px] p-4">
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

                    <div className="border border-red-200 rounded-[4px] p-4 bg-red-50">
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

      {/* Zapier Integration Modal */}
      {showZapierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Setup Zapier Integration</h3>
              <button 
                onClick={() => setShowZapierModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={zapierForm.webhookUrl}
                  onChange={(e) => setZapierForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="https://hooks.zapier.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Optional)</label>
                <input
                  type="password"
                  value={zapierForm.apiKey}
                  onChange={(e) => setZapierForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="Enter API key for authentication"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowZapierModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={setupZapierIntegration}
                disabled={loadingStates.zapier || !zapierForm.webhookUrl}
                className="flex-1 px-4 py-2 bg-[#6E4EFF] text-white rounded-md hover:bg-[#5D3EE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingStates.zapier ? 'Setting up...' : 'Setup Integration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Integration Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Configure Webhooks</h3>
              <button 
                onClick={() => setShowWebhookModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input
                  type="url"
                  value={webhookForm.endpoint}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, endpoint: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="https://your-server.com/webhook"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={webhookForm.secret}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, secret: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="Enter secret for webhook verification"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={setupWebhookIntegration}
                disabled={loadingStates.webhooks || !webhookForm.endpoint}
                className="flex-1 px-4 py-2 bg-[#6E4EFF] text-white rounded-md hover:bg-[#5D3EE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingStates.webhooks ? 'Configuring...' : 'Configure Webhook'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Integration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
              <button 
                onClick={() => setShowApiModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiForm.apiKey}
                  onChange={(e) => setApiForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="Enter your API key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  value={apiForm.rateLimit}
                  onChange={(e) => setApiForm(prev => ({ ...prev, rateLimit: parseInt(e.target.value) || 1000 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApiModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={setupApiIntegration}
                disabled={loadingStates.api || !apiForm.apiKey}
                className="flex-1 px-4 py-2 bg-[#6E4EFF] text-white rounded-md hover:bg-[#5D3EE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingStates.api ? 'Configuring...' : 'Enable API'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
