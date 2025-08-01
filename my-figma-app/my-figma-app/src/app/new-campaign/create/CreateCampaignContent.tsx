"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import Image from "next/image";

interface CampaignField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'select' | 'date';
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface CampaignTemplate {
  id: string;
  title: string;
  description: string;
  fields: CampaignField[];
  previewImage: string;
}

const campaignTemplates: Record<string, CampaignTemplate> = {
  advertise: {
    id: 'advertise',
    title: 'Professional Advertising Campaign',
    description: 'Create compelling advertisements to reach new customers',
    previewImage: '/advertise.png',
    fields: [
      {
        id: 'campaign_title',
        label: 'Campaign Title',
        type: 'text',
        placeholder: 'Enter your campaign title',
        required: true
      },
      {
        id: 'ad_title',
        label: 'Advertisement Headline',
        type: 'text',
        placeholder: 'Enter compelling headline',
        required: true
      },
      {
        id: 'body_text',
        label: 'Main Content',
        type: 'textarea',
        placeholder: 'Write your main advertisement content',
        required: true
      },
      {
        id: 'supporting_text',
        label: 'Supporting Text',
        type: 'textarea',
        placeholder: 'Additional details or benefits',
        required: false
      },
      {
        id: 'call_to_action',
        label: 'Call to Action',
        type: 'text',
        placeholder: 'e.g., Shop Now, Learn More',
        required: true
      },
      {
        id: 'logo',
        label: 'Brand Logo',
        type: 'file',
        placeholder: 'Upload your brand logo',
        required: false
      },
      {
        id: 'expiry_date',
        label: 'Campaign End Date',
        type: 'date',
        placeholder: 'Select end date',
        required: false
      }
    ]
  },
  engagement: {
    id: 'engagement',
    title: 'Customer Engagement Strategy',
    description: 'Build stronger customer relationships',
    previewImage: '/engagement.png',
    fields: [
      {
        id: 'campaign_title',
        label: 'Campaign Title',
        type: 'text',
        placeholder: 'Enter your campaign title',
        required: true
      },
      {
        id: 'message_title',
        label: 'Message Title',
        type: 'text',
        placeholder: 'Enter message title',
        required: true
      },
      {
        id: 'personalized_content',
        label: 'Personalized Content',
        type: 'textarea',
        placeholder: 'Write personalized engagement message',
        required: true
      },
      {
        id: 'call_to_action',
        label: 'Call to Action',
        type: 'text',
        placeholder: 'e.g., Reply, Share, Visit',
        required: true
      },
      {
        id: 'logo',
        label: 'Brand Logo',
        type: 'file',
        placeholder: 'Upload your brand logo',
        required: false
      },
      {
        id: 'expiry_date',
        label: 'Campaign End Date',
        type: 'date',
        placeholder: 'Select end date',
        required: false
      }
    ]
  },
  retention: {
    id: 'retention',
    title: 'Customer Retention Program',
    description: 'Keep existing customers engaged',
    previewImage: '/retention.png',
    fields: [
      {
        id: 'campaign_title',
        label: 'Campaign Title',
        type: 'text',
        placeholder: 'Enter your campaign title',
        required: true
      },
      {
        id: 'loyalty_message',
        label: 'Loyalty Program Message',
        type: 'textarea',
        placeholder: 'Write your loyalty program message',
        required: true
      },
      {
        id: 'reward_description',
        label: 'Reward Description',
        type: 'text',
        placeholder: 'Describe the reward or offer',
        required: true
      },
      {
        id: 'call_to_action',
        label: 'Call to Action',
        type: 'text',
        placeholder: 'e.g., Claim Reward, Redeem',
        required: true
      },
      {
        id: 'logo',
        label: 'Brand Logo',
        type: 'file',
        placeholder: 'Upload your brand logo',
        required: false
      },
      {
        id: 'expiry_date',
        label: 'Offer Expiry Date',
        type: 'date',
        placeholder: 'Select expiry date',
        required: true
      }
    ]
  },
  feedback: {
    id: 'feedback',
    title: 'Customer Feedback & Survey',
    description: 'Collect valuable customer insights',
    previewImage: '/feedbackAndSurvey.png',
    fields: [
      {
        id: 'campaign_title',
        label: 'Campaign Title',
        type: 'text',
        placeholder: 'Enter your campaign title',
        required: true
      },
      {
        id: 'survey_title',
        label: 'Survey Title',
        type: 'text',
        placeholder: 'Enter survey title',
        required: true
      },
      {
        id: 'survey_description',
        label: 'Survey Description',
        type: 'textarea',
        placeholder: 'Describe what the survey is about',
        required: true
      },
      {
        id: 'incentive',
        label: 'Survey Incentive',
        type: 'text',
        placeholder: 'e.g., Get 10% off, Free shipping',
        required: false
      },
      {
        id: 'call_to_action',
        label: 'Call to Action',
        type: 'text',
        placeholder: 'e.g., Take Survey, Share Feedback',
        required: true
      },
      {
        id: 'logo',
        label: 'Brand Logo',
        type: 'file',
        placeholder: 'Upload your brand logo',
        required: false
      },
      {
        id: 'expiry_date',
        label: 'Survey End Date',
        type: 'date',
        placeholder: 'Select end date',
        required: false
      }
    ]
  }
};

const progressSteps = [
  { id: 1, title: 'Choose campaign type', completed: true },
  { id: 2, title: 'Create campaign', completed: true },
  { id: 3, title: 'Choose Audience', completed: false },
  { id: 4, title: 'Schedule Date & Time', completed: false }
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#7856ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Animated Step Component
const AnimatedStep = ({ step, index, isLast }: { step: any; index: number; isLast: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Stagger animation for each step
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (step.completed) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 300 + index * 150);
      return () => clearTimeout(timer);
    }
  }, [step.completed, index]);

  return (
    <div className={`flex items-center flex-1 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
          {step.completed ? (
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7856ff]/10 flex items-center justify-center transition-all duration-500 ease-out ${
              isCompleted ? 'scale-110' : 'scale-100'
            }`}>
              <div className={`transition-all duration-300 ease-out ${
                isCompleted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}>
                <CheckIcon />
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#e9e9e9] flex items-center justify-center transition-all duration-300">
              <span className="text-sm font-medium text-[#626266]">{step.id}</span>
            </div>
          )}
        </div>
        <span className={`text-sm sm:text-base font-semibold text-[#2a2a2f] tracking-tight transition-all duration-300 ${
          step.completed ? 'text-[#7856ff]' : 'text-[#2a2a2f]'
        }`}>
          {step.title}
        </span>
      </div>
      {!isLast && (
        <div className="hidden sm:block flex-1 mx-6 relative">
          <div className="h-px bg-[#e9e9e9] w-full"></div>
          {step.completed && (
            <div className={`absolute top-0 left-0 h-full bg-[#7856ff] transition-all duration-1000 ease-out ${
              isCompleted ? 'w-full' : 'w-0'
            }`}></div>
          )}
        </div>
      )}
    </div>
  );
};

export function CreateCampaignContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = usePopup();
  const campaignType = searchParams.get('type') || 'advertise';
  const template = campaignTemplates[campaignType];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

    const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setSelectedFiles(prev => ({ ...prev, [fieldId]: file }));
  };

    const handleProceed = () => {
    const requiredFields = template.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.id]);

    if (missingFields.length > 0) {
      showError(
        'Missing Required Fields',
        `Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`
      );
      return;
    }

    router.push(`/new-campaign/audience?type=${campaignType}`);
  };

  const renderField = (field: CampaignField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7856ff] focus:border-transparent transition-all duration-200 bg-white text-[#2a2a2f] placeholder-[#626266]"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-4 py-3 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7856ff] focus:border-transparent resize-none transition-all duration-200 bg-white text-[#2a2a2f] placeholder-[#626266]"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-4 py-3 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7856ff] focus:border-transparent transition-all duration-200 bg-white text-[#2a2a2f]"
          />
        );
      case 'file':
        return (
          <div>
            <input
              type="file"
              id={field.id}
              accept="image/*"
              onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor={field.id}
              className="block w-full px-4 py-3 border border-[#e9e9e9] rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7856ff] focus:border-transparent transition-all duration-200 bg-white text-[#2a2a2f]"
            >
              {selectedFiles[field.id] ? selectedFiles[field.id]?.name : field.placeholder}
            </label>
            {selectedFiles[field.id] && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(selectedFiles[field.id]!)}
                  alt={field.label}
                  className="w-20 h-20 object-cover rounded-lg border border-[#e9e9e9]"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
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

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">
                Create Campaign
              </h1>
              <p className="text-sm sm:text-base text-[#626266] mt-2 sm:mt-3">
                Fill in the details for your {template.title.toLowerCase()}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProceed}
                className="px-6 py-3 bg-[#7856ff] text-white rounded-lg font-medium hover:bg-[#6a4fd8] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue to Audience Selection
              </button>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#fff] border border-[#fff] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            {/* <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaign Progress
            </h2> */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              {progressSteps.map((step, index) => (
                <AnimatedStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === progressSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Campaign Template Section */}
            <section className="rounded-lg bg-[#f6f6f6] border border-[#dbdbdb] box-border overflow-hidden">
              <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
                <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
                  Campaign Details
                </h3>
                <div className="space-y-6">
                  {template.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="block text-sm font-medium text-[#2a2a2f]">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Preview Section */}
          <section className="rounded-lg bg-[#f6f6f6] border border-[#dbdbdb] box-border overflow-hidden">
            <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px]">
                  Campaign Preview
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              </div>

              {/* Mobile Phone Frame */}
              <div className="flex justify-center">
                <div className="relative w-80 h-[700px] bg-black rounded-[3rem] p-2 shadow-2xl">
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-black text-white text-xs px-6 py-2 flex justify-between items-center">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-3 bg-white rounded-sm"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>

                    {/* App Content */}
                    <div className="p-6 h-full overflow-y-auto">
                      {/* Campaign Header */}
                      <div className="flex items-center gap-4 mb-6">
                        {selectedFiles.logo ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            <img
                              src={URL.createObjectURL(selectedFiles.logo)}
                              alt="Logo"
                              className="w-12 h-12 object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base">
                            {formData.campaign_title || 'Campaign Title'}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">{campaignType}</p>
                        </div>
                      </div>

                      {/* Campaign Content */}
                      <div className="space-y-4">
                        {formData.ad_title && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">
                              {formData.ad_title}
                            </h5>
                          </div>
                        )}

                        {formData.body_text && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {formData.body_text}
                            </p>
                          </div>
                        )}

                        {formData.supporting_text && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-xs text-blue-700 italic">
                              {formData.supporting_text}
                            </p>
                          </div>
                        )}

                        {formData.message_title && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">
                              {formData.message_title}
                            </h5>
                          </div>
                        )}

                        {formData.personalized_content && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {formData.personalized_content}
                            </p>
                          </div>
                        )}

                        {formData.call_to_action && (
                          <div className="mt-4">
                            <button className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-[#7856ff] transition-all duration-200 hover:scale-105">
                              {formData.call_to_action}
                            </button>
                          </div>
                        )}

                        {formData.loyalty_message && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h5 className="font-semibold text-purple-900 text-sm mb-2">
                              🎁 Loyalty Program
                            </h5>
                            <p className="text-sm text-purple-700 leading-relaxed">
                              {formData.loyalty_message}
                            </p>
                          </div>
                        )}

                        {formData.reward_description && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 font-medium">
                              🎁 {formData.reward_description}
                            </p>
                          </div>
                        )}

                        {formData.expiry_date && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800 font-medium">
                              ⏰ Valid until: {new Date(formData.expiry_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {formData.survey_title && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-semibold text-green-900 text-sm mb-2">
                              {formData.survey_title}
                            </h5>
                          </div>
                        )}

                        {formData.survey_description && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm text-green-700 leading-relaxed">
                              {formData.survey_description}
                            </p>
                          </div>
                        )}

                        {formData.incentive && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800 font-medium">
                              💝 {formData.incentive}
                            </p>
                          </div>
                        )}

                        {/* Show placeholder when no content is entered */}
                        {!formData.ad_title && !formData.body_text && !formData.message_title &&
                          !formData.personalized_content && !formData.loyalty_message && !formData.survey_title && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <p className="text-sm text-gray-500">Start filling out the form to see your campaign preview</p>
                          </div>
                        )}
                      </div>

                      {/* Preview Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Preview • {new Date().toLocaleDateString()}</span>
                          <span>Mobile View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-xs text-[#626266]">
                  *Live preview of your campaign as it will appear to users
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
