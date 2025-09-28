"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileHeaderButton } from "@/components/MobileHeaderButton";
import { useSidebar } from "@/components/SidebarContext";

/**
 * SettingsContent component with URL routing support
 *
 * Available URLs:
 * - /settings?section=account-settings (default)
 * - /settings?section=preferences
 * - /settings?section=integrations
 * - /settings?section=user-management
 * - /settings?section=login-security
 * - /settings?section=payments-billing
 * - /settings?section=data-privacy
 * - /settings?section=help-support
 */
export function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('user-profile');
  const [activeSection, setActiveSection] = useState('account-settings');
  const [showContent, setShowContent] = useState(false);
  
  // Help & Support form state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.dropdown-container')) {
          setCategoryDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownOpen]);

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

  // Help & Support dropdown options
  const categoryOptions = [
    { value: 'account', label: 'Account & Billing' },
    { value: 'campaigns', label: 'Campaign Management' },
    { value: 'analytics', label: 'Analytics & Reports' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' }
  ];

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
    // Additional business profile fields
    businessType: '',
    website: '',
    description: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    foundedYear: '',
    employeeCount: '',
    termsAndConditions: '',
    privacyPolicy: '',
    refundPolicy: '',
    shippingPolicy: '',
    // POS Details
    posSystem: '',
    posVersion: '',
    posProvider: '',
    posSerialNumber: '',
    posInstallationDate: '',
    posLicenseKey: '',
    posTerminalId: '',
  });
  const [savedProfile, setSavedProfile] = useState(profile);
  const [savedBusiness, setSavedBusiness] = useState(business);

  // Preferences
  const [prefs, setPrefs] = useState({ email: true, push: false, marketing: true });


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
    chromeExtension: false,
    chromeAnalytics: false,
    localAgent: false,
    xero: false,
    freshbooks: false,
  });

  // Manual integrations state
  const [manualIntegrations, setManualIntegrations] = useState({
    zapier: { connected: false, webhookUrl: '', apiKey: '' },
    webhooks: { enabled: false, endpoints: [] as string[], secret: '' },
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
      toast: 'https://developer.toasttab.com/docs',
      xero: 'https://developer.xero.com/documentation',
      freshbooks: 'https://developers.freshbooks.com/docs'
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

  // Handle URL parameters for section navigation
  useEffect(() => {
    const section = searchParams.get('section');
    const tab = searchParams.get('tab');
    const validSections = ['account-settings', 'data-privacy', 'help-support'];
    const validTabs = ['user-profile', 'business-profile'];

    if (section && validSections.includes(section)) {
      setActiveSection(section);
      // On mobile, show content when there's a section parameter
      if (isMobile) {
        setShowContent(true);
      }
    } else if (isMobile) {
      // On mobile, if no section parameter, show the settings menu
      setShowContent(false);
    }

    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, isMobile]);

  // Function to update URL when section changes
  const updateURL = (section: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', section);
    // Clear tab when changing sections (except for account-settings)
    if (section !== 'account-settings') {
      params.delete('tab');
    }
    router.push(`/settings?${params.toString()}`, { scroll: false });
  };

  // Function to update URL when tab changes
  const updateTabURL = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/settings?${params.toString()}`, { scroll: false });
  };

  // Function to get section title and description
  const getSectionInfo = (section: string) => {
    const sectionMap = {
      'account-settings': {
        title: 'Account settings',
        description: 'Personal & business profile information'
      },
      'integrations': {
        title: 'Integrations',
        description: 'Connect POS systems & third-party apps'
      },
      'user-management': {
        title: 'User management',
        description: 'Manage team members & access permissions'
      },
      'login-security': {
        title: 'Login and security',
        description: 'Password & session management'
      },
      'payments-billing': {
        title: 'Payments & Billing',
        description: 'Subscription plans & payment methods'
      },
      'data-privacy': {
        title: 'Data & Privacy',
        description: 'Privacy settings & cookie preferences'
      },
      'help-support': {
        title: 'Help & Support',
        description: 'Help center, documentation & contact support'
      }
    };

    return sectionMap[section as keyof typeof sectionMap] || sectionMap['account-settings'];
  };

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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showSessions, setShowSessions] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  // Billing
  const [plan, setPlan] = useState<'Pro' | 'Basic'>('Pro');
  const [paymentMethod, setPaymentMethod] = useState({ brand: 'Visa', last4: '4242' });
  const [showInvoices, setShowInvoices] = useState(false);

  // Data & Privacy

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton 
          onClick={isMobile && showContent ? () => {
            setShowContent(false);
            // Clear URL parameters when going back to settings menu
            router.push('/settings', { scroll: false });
          } : undefined}
        />
      </header>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden h-screen bg-[#f6f6f6]">
        <div className="pt-12 lg:pt-0 h-full flex">
          {/* Settings Sidebar */}
          <div className={`${isMobile ? (showContent ? 'hidden' : 'w-full') : 'w-[272px]'} ${isMobile ? 'bg-[#f6f6f6]' : 'bg-white'} border-r border-[#e9e9e9] px-4 py-0 pt-8 h-full transition-all duration-300 overflow-y-auto ${
            isMobile 
              ? 'relative top-0 left-0' // Mobile: relative positioning, full width
              : actualIsCollapsed 
                ? 'fixed top-0 left-16' 
                : 'fixed top-0 left-[232px]'
          }`}>


            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveSection('account-settings');
                  updateURL('account-settings');
                  if (isMobile) setShowContent(true);
                }}
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
                onClick={() => {
                  setActiveSection('data-privacy');
                  updateURL('data-privacy');
                  if (isMobile) setShowContent(true);
                }}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'data-privacy'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Data & Privacy</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Privacy settings & cookie preferences
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveSection('help-support');
                  updateURL('help-support');
                  if (isMobile) setShowContent(true);
                }}
                className={`w-full px-2 py-2 rounded-[4px] text-left transition-colors group ${
                  activeSection === 'help-support'
                    ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff]'
                    : 'text-[#2a2a2f] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Help & Support</span>
                  <span className="text-xs text-gray-500 mt-0 group-hover:text-gray-600">
                    Help center, documentation & contact support
                  </span>
                </div>
              </button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className={`${isMobile ? (showContent ? 'flex-1' : 'hidden') : 'flex-1'} flex flex-col h-full transition-all duration-300 ${
            isMobile 
              ? 'ml-0' 
              : actualIsCollapsed 
                ? 'ml-[256px]' 
                : 'ml-[256px]'
          }`}>
            {/* Fixed Header Area */}
            <div className="px-2 pt-2 pb-3 bg-[#f6f6f6] border-b border-[#e9e9e9] -mt-2">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-[20px] leading-[28px] tracking-[-0.1px] font-bold text-[#2a2a2f]">
                  {getSectionInfo(activeSection).title}
              </h1>
                <p className="text-[#626266] text-[14px] leading-[20px] tracking-[-0.1px] mt-1 font-normal">
                  {getSectionInfo(activeSection).description}
                </p>
            </div>

            {/* Tab Navigation */}
              {activeSection === 'account-settings' && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('user-profile');
                  updateTabURL('user-profile');
                }}
                    className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
                  activeTab === 'user-profile'
                        ? 'bg-[rgba(110,78,255,0.05)] text-[#6e4eff] border-[#6e4eff]'
                        : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#6E4EFF0D] hover:text-[#6E4EFF] hover:border-[#6E4EFF]'
                }`}
              >
                User Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab('business-profile');
                  updateTabURL('business-profile');
                }}
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

            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-2 py-3">
              {/* Main container - Only show for user profile or other sections */}
              {!(activeSection === 'account-settings' && activeTab === 'business-profile') && (
              <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 min-h-[400px]">
                  {activeSection === 'account-settings' && activeTab === 'user-profile' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-0">
                          Personal Information
                    </h2>
                    <p className="text-[#626266] text-[12px] leading-[16px] tracking-[-0.1px] font-normal">
                          Update your personal details and contact information.
                    </p>
                  </div>

                      {/* User Profile Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                            Full Name
                      </label>
                      <input
                        type="text"
                            value={profile.name}
                            onChange={(e) => setProfile(v => ({ ...v, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                            placeholder="Enter your full name"
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

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => { setSavedProfile(profile); setSavedBusiness(business); }}
                        className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded-[4px] font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out"
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


              {false && activeSection === 'integrations' && (
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
                          Automate workflows by connecting Tab with 5000+ apps through Zapier&apos;s no-code platform.
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


                  {/* All Integrations by Category */}
                  <div className="space-y-6">
                    {/* Chrome Extensions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          Chrome Extensions
                        </h3>
                        <span className="text-xs text-gray-500">2 available</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Tab Data Capture Extension */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Tab Data Capture</h4>
                                <p className="text-xs text-gray-500">Capture customer data from any website</p>
                              </div>
                              {!integrations.chromeExtension ? (
                                <button
                                  onClick={() => setIntegrations(v => ({ ...v, chromeExtension: !v.chromeExtension }))}
                                  className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                >
                                  Install
                                </button>
                              ) : (
                                <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                  ✓ Installed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tab Analytics Extension */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Tab Analytics</h4>
                                <p className="text-xs text-gray-500">Track website performance and user behavior</p>
                              </div>
                              {!integrations.chromeAnalytics ? (
                                <button
                                  onClick={() => setIntegrations(v => ({ ...v, chromeAnalytics: !v.chromeAnalytics }))}
                                  className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                >
                                  Install
                                </button>
                              ) : (
                                <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                  ✓ Installed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Local Agent */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          Local Agent
                        </h3>
                        <span className="text-xs text-gray-500">1 available</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Tab Desktop Agent */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Tab Desktop Agent</h4>
                                <p className="text-xs text-gray-500">Local data processing and synchronization</p>
                              </div>
                              {!integrations.localAgent ? (
                                <button
                                  onClick={() => setIntegrations(v => ({ ...v, localAgent: !v.localAgent }))}
                                  className="ml-auto px-3 py-1 bg-white text-[#6E4EFF] border border-[#6E4EFF] rounded text-xs font-medium hover:bg-[#6E4EFF]/10 transition-colors"
                                >
                                  Download
                                </button>
                              ) : (
                                <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">
                                  ✓ Installed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accounting Software */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                          Accounting Software
                        </h3>
                        <span className="text-xs text-gray-500">3 available</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* QuickBooks */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QB</span>
                              </div>
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
                        </div>

                        {/* Xero */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Xero</h4>
                                <p className="text-xs text-gray-500">Cloud-based accounting software</p>
                              </div>
                              {!integrations.xero ? (
                                <button
                                  onClick={() => setIntegrations(v => ({ ...v, xero: !v.xero }))}
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
                        </div>

                        {/* FreshBooks */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">FreshBooks</h4>
                                <p className="text-xs text-gray-500">Small business accounting & invoicing</p>
                              </div>
                              {!integrations.freshbooks ? (
                                <button
                                  onClick={() => setIntegrations(v => ({ ...v, freshbooks: !v.freshbooks }))}
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
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateways */}
                          <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          Payment Gateways
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
                                  <p className="text-xs text-gray-500">Payment gateway</p>
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

              {false && activeSection === 'user-management' && (
                <div className="space-y-4">
                  <div className="flex justify-end items-center">
                      <button onClick={() => setShowAddMember(!showAddMember)} className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out">
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
                          className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out w-full sm:w-auto"
                        >
                          Add Employee
                        </button>
                        <button
                          onClick={() => {
                            setNewMember({ name: '', email: '', phone: '', role: 'Member', employeeId: '' });
                            setShowAddMember(false);
                            setShowRoleDropdown(false);
                          }}
                          className="h-9 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto"
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
                                  className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out w-full sm:w-auto"
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingMember(null);
                                    setShowEditRoleDropdown(false);
                                  }}
                                  className="h-9 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto"
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

              {false && activeSection === 'login-security' && (
                <div className="space-y-4">
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

              {false && activeSection === 'payments-billing' && (
                <div className="space-y-4">
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

                  </div>
                </div>
              )}

              {activeSection === 'data-privacy' && (
                <div className="space-y-3">
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
                </div>
              )}

              {activeSection === 'help-support' && (
                <div className="space-y-6">
                  {/* Help Center Section */}
                  {false && <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Help Center</h2>
                      <p className="text-gray-600 text-sm">Find answers to common questions and learn how to use our platform.</p>
                    </div>

                    {/* Quick Help Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Getting Started</h3>
                            <p className="text-xs text-gray-500 mb-2">Learn the basics of our platform</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Guide →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Campaign Management</h3>
                            <p className="text-xs text-gray-500 mb-2">Create and manage your campaigns</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Guide →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Analytics & Reports</h3>
                            <p className="text-xs text-gray-500 mb-2">Understand your performance data</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Guide →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Integrations</h3>
                            <p className="text-xs text-gray-500 mb-2">Connect third-party tools</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Guide →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Troubleshooting</h3>
                            <p className="text-xs text-gray-500 mb-2">Common issues and solutions</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Guide →
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-[4px] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">API Documentation</h3>
                            <p className="text-xs text-gray-500 mb-2">Developer resources and guides</p>
                            <button className="text-xs font-medium text-[#6E4EFF] hover:text-[#5D3EE8] transition-colors">
                              View Docs →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Help */}
                    <div className="border border-gray-200 rounded-[4px] p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Search help articles, guides, and FAQs..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                          />
                        </div>
                        <button className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>}

                  {/* Contact Support Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
                      <p className="text-gray-600 text-sm">Get personalized help from our support team.</p>
                    </div>

                    {/* Support Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact Numbers */}
                      <div className="border border-gray-200 rounded-[4px] p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Contact Numbers</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Call our support team directly for immediate assistance.
                            </p>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">General Support</span>
                                <span className="text-xs font-medium text-gray-900">+91 9618610909</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Technical Support</span>
                                <span className="text-xs font-medium text-gray-900">+91 897771997</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Available 24/7</span>
                            </div>
                            <button className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out">
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Email Support */}
                      <div className="border border-gray-200 rounded-[4px] p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Email Support</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Send us a detailed message and we&apos;ll respond within 24 hours.
                            </p>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-xs text-gray-500">connect@tribly.ai</span>
                            </div>
                            <button className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out">
                              Send Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Support Form */}
                    <div className="border border-gray-200 rounded-[4px] p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Submit a Support Request</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Brief description of your issue"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <div className="relative dropdown-container">
                            <button
                              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors text-sm ${
                                selectedCategory
                                  ? 'border-[#7856ff] bg-[#7856ff]/5'
                                  : 'border-gray-300'
                              }`}
                            >
                              <span className="text-sm font-normal text-[#2a2a2f] truncate">
                                {selectedCategory || 'Select category'}
                              </span>
                              <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
                                <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.5 1.5L3.75 3.75L6 1.5" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </button>
                            {categoryDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e9e9e9] rounded-md shadow-lg z-50">
                                <div className="py-2">
                                  {categoryOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => {
                                        setSelectedCategory(option.label);
                                        setCategoryDropdownOpen(false);
                                      }}
                                      className="w-full px-4 py-2 text-left text-[14px] text-[#2a2a2f] hover:bg-gray-50 cursor-pointer"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Please provide detailed information about your issue or question..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Attachments (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-xs text-gray-500 mt-2">Drag and drop files here, or click to browse</p>
                            <p className="text-xs text-gray-400">Max file size: 10MB</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-6 rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out">
                            Submit Request
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
              </div>
              )}


              {/* Basic Information Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={business.businessName}
                          onChange={(e) => setBusiness(v => ({ ...v, businessName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Enter your brand name"
                          required
                        />
            </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Business Type
                        </label>
                        <select
                          value={business.businessType || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, businessType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        >
                          <option value="">Select business type</option>
                          <option value="retail">Retail</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="services">Services</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="consulting">Consulting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={business.website || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, website: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="https://www.yourwebsite.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Business Description
                      </label>
                      <textarea
                        value={business.description || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={3}
                        placeholder="Describe your business..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Contact Information</h3>
                  <div className="space-y-4">
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
                            <div className="flex">
                              <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-[4px] text-[14px] font-normal text-gray-700">
                                +91
                              </div>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                  const newPhones = [...business.businessPhones];
                                  newPhones[index] = e.target.value;
                                  setBusiness(v => ({ ...v, businessPhones: newPhones }));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                                placeholder="9876543210"
                              />
                            </div>
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
                  </div>
                </div>
              )}

              {/* Business Address Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Business Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Street Address
                      </label>
                      <textarea
                        value={business.businessAddress}
                        onChange={(e) => setBusiness(v => ({ ...v, businessAddress: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={3}
                        placeholder="123 Main Street, Building Name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={business.city || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={business.state || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={business.zipCode || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, zipCode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="400001"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={business.country || 'India'}
                        onChange={(e) => setBusiness(v => ({ ...v, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Registration Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Business Registration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={business.gstNumber}
                          onChange={(e) => setBusiness(v => ({ ...v, gstNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="22ABCDE1234F1Z5"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          value={business.businessPAN}
                          onChange={(e) => setBusiness(v => ({ ...v, businessPAN: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="ABCDE1234F"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Business Registration Number
                      </label>
                      <input
                        type="text"
                        value={business.businessId}
                        onChange={(e) => setBusiness(v => ({ ...v, businessId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="U74999MH2014PTC123456"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* POS System Details Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">POS System Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          POS System
                        </label>
                        <select
                          value={business.posSystem || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posSystem: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        >
                          <option value="">Select POS system</option>
                          <option value="square">Square</option>
                          <option value="shopify-pos">Shopify POS</option>
                          <option value="clover">Clover</option>
                          <option value="toast">Toast</option>
                          <option value="lightspeed">Lightspeed</option>
                          <option value="revel">Revel Systems</option>
                          <option value="ncr-silver">NCR Silver</option>
                          <option value="vend">Vend</option>
                          <option value="quickbooks-pos">QuickBooks POS</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          POS Provider
                        </label>
                        <input
                          type="text"
                          value={business.posProvider || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posProvider: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Enter POS provider name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Version
                        </label>
                        <input
                          type="text"
                          value={business.posVersion || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posVersion: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="e.g., v2.1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Terminal ID
                        </label>
                        <input
                          type="text"
                          value={business.posTerminalId || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posTerminalId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Enter terminal ID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Serial Number
                        </label>
                        <input
                          type="text"
                          value={business.posSerialNumber || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posSerialNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="Enter serial number"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Installation Date
                        </label>
                        <input
                          type="date"
                          value={business.posInstallationDate || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, posInstallationDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        License Key
                      </label>
                      <input
                        type="text"
                        value={business.posLicenseKey || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, posLicenseKey: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="Enter license key (if applicable)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Banking Information Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Banking Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={business.bankName || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, bankName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="State Bank of India"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={business.accountNumber || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, accountNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="1234567890"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={business.ifscCode || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, ifscCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        placeholder="SBIN0001234"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Founded Year
                        </label>
                        <input
                          type="number"
                          value={business.foundedYear || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, foundedYear: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                          placeholder="2020"
                          min="1900"
                          max="2024"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                          Employee Count
                        </label>
                        <select
                          value={business.employeeCount || ''}
                          onChange={(e) => setBusiness(v => ({ ...v, employeeCount: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        >
                          <option value="">Select employee count</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="500+">500+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary POC Details Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
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

                  {/* Save buttons for POC Details */}
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => { setSavedProfile(profile); setSavedBusiness(business); }}
                      className="h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 rounded-[4px] font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out"
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
              )}

              {/* Terms and Policies Card - Outside main container */}
              {activeSection === 'account-settings' && activeTab === 'business-profile' && (
                <div className="bg-white border border-[#e9e9e9] rounded-[4px] p-4 mt-4">
                  <h3 className="text-[16px] font-semibold text-[#2a2a2f] tracking-[-0.1px] mb-4">Terms and Policies</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Terms and Conditions
                      </label>
                      <textarea
                        value={business.termsAndConditions || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, termsAndConditions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={4}
                        placeholder="Enter your terms and conditions..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Privacy Policy
                      </label>
                      <textarea
                        value={business.privacyPolicy || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, privacyPolicy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={4}
                        placeholder="Enter your privacy policy..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Refund Policy
                      </label>
                      <textarea
                        value={business.refundPolicy || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, refundPolicy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={4}
                        placeholder="Enter your refund policy..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[-0.1px] font-normal text-gray-700 mb-1">
                        Shipping Policy
                      </label>
                      <textarea
                        value={business.shippingPolicy || ''}
                        onChange={(e) => setBusiness(v => ({ ...v, shippingPolicy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[14px] font-normal"
                        rows={4}
                        placeholder="Enter your shipping policy..."
                      />
                    </div>
                  </div>
                </div>
              )}

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
