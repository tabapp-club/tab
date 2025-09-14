"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpdateIntegration, useIntegrations } from "@/hooks/useWorkflowData";

interface Integration {
  id: string;
  name: string;
  type: "whatsapp" | "sms";
  status: "connected" | "disconnected" | "error";
  provider: string;
  config: {
    apiKey?: string;
    webhookUrl?: string;
    phoneNumber?: string;
    senderId?: string;
  };
  lastSync: string;
  messageCount: number;
  errorRate: number;
}

export function IntegrationSettings() {
  const router = useRouter();
  const { data: integrationsData, isLoading } = useIntegrations();
  const updateIntegrationMutation = useUpdateIntegration();

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configStep, setConfigStep] = useState(0);
  const [configData, setConfigData] = useState<any>({});
  const [configErrors, setConfigErrors] = useState<any>({});


  // Mock data for development (will be replaced by API data)
  const mockIntegrations: Integration[] = [
    {
      id: "1",
      name: "WhatsApp Business API",
      type: "whatsapp",
      status: "connected",
      provider: "Meta",
      config: {
        apiKey: "wab_****_****_****",
        webhookUrl: "https://api.tabapp.com/webhook/whatsapp",
        phoneNumber: "+91 98765 43210"
      },
      lastSync: "2024-01-20 14:30:00",
      messageCount: 15420,
      errorRate: 0.2
    },
    {
      id: "2",
      name: "SMS Gateway",
      type: "sms",
      status: "connected",
      provider: "TextLocal",
      config: {
        apiKey: "tl_****_****_****",
        senderId: "TABAPP"
      },
      lastSync: "2024-01-20 14:25:00",
      messageCount: 8930,
      errorRate: 0.1
    }
  ];

  // Load integrations from API or use mock data
  useEffect(() => {
    if (integrationsData && integrationsData.length > 0) {
      // Use API data if available and not empty
      setIntegrations(integrationsData);
      if (!selectedIntegration) {
        setSelectedIntegration(integrationsData[0]);
      }
    } else if (!isLoading) {
      // Use mock data when API loading is complete
      setIntegrations(mockIntegrations);
      if (!selectedIntegration) {
        setSelectedIntegration(mockIntegrations[0]);
      }
    }
  }, [integrationsData, isLoading, selectedIntegration]);

  const providers = {
    whatsapp: [
      { value: "meta", label: "Meta WhatsApp Business API" },
      { value: "twilio", label: "Twilio WhatsApp API" },
      { value: "messagebird", label: "MessageBird WhatsApp API" }
    ],
    sms: [
      { value: "textlocal", label: "TextLocal" },
      { value: "twilio", label: "Twilio SMS" },
      { value: "msg91", label: "MSG91" },
      { value: "fast2sms", label: "Fast2SMS" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-[#10b981]";
      case "disconnected": return "bg-[#6b7280]";
      case "error": return "bg-[#ef4444]";
      default: return "bg-[#6b7280]";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected": return "Connected";
      case "disconnected": return "Disconnected";
      case "error": return "Error";
      default: return "Unknown";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "whatsapp": return "💬";
      case "sms": return "📱";
      default: return "🔗";
    }
  };

  const getIntegrationGuide = (type: string) => {
    switch (type) {
      case "whatsapp":
        return [
          "• Get API credentials from Meta Business",
          "• Verify your business phone number", 
          "• Set up webhook for message status",
          "• Test with sample messages"
        ];
      case "sms":
        return [
          "• Register with SMS provider",
          "• Get API key and sender ID",
          "• Configure delivery reports", 
          "• Set up rate limiting"
        ];
      default:
        return [];
    }
  };

  const getConfigurationSteps = (type: string) => {
    switch (type) {
      case "whatsapp":
        return [
          {
            title: "Meta Business Account Setup",
            description: "Set up your Meta Business account and get API credentials",
            fields: [
              {
                name: "businessAccountId",
                label: "Meta Business Account ID",
                type: "text",
                placeholder: "e.g., 123456789012345",
                help: "Find this in your Meta Business Manager under Business Settings > Business Info"
              },
              {
                name: "phoneNumberId",
                label: "Phone Number ID",
                type: "text", 
                placeholder: "e.g., 123456789012345",
                help: "Get this from WhatsApp Manager > Phone Numbers"
              },
              {
                name: "accessToken",
                label: "Permanent Access Token",
                type: "password",
                placeholder: "Enter your permanent access token",
                help: "Generate this in WhatsApp Manager > API Setup. Use permanent token, not temporary."
              }
            ]
          },
          {
            title: "Webhook Configuration",
            description: "Configure webhook for receiving message status updates",
            fields: [
              {
                name: "webhookUrl",
                label: "Webhook URL",
                type: "url",
                placeholder: "https://yourdomain.com/webhook/whatsapp",
                help: "This URL will receive message status updates from WhatsApp"
              },
              {
                name: "webhookVerifyToken",
                label: "Webhook Verify Token",
                type: "text",
                placeholder: "Enter a secure random string",
                help: "This token will be used to verify webhook requests from WhatsApp"
              }
            ]
          },
          {
            title: "Business Verification",
            description: "Verify your business and phone number",
            fields: [
              {
                name: "businessName",
                label: "Business Display Name",
                type: "text",
                placeholder: "Your Business Name",
                help: "This name will appear in WhatsApp conversations"
              },
              {
                name: "businessCategory",
                label: "Business Category",
                type: "select",
                options: [
                  "AUTOMOTIVE", "BEAUTY_SPA_AND_SALON", "CLOTHING_AND_APPAREL", 
                  "EDUCATION", "ENTERTAINMENT", "EVENT_PLANNING_AND_SERVICE",
                  "FINANCE_AND_BANKING", "FOOD_AND_GROCERY", "PUBLIC_SERVICE",
                  "HOTEL_AND_LODGING", "MEDICAL_AND_HEALTH", "NON_PROFIT",
                  "PROFESSIONAL_SERVICES", "SHOPPING_AND_RETAIL", "TRAVEL_AND_TRANSPORTATION",
                  "OTHER"
                ],
                help: "Select the category that best describes your business"
              }
            ]
          },
          {
            title: "Testing & Validation",
            description: "Test your configuration and validate setup",
            fields: [
              {
                name: "testPhoneNumber",
                label: "Test Phone Number",
                type: "tel",
                placeholder: "+1234567890",
                help: "Enter a phone number to send a test message"
              }
            ]
          }
        ];
      case "sms":
        return [
          {
            title: "SMS Provider Setup",
            description: "Configure your SMS gateway provider credentials",
            fields: [
              {
                name: "provider",
                label: "SMS Provider",
                type: "select",
                options: [
                  { value: "textlocal", label: "TextLocal" },
                  { value: "twilio", label: "Twilio" },
                  { value: "msg91", label: "MSG91" },
                  { value: "fast2sms", label: "Fast2SMS" },
                  { value: "custom", label: "Custom API" }
                ],
                help: "Select your SMS service provider"
              },
              {
                name: "apiKey",
                label: "API Key",
                type: "password",
                placeholder: "Enter your API key",
                help: "Get this from your SMS provider's dashboard"
              },
              {
                name: "apiSecret",
                label: "API Secret (if required)",
                type: "password",
                placeholder: "Enter your API secret",
                help: "Some providers require both API key and secret"
              }
            ]
          },
          {
            title: "Sender Configuration",
            description: "Configure sender ID and routing settings",
            fields: [
              {
                name: "senderId",
                label: "Sender ID",
                type: "text",
                placeholder: "TABAPP",
                help: "6-11 character alphanumeric sender ID (varies by country)"
              },
              {
                name: "countryCode",
                label: "Country Code",
                type: "select",
                options: [
                  { value: "IN", label: "India (+91)" },
                  { value: "US", label: "United States (+1)" },
                  { value: "GB", label: "United Kingdom (+44)" },
                  { value: "AU", label: "Australia (+61)" },
                  { value: "CA", label: "Canada (+1)" },
                  { value: "DE", label: "Germany (+49)" },
                  { value: "FR", label: "France (+33)" },
                  { value: "SG", label: "Singapore (+65)" }
                ],
                help: "Select the primary country for SMS delivery"
              }
            ]
          },
          {
            title: "Delivery & Rate Limits",
            description: "Configure delivery reports and rate limiting",
            fields: [
              {
                name: "deliveryReports",
                label: "Enable Delivery Reports",
                type: "checkbox",
                help: "Receive delivery status updates for sent messages"
              },
              {
                name: "rateLimit",
                label: "Rate Limit (messages per minute)",
                type: "number",
                placeholder: "100",
                help: "Maximum messages to send per minute to avoid spam filters"
              },
              {
                name: "webhookUrl",
                label: "Delivery Report Webhook URL",
                type: "url",
                placeholder: "https://yourdomain.com/webhook/sms",
                help: "URL to receive delivery status updates"
              }
            ]
          },
          {
            title: "Testing & Validation",
            description: "Test your SMS configuration",
            fields: [
              {
                name: "testPhoneNumber",
                label: "Test Phone Number",
                type: "tel",
                placeholder: "+1234567890",
                help: "Enter a phone number to send a test SMS"
              },
              {
                name: "testMessage",
                label: "Test Message",
                type: "textarea",
                placeholder: "Hello! This is a test message from your SMS integration.",
                help: "Customize your test message"
              }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigData(integration.config || {});
    setConfigStep(0);
    setConfigErrors({});
    setIsConfiguring(true);
  };

  const validateStep = (stepData: any, stepIndex: number) => {
    const errors: any = {};
    const steps = getConfigurationSteps(selectedIntegration?.type || '');
    const currentStep = steps[stepIndex];
    
    if (!currentStep) return errors;

    currentStep.fields.forEach((field: any) => {
      const value = stepData[field.name];
      
      if (field.type === 'text' || field.type === 'password' || field.type === 'url' || field.type === 'tel') {
        if (!value || value.trim() === '') {
          errors[field.name] = `${field.label} is required`;
        }
      }
      
      if (field.type === 'url' && value) {
        try {
          new URL(value);
        } catch {
          errors[field.name] = 'Please enter a valid URL';
        }
      }
      
      if (field.type === 'tel' && value) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(value)) {
          errors[field.name] = 'Please enter a valid phone number with country code';
        }
      }
    });
    
    return errors;
  };

  const handleNextStep = () => {
    const steps = getConfigurationSteps(selectedIntegration?.type || '');
    const errors = validateStep(configData, configStep);
    
    if (Object.keys(errors).length > 0) {
      setConfigErrors(errors);
      return;
    }
    
    setConfigErrors({});
    if (configStep < steps.length - 1) {
      setConfigStep(configStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (configStep > 0) {
      setConfigStep(configStep - 1);
      setConfigErrors({});
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setConfigData({ ...configData, [fieldName]: value });
    if (configErrors[fieldName]) {
      setConfigErrors({ ...configErrors, [fieldName]: '' });
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: "disconnected" as const }
        : integration
    ));
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(integration =>
        integration.id === selectedIntegration.id
          ? { 
              ...integration, 
              config: configData,
              status: "connected" as const,
              lastSync: new Date().toLocaleString()
            }
          : integration
      ));
      setIsConfiguring(false);
    }
  };

  const renderConfigForm = () => {
    if (!selectedIntegration) return null;

    const steps = getConfigurationSteps(selectedIntegration.type);
    const currentStep = steps[configStep];
    
    if (!currentStep) return null;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= configStep 
                    ? 'bg-[#6E4EFF] text-white' 
                    : 'bg-[#e5e7eb] text-[#6b7280]'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < configStep ? 'bg-[#6E4EFF]' : 'bg-[#e5e7eb]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-[#6b7280]">
            Step {configStep + 1} of {steps.length}
          </span>
        </div>

        {/* Step Title and Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2a2a2f] mb-2">
            {currentStep.title}
          </h3>
          <p className="text-sm text-[#6b7280]">
            {currentStep.description}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {currentStep.fields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                {field.label}
                {field.type !== 'checkbox' && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={configData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${
                    configErrors[field.name] ? 'border-red-500' : 'border-[#d1d5db]'
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option: any) => (
                    <option key={option.value || option} value={option.value || option}>
                      {option.label || option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={configData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full border rounded px-3 py-2 ${
                    configErrors[field.name] ? 'border-red-500' : 'border-[#d1d5db]'
                  }`}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configData[field.name] || false}
                    onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-[#6b7280]">{field.help}</span>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={configData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full border rounded px-3 py-2 ${
                    configErrors[field.name] ? 'border-red-500' : 'border-[#d1d5db]'
                  }`}
                />
              )}
              
              {field.help && field.type !== 'checkbox' && (
                <p className="text-xs text-[#6b7280] mt-1">{field.help}</p>
              )}
              
              {configErrors[field.name] && (
                <p className="text-xs text-red-500 mt-1">{configErrors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Integration Settings</h2>
          <p className="text-sm text-[#6b7280]">Connect and configure your communication channels</p>
        </div>
      </div>


      {/* Integration Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e7eb] p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(integration.type)}</span>
                <div>
                  <h3 className="font-semibold text-[#2a2a2f]">{integration.name}</h3>
                  <p className="text-sm text-[#6b7280]">{integration.provider}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`}></div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Status:</span>
                <span className={`font-medium ${
                  integration.status === "connected" ? "text-[#10b981]" :
                  integration.status === "error" ? "text-[#ef4444]" :
                  "text-[#6b7280]"
                }`}>
                  {getStatusText(integration.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Messages Sent:</span>
                <span className="font-medium text-[#2a2a2f]">
                  {integration.messageCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Error Rate:</span>
                <span className={`font-medium ${
                  integration.errorRate < 1 ? "text-[#10b981]" : "text-[#ef4444]"
                }`}>
                  {integration.errorRate}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Last Sync:</span>
                <span className="font-medium text-[#2a2a2f]">{integration.lastSync}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {integration.status === "connected" ? (
                <>
                  <button
                    onClick={() => handleConnect(integration)}
                    className="flex-1 border border-[#d1d5db] text-[#6b7280] px-3 py-2 rounded hover:bg-[#f9fafb] transition-colors text-sm"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="flex-1 bg-[#ef4444] text-white px-3 py-2 rounded hover:bg-[#dc2626] transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration)}
                  className="w-full bg-[#6E4EFF] text-white px-3 py-2 rounded hover:bg-[#5a3fd9] transition-colors text-sm"
                >
                  Connect
                </button>
              )}
            </div>

            {/* Integration Guide */}
            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
              <h4 className="font-medium text-[#2a2a2f] mb-2 text-sm">Setup Guide</h4>
              <ul className="text-xs text-[#6b7280] space-y-1">
                {getIntegrationGuide(integration.type).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        </div>
      )}


      {/* Configuration Modal */}
      {isConfiguring && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#2a2a2f]">
                  Configure {selectedIntegration.name}
                </h3>
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="text-[#6b7280] hover:text-[#2a2a2f] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {renderConfigForm()}
            </div>
            
            <div className="p-6 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  disabled={configStep === 0}
                  className={`px-4 py-2 rounded transition-colors ${
                    configStep === 0
                      ? 'text-[#9ca3af] cursor-not-allowed'
                      : 'text-[#6b7280] hover:text-[#2a2a2f] hover:bg-white'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsConfiguring(false)}
                    className="border border-[#d1d5db] text-[#6b7280] px-4 py-2 rounded hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {configStep === getConfigurationSteps(selectedIntegration.type).length - 1 ? (
                    <button
                      onClick={handleSaveConfig}
                      className="bg-[#6E4EFF] text-white px-6 py-2 rounded hover:bg-[#5a3fd9] transition-colors"
                    >
                      Complete Setup
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      className="bg-[#6E4EFF] text-white px-6 py-2 rounded hover:bg-[#5a3fd9] transition-colors"
                    >
                      Next Step
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
