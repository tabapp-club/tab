'use client';

import React, { useState, useEffect, useCallback, useMemo, memo, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import {
  Users,
  DollarSign, 
  Target,
  ChevronDown, 
  ChevronUp,
  Upload,
  Bold,
  Italic,
  Smile,
  Sparkles,
  Plus,
  Info,
  Send,
  Phone,
  ExternalLink,
  Tag,
  CheckCircle2,
  Loader2,
  Circle
} from 'lucide-react';

// Import Select components directly
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VirtualVariableList } from './components/VirtualVariableList';
import { useCampaignState, type HeaderType, type Variable, type Button, type CampaignMedium } from './hooks/useCampaignState';
import DataCenterFilters from '@/components/DataCenterFilters';

// Constants
const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
] as const;

const FILE_LIMITS = {
  IMAGE: 5 * 1024 * 1024,
  VIDEO: 16 * 1024 * 1024,
  DOCUMENT: 10 * 1024 * 1024,
} as const;

const AI_MESSAGE_TEMPLATES = [
  'Hi {{1}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.',
  'Hello {{1}}! Special offer just for you - 30% discount on all services this week.',
  'Hey {{1}}, come back and save! Exclusive 25% off waiting for you.',
  'Hi {{1}}, we noticed you\'re away. Return now for a special 20% welcome back offer!',
  'Hello {{1}}! Limited time: Get 40% off your favorite services. Don\'t miss out!',
  'Hi {{1}}, welcome back! Enjoy 35% off on your next visit. Limited time only!',
  'Hey {{1}}, we\'ve missed you! Here\'s a special 15% discount just for returning customers.',
  'Hello {{1}}! Don\'t miss our exclusive offer - 50% off on selected services this month.',
  'Hi {{1}}, come back and discover our new services with a 20% welcome back discount!',
  'Hey {{1}}, we have something special waiting for you! Get 30% off when you return.'
] as const;

// Loading components
const SelectSkeleton = () => (
  <div className="w-[440px] h-12 px-4 border border-[#e9e9e9] rounded text-sm bg-gray-50 flex items-center animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32"></div>
  </div>
);

// SMS Preview Component
const SMSPreview = memo(({ 
  bodyText, 
  variables 
}: {
  bodyText: string;
  variables: Variable[];
}) => {
  const previewText = useMemo(() => {
    let text = bodyText;
    variables.forEach(v => {
      const replaceValue = v.value || v.fallback || v.variable;
      text = text.replace(new RegExp(v.variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceValue);
    });
    return text;
  }, [bodyText, variables]);

  return (
    <div className="w-[486px] bg-white border border-[#f6f6f6] rounded p-6 sticky top-10">
      <h3 className="text-sm font-bold text-[#101828] mb-4">Preview</h3>
      
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-[#e9e9e9] rounded-[10px] p-6 min-h-[500px]">
        {/* Mobile Phone Frame */}
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-[320px] mx-auto border border-gray-200">
          {/* SMS Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#9747FF] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Your Business</p>
              <p className="text-xs text-gray-500">SMS Message</p>
            </div>
          </div>

          {/* SMS Message Bubble */}
          <div className="bg-[#9747FF]/10 border border-[#9747FF]/20 rounded-2xl rounded-tl-none p-4">
            <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
              {previewText || 'Your message will appear here...'}
            </p>
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[11px] text-gray-500">11:06 AM</span>
            </div>
          </div>

          {/* Character Count */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              {previewText.length} characters • {Math.ceil(previewText.length / 160)} SMS {Math.ceil(previewText.length / 160) === 1 ? 'segment' : 'segments'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

SMSPreview.displayName = 'SMSPreview';

// Memoized Preview Component
const WhatsAppPreview = memo(({ 
  headerState, 
  bodyText, 
  footerText, 
  buttons, 
  variables 
}: {
  headerState: any;
  bodyText: string;
  footerText: string;
  buttons: Button[];
  variables: Variable[];
}) => {
  const previewText = useMemo(() => {
    let text = bodyText;
    variables.forEach(v => {
      const replaceValue = v.value || v.fallback || v.variable;
      text = text.replace(new RegExp(v.variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceValue);
    });
    return text;
  }, [bodyText, variables]);

  const renderFormattedText = useCallback((text: string): React.ReactNode => {
    const parts: (string | React.ReactElement)[] = [];
    const regex = /(\*[^*]+\*|_[^_]+_)/g;
    let match;
    let lastIndex = 0;
    let currentIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const matchedText = match[0];
      if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        const content = matchedText.slice(1, -1);
        parts.push(<strong key={`bold-${currentIndex++}`}>{content}</strong>);
      } else if (matchedText.startsWith('_') && matchedText.endsWith('_')) {
        const content = matchedText.slice(1, -1);
        parts.push(<em key={`italic-${currentIndex++}`}>{content}</em>);
      } else {
        parts.push(matchedText);
      }
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  }, []);

  return (
    <div className="w-[486px] bg-white border border-[#f6f6f6] rounded p-6 sticky top-10">
      <h3 className="text-sm font-bold text-[#101828] mb-4">Preview</h3>
      
      <div className="bg-[#e4fded] border border-[#e9e9e9] rounded-[10px] p-6 min-h-[500px]">
        <div className="bg-white rounded-xl shadow-sm p-3 max-w-[287px]">
          {/* Header Content Preview */}
          {headerState.type === 'text' && headerState.text && (
            <div className="mb-2 px-2 py-1">
              <p className="text-sm font-semibold text-black leading-[1.4]">{headerState.text}</p>
            </div>
          )}

          {headerState.type === 'image' && (
            <div className="mb-2 rounded-lg overflow-hidden">
              {headerState.uploadedImage ? (
                <img 
                  src={headerState.uploadedImage} 
                  alt="Preview" 
                  className="w-full h-[133.5px] object-cover"
                />
              ) : (
                <div className="bg-gray-100 h-[133.5px] flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}

          {headerState.type === 'video' && (
            <div className="mb-2 rounded-lg overflow-hidden">
              {(headerState.uploadedVideo || headerState.videoUrl) ? (
                <div className="bg-gray-100 h-[133.5px] flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {headerState.uploadedVideo ? headerState.uploadedVideo.file?.name : 'Video URL'}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 h-[133.5px] flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}

          {headerState.type === 'document' && (
            <div className="mb-2 rounded-lg overflow-hidden">
              {(headerState.uploadedDocument || headerState.documentUrl) ? (
                <div className="bg-gray-50 border border-gray-200 h-[133.5px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {headerState.uploadedDocument ? headerState.uploadedDocument.file?.name : 'Document URL'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 h-[133.5px] flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="px-2 py-1">
            <p className="text-sm text-black leading-[1.4] whitespace-pre-wrap">
              {renderFormattedText(previewText)}
            </p>
          </div>

          {footerText && (
            <div className="px-2 py-1">
              <p className="text-xs text-[#9da3a7] leading-[1.4]">{footerText}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 px-2 py-1">
            <span className="text-[11px] text-black/50">11:06</span>
          </div>

          {buttons.filter(btn => btn.isAdded).map((button) => (
            <div 
              key={button.id}
              className="border-t border-gray-200 flex items-center justify-center gap-2 py-2.5 cursor-pointer hover:bg-gray-50 -mx-3 px-3"
            >
              {button.type === 'website' && (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1c8854]" />
                  <span className="text-sm text-[#1c8854]">{button.name}</span>
                </>
              )}
              {button.type === 'phone' && (
                <>
                  <Phone className="w-3.5 h-3.5 text-[#1c8854]" />
                  <span className="text-sm text-[#1c8854]">{button.name}</span>
                </>
              )}
              {button.type === 'coupon' && (
                <>
                  <Tag className="w-3.5 h-3.5 text-[#1c8854]" />
                  <span className="text-sm text-[#1c8854]">{button.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

WhatsAppPreview.displayName = 'WhatsAppPreview';

export function SendCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');
  const fromCampaigns = searchParams.get('from') === 'campaigns';
  const previousCampaignIdRef = useRef<string | null>(null);
  const previousHeaderTypeRef = useRef<HeaderType | null>(null);

  // Use reducer for state management
  const { state, actions } = useCampaignState();
  const [isMounted, setIsMounted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [audienceFilters, setAudienceFilters] = useState<{
    category?: string[];
    userType?: string;
    no_of_visits_from?: number;
    no_of_visits_to?: number;
    status?: string;
    search?: string;
  }>({});
  const [audienceCount, setAudienceCount] = useState({ total: 0, visible: 0 });
  const [showAudienceSection, setShowAudienceSection] = useState(true);
  const [clearFiltersTrigger, setClearFiltersTrigger] = useState(0);
  const [campaignData, setCampaignData] = useState({
    name: 'Inactive Users',
    description: "Re-engage users who haven't interacted in 30+ days",
    targetCustomers: 280,
    expectedCost: '₹8.5K',
    conversion: '18%'
  });

  // Scroll to top helper function
  const scrollToTop = useCallback(() => {
    // Use multiple methods to ensure scroll works
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // Scroll to top when component mounts
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }, [scrollToTop]);

  // Scroll to top when campaignId changes
  useEffect(() => {
    if (campaignId && isMounted) {
      // Use requestAnimationFrame to ensure DOM is ready, with a small delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToTop();
        }, 0);
      });
    }
  }, [campaignId, isMounted, scrollToTop]);

  // Load campaign data and reset state when campaignId changes
  useEffect(() => {
    if (!campaignId || typeof window === 'undefined' || !isMounted) return;

    // Reset state if campaignId changed
    if (previousCampaignIdRef.current !== null && previousCampaignIdRef.current !== campaignId) {
      actions.resetState();
      setCampaignData({
        name: 'Inactive Users',
        description: "Re-engage users who haven't interacted in 30+ days",
        targetCustomers: 280,
        expectedCost: '₹8.5K',
        conversion: '18%'
      });
    }
    previousCampaignIdRef.current = campaignId;

    const recommendedCampaigns: Record<string, any> = {
      'inactive-users': {
        name: 'Inactive Users',
        description: "Re-engage users who haven't interacted in 30+ days",
        targetCustomers: 280,
        expectedCost: '₹8.5K',
        conversion: '18%',
        bodyText: 'Hi {{1}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.'
      },
      'followup-messages': {
        name: 'Follow-up Messages',
        description: 'Critical follow-ups pending - risk of losing engagement',
        targetCustomers: 450,
        expectedCost: '₹12K',
        conversion: '32%',
        bodyText: 'Hi {{1}}, just following up on your recent interaction with us. We have an exclusive offer just for you!'
      },
      'birthday-wishes': {
        name: 'Birthday Wishes',
        description: "This month's birthdays - time-sensitive opportunity",
        targetCustomers: 300,
        expectedCost: '₹6.5K',
        conversion: '28%',
        bodyText: 'Happy Birthday {{1}}! 🎉 Celebrate with us and get a special birthday discount. Use code BDAY2024.'
      },
      'low-value-users': {
        name: 'Low Value Users',
        description: 'Upsell opportunity to increase lifetime value',
        targetCustomers: 906,
        expectedCost: '₹18K',
        conversion: '15%',
        bodyText: 'Hi {{1}}, discover our premium offerings designed just for you. Upgrade today and save big!'
      }
    };

    // Check hardcoded recommended campaigns first
    if (recommendedCampaigns[campaignId]) {
      const campaign = recommendedCampaigns[campaignId];
      setCampaignData({
        name: campaign.name,
        description: campaign.description,
        targetCustomers: campaign.targetCustomers,
        expectedCost: campaign.expectedCost,
        conversion: campaign.conversion
      });
      actions.setBodyText(campaign.bodyText);
      return;
    }

    // Check funnelCampaignLookup for campaigns from customer funnel
    try {
      const funnelCampaignLookup = JSON.parse(localStorage.getItem('funnelCampaignLookup') || '{}');
      const funnelCampaign = funnelCampaignLookup[campaignId];
      
      if (funnelCampaign) {
        // Extract numeric values from formatted strings
        const extractNumber = (str: string): number => {
          const match = str.match(/[\d.]+/);
          return match ? parseFloat(match[0]) : 0;
        };

        const extractCost = (costStr: string): string => {
          // Handle formats like "₹8.5K", "₹8500", etc.
          if (costStr.includes('K')) {
            const num = extractNumber(costStr);
            return `₹${num}K`;
          }
          return costStr;
        };

        setCampaignData({
          name: funnelCampaign.title || funnelCampaign.name || 'Campaign',
          description: funnelCampaign.description || funnelCampaign.estimatedImpact || '',
          targetCustomers: funnelCampaign.count || 0,
          expectedCost: extractCost(funnelCampaign.expectedCampaignCost || '₹0'),
          conversion: funnelCampaign.expectedConversion || '0%'
        });
        
        // Set a default body text based on the campaign description
        const defaultBodyText = `Hi {{1}}, ${funnelCampaign.description || funnelCampaign.estimatedImpact || 'we have a special offer for you!'}`;
        actions.setBodyText(defaultBodyText);
        return;
      }
    } catch (error) {
      console.error('Error loading funnel campaign data:', error);
    }

    // Fallback to sentCampaigns and pendingCampaigns
      try {
        const storedCampaigns = JSON.parse(localStorage.getItem('sentCampaigns') || '[]');
        const pendingCampaigns = JSON.parse(localStorage.getItem('pendingCampaigns') || '[]');
        const allCampaigns = [...storedCampaigns, ...pendingCampaigns];
        
        const foundCampaign = allCampaigns.find((c: any) => c.id === campaignId);
        
        if (foundCampaign) {
          setCampaignData({
            name: foundCampaign.name || 'Campaign',
            description: foundCampaign.description || '',
            targetCustomers: foundCampaign.audience || 0,
            expectedCost: foundCampaign.budget ? `₹${(foundCampaign.budget / 1000).toFixed(1)}K` : '₹0',
            conversion: foundCampaign.conversion ? `${foundCampaign.conversion.toFixed(1)}%` : '0%'
          });
        }
      } catch (error) {
      console.error('Error loading campaign data:', error);
    }
  }, [campaignId, actions.setBodyText, actions.resetState, isMounted]);

  // Reset header when type changes
  useEffect(() => {
    if (state.headerState.type === 'none') {
      actions.resetHeader();
    } else if (state.headerState.type === 'text' && previousHeaderTypeRef.current !== 'text' && !state.headerState.text) {
      // Set dummy text when switching to text type for the first time and text is empty
      actions.setHeaderText('Special Offer Today!');
    }
    previousHeaderTypeRef.current = state.headerState.type;
  }, [state.headerState.type, actions.resetHeader, actions.setHeaderText]);

  // File upload handlers
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      actions.setHeaderError('Please upload a valid image file (JPG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > FILE_LIMITS.IMAGE) {
      actions.setHeaderError(`Image size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => actions.setHeaderImage(reader.result as string);
      reader.onerror = () => actions.setHeaderError('Failed to read image file');
      reader.readAsDataURL(file);
    } catch (error) {
      actions.setHeaderError('Failed to process image file');
    }
  }, [actions.setHeaderImage, actions.setHeaderError]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') return;
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  }, [processImageFile]);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (typeof window === 'undefined') return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processImageFile(file);
  }, [processImageFile]);

  const handleImageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleImageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      actions.setHeaderError('Please upload a valid video file (MP4, MOV, AVI, etc.)');
      return;
    }

    if (file.size > FILE_LIMITS.VIDEO) {
      actions.setHeaderError(`Video size must be less than 16MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => actions.setHeaderVideo({ file, preview: reader.result as string });
      reader.onerror = () => actions.setHeaderError('Failed to read video file');
      reader.readAsDataURL(file);
    } catch (error) {
      actions.setHeaderError('Failed to process video file');
    }
  }, [actions.setHeaderVideo, actions.setHeaderError]);

  const handleDocumentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      actions.setHeaderError('Please upload a valid PDF file');
      return;
    }

    if (file.size > FILE_LIMITS.DOCUMENT) {
      actions.setHeaderError(`Document size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      actions.setHeaderDocument({ file, preview: file.name });
    } catch (error) {
      actions.setHeaderError('Failed to process document file');
    }
  }, [actions.setHeaderDocument, actions.setHeaderError]);

  const addVariable = useCallback(() => {
    const newId = (state.variables.length + 1).toString();
    const newVariable = `{{${newId}}}`;
    
    actions.addVariable({
      id: newId,
      variable: newVariable,
      value: 'name',
      fallback: ''
    });
    
    if (typeof window === 'undefined') return;
    
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      actions.setBodyText(state.bodyText + newVariable);
      return;
    }

    const start = textarea.selectionStart || state.bodyText.length;
    const end = textarea.selectionEnd || state.bodyText.length;
    const textBefore = state.bodyText.substring(0, start);
    const textAfter = state.bodyText.substring(end);
    
    actions.setBodyText(textBefore + newVariable + textAfter);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newVariable.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [state.variables.length, state.bodyText, actions.addVariable, actions.setBodyText]);

  const removeVariable = useCallback((id: string) => {
    const variable = state.variables.find(v => v.id === id);
    if (variable) {
      actions.setBodyText(state.bodyText.replace(new RegExp(variable.variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ''));
    }
    actions.removeVariable(id);
  }, [state.variables, state.bodyText, actions.setBodyText, actions.removeVariable]);

  const generateAIMessage = useCallback(() => {
    if (state.aiState.generatedMessages.length >= 5) {
      actions.setAIGenerating(true);
      setTimeout(() => {
        const randomMessage = AI_MESSAGE_TEMPLATES[Math.floor(Math.random() * AI_MESSAGE_TEMPLATES.length)];
        const newMessages = [...state.aiState.generatedMessages];
        newMessages[state.aiState.currentMessageIndex] = randomMessage;
        actions.setAIMessages(newMessages);
        actions.setBodyText(randomMessage);
        actions.setAIGenerating(false);
      }, 800);
      return;
    }

    actions.setAIGenerating(true);
    setTimeout(() => {
      let randomMessage = AI_MESSAGE_TEMPLATES[Math.floor(Math.random() * AI_MESSAGE_TEMPLATES.length)];
      let attempts = 0;
      while (state.aiState.generatedMessages.includes(randomMessage) && attempts < 10) {
        randomMessage = AI_MESSAGE_TEMPLATES[Math.floor(Math.random() * AI_MESSAGE_TEMPLATES.length)];
        attempts++;
      }

      const newMessages = [...state.aiState.generatedMessages, randomMessage];
      actions.setAIMessages(newMessages);
      actions.setAIIndex(newMessages.length - 1);
      actions.setBodyText(randomMessage);
      actions.setAIGenerating(false);
    }, 800);
  }, [state.aiState, actions.setAIGenerating, actions.setAIMessages, actions.setAIIndex, actions.setBodyText]);

  const navigateAIMessage = useCallback((direction: 'prev' | 'next') => {
    if (state.aiState.generatedMessages.length === 0) return;

    if (direction === 'prev' && state.aiState.currentMessageIndex > 0) {
      const newIndex = state.aiState.currentMessageIndex - 1;
      actions.setAIIndex(newIndex);
      actions.setBodyText(state.aiState.generatedMessages[newIndex]);
    } else if (direction === 'next' && state.aiState.currentMessageIndex < state.aiState.generatedMessages.length - 1) {
      const newIndex = state.aiState.currentMessageIndex + 1;
      actions.setAIIndex(newIndex);
      actions.setBodyText(state.aiState.generatedMessages[newIndex]);
    }
  }, [state.aiState, actions.setAIIndex, actions.setBodyText]);

  const formatText = useCallback((type: 'bold' | 'italic') => {
    if (typeof window === 'undefined') return;
    
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = state.bodyText.substring(start, end);
    
    if (selectedText) {
      const marker = type === 'bold' ? '*' : '_';
      const newText = state.bodyText.substring(0, start) + 
                     marker + selectedText + marker + 
                     state.bodyText.substring(end);
      actions.setBodyText(newText);
      
      setTimeout(() => {
        textarea.focus();
        const newStart = start + marker.length;
        const newEnd = end + marker.length;
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
              } else {
      const marker = type === 'bold' ? '*' : '_';
      const newText = state.bodyText.substring(0, start) + marker + marker + state.bodyText.substring(end);
      actions.setBodyText(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + marker.length, start + marker.length);
      }, 0);
    }
  }, [state.bodyText, actions.setBodyText]);

  const insertVariable = useCallback((variable: string) => {
    if (typeof window === 'undefined') return;
    
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      actions.setBodyText(state.bodyText + variable);
      return;
    }

    const start = textarea.selectionStart || state.bodyText.length;
    const end = textarea.selectionEnd || state.bodyText.length;
    const textBefore = state.bodyText.substring(0, start);
    const textAfter = state.bodyText.substring(end);
    
    actions.setBodyText(textBefore + variable + textAfter);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + variable.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [state.bodyText, actions.setBodyText]);

  const charCounts = useMemo(() => ({
    body: state.bodyText.length,
    footer: state.footerText.length
  }), [state.bodyText.length, state.footerText.length]);

  // Determine if a step is completed
  const isStepCompleted = useCallback((step: 'language' | 'medium' | 'campaignType' | 'header' | 'body' | 'footer' | 'buttons') => {
    switch (step) {
      case 'language':
        // Always completed as language has a default value
        return true;
      case 'medium':
        // Always completed as medium has a default value
        return true;
      case 'campaignType':
        // Always completed as campaignType has a default value
        return true;
      case 'header':
        if (state.headerState.type === 'none') return true;
        if (state.headerState.type === 'text') return !!state.headerState.text;
        if (state.headerState.type === 'image') return !!state.headerState.uploadedImage;
        if (state.headerState.type === 'video') return !!(state.headerState.uploadedVideo || state.headerState.videoUrl);
        if (state.headerState.type === 'document') return !!(state.headerState.uploadedDocument || state.headerState.documentUrl);
        return false;
      case 'body':
        return state.bodyText.trim().length > 0;
      case 'footer':
        // Footer is optional, so if it has text it's completed
        return state.footerText.trim().length > 0;
      case 'buttons':
        return state.buttons.some(btn => btn.isAdded);
      default:
        return false;
    }
  }, [state]);

  // Determine current step (first incomplete step)
  const currentStep = useMemo(() => {
    const steps: Array<'language' | 'medium' | 'campaignType' | 'header' | 'body' | 'footer' | 'buttons'> = ['language', 'medium', 'campaignType', 'header', 'body', 'footer', 'buttons'];
    for (const step of steps) {
      if (!isStepCompleted(step)) return step;
    }
    // If all are completed, return null (no current step)
    return null;
  }, [isStepCompleted]);

  // Determine step status
  const getStepStatus = useCallback((step: 'language' | 'medium' | 'campaignType' | 'header' | 'body' | 'footer' | 'buttons') => {
    if (isStepCompleted(step)) {
      return 'completed';
    }
    if (currentStep === step) {
      return 'current';
    }
    return 'not-started';
  }, [isStepCompleted, currentStep]);

  // Green tick icon component
  const GreenTickIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_50_10064)">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12ZM11.3152 17.136L18.224 8.4992L16.976 7.5008L11.0848 14.8624L6.912 11.3856L5.888 12.6144L11.3152 17.136Z" fill="#09B662"/>
      </g>
      <defs>
        <clipPath id="clip0_50_10064">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  // Dotted circle icon component for header section
  const DottedCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#9747FF" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
    </svg>
  );

  const handleSendCampaign = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Create campaign data object
    const newCampaign: {
      id: string;
      name: string;
      type: 'feedback' | 'retention' | 'engagement' | 'advertise';
      status: 'active' | 'paused' | 'draft' | 'completed' | 'pending';
      audience: number;
      sent: number;
      opened: number;
      clicked: number;
      conversion: number;
      budget: number;
      spent: number;
      createdAt: number;
      createdDate: string;
      endDate: string;
      description: string;
    } = {
      id: campaignId ? `campaign-${campaignId}-${Date.now()}` : `campaign-${Date.now()}`,
      name: campaignData.name,
      type: 'engagement' as const,
      status: 'pending' as const, // Pending WhatsApp review
      audience: campaignData.targetCustomers,
      sent: 0,
      opened: 0,
      clicked: 0,
      conversion: parseFloat(campaignData.conversion.replace('%', '')) || 0,
      budget: parseFloat(campaignData.expectedCost.replace(/[₹,K]/g, '')) * 1000 || 0,
      spent: 0,
      createdAt: Date.now(),
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      endDate: '',
      description: campaignData.description
    };

    // Store in both keys for compatibility
    try {
      const existingCampaigns = JSON.parse(localStorage.getItem('sentCampaigns') || '[]');
      // Remove any existing campaign with the same ID (if updating)
      const filteredCampaigns = existingCampaigns.filter((c: any) => c.id !== newCampaign.id);
      filteredCampaigns.push(newCampaign);
      localStorage.setItem('sentCampaigns', JSON.stringify(filteredCampaigns));

      // Also store in pendingCampaigns for backward compatibility
      const pendingCampaigns = JSON.parse(localStorage.getItem('pendingCampaigns') || '[]');
      const filteredPending = pendingCampaigns.filter((c: any) => c.id !== newCampaign.id);
      filteredPending.push(newCampaign);
      localStorage.setItem('pendingCampaigns', JSON.stringify(filteredPending));

      // Dispatch custom event to update campaigns list
      window.dispatchEvent(new Event('campaignsUpdated'));
    } catch (error) {
      console.error('Error saving campaign:', error);
    }

    // Show success dialog
    setShowSuccessDialog(true);
  }, [campaignId, campaignData]);

  const handleTrackCampaign = useCallback(() => {
    setShowSuccessDialog(false);
    router.push('/campaigns');
  }, [router]);

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessDialog) {
        setShowSuccessDialog(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSuccessDialog]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (showSuccessDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuccessDialog]);

    return (
    <div className="bg-[#f6f6f6] min-h-screen relative">
      <Sidebar />
      
      <div className="ml-[64px] min-h-screen pb-12">
        {/* Top Header */}
        <div className="bg-white border-b border-[rgba(151,71,255,0.2)] px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/80 border border-[rgba(151,71,255,0.2)] rounded backdrop-blur-sm">
                <svg className="w-6 h-6 text-[#9747FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
                    </div>
              <div>
                <h1 className="text-base font-bold text-[#2a2a2f]">Campaign name : {campaignData.name}</h1>
                <p className="text-sm text-[#626266] mt-0.5">{campaignData.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center px-6">
                <div className="flex items-center gap-1 mb-1 justify-center">
                  <Users className="w-4 h-4 text-[#4a5565]" />
                  <span className="text-xs font-semibold text-[#4a5565]">Target Customers</span>
                </div>
                <p className="text-base font-bold text-[#9747FF]">{campaignData.targetCustomers}</p>
              </div>
              <div className="text-center px-6 border-x border-[rgba(151,71,255,0.1)]">
                <div className="flex items-center gap-1 mb-1 justify-center">
                  <DollarSign className="w-4 h-4 text-[#4a5565]" />
                  <span className="text-xs font-semibold text-[#4a5565]">Expected Cost</span>
                </div>
                <p className="text-base font-bold text-[#9747FF]">{campaignData.expectedCost}</p>
              </div>
              <div className="text-center px-6">
                <div className="flex items-center gap-1 mb-1 justify-center">
                  <Target className="w-4 h-4 text-[#4a5565]" />
                  <span className="text-xs font-semibold text-[#4a5565]">Conversion</span>
                </div>
                <p className="text-base font-bold text-[#9747FF]">{campaignData.conversion}</p>
              </div>
              </div>
            </div>
          </div>

        <div className="flex items-start gap-6 p-10 pb-16">
          <div className="flex-1 space-y-2">
            {/* Language Selector with Suspense */}
            <div className="bg-white border border-[#f6f6f6] rounded px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('language');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                <h3 className="text-sm font-bold text-[#101828]">Choose Language</h3>
                </div>
                {isMounted ? (
                  <Suspense fallback={<SelectSkeleton />}>
                    <Select value={state.language} onValueChange={actions.setLanguage}>
                    <SelectTrigger className="w-[440px] h-12 px-4 border border-[#e9e9e9] rounded text-sm bg-white text-[#a1a1a1] hover:border-[#9747FF]/30 focus:border-[#9747FF] focus:ring-2 focus:ring-[#9747FF]/20 transition-colors">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-[4px] border-[#e9e9e9]">
                        {LANGUAGES.map((lang) => (
                        <SelectItem 
                          key={lang.value} 
                          value={lang.value}
                          className="focus:bg-[#9747FF]/10 focus:text-[#9747FF] cursor-pointer"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </Suspense>
                ) : (
                  <SelectSkeleton />
                )}
              </div>
            </div>

            {/* Campaign Medium Selector */}
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.medium ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('medium');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                  <div>
                    <h3 className="text-sm font-bold text-[#101828]">Campaign Medium</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Choose how you want to send your campaign message</p>
              </div>
                </div>
                <button
                  onClick={() => actions.toggleSection('medium')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {state.sectionVisibility.medium ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
            </div>

              {state.sectionVisibility.medium && (
                <>
                  {isMounted ? (
                    <div className="grid grid-cols-2 gap-4">
                  {/* WhatsApp Option */}
                  <button
                    onClick={() => actions.setMedium('whatsapp')}
                    className={`relative p-5 rounded-lg border transition-all text-left ${
                      state.medium === 'whatsapp'
                        ? 'border-[#9747FF] bg-[#9747FF]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#9747FF]/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        state.medium === 'whatsapp'
                          ? 'bg-[#9747FF]/10'
                          : 'bg-gray-100'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          state.medium === 'whatsapp' ? 'text-[#9747FF]' : 'text-gray-400'
                        }`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h4 className={`text-sm font-semibold ${
                            state.medium === 'whatsapp' ? 'text-[#9747FF]' : 'text-[#101828]'
                          }`}>
                            WhatsApp
                          </h4>
                        </div>
                        <p className="text-xs text-[#6a7282] mb-2">
                          Rich media, interactive buttons, and high engagement
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#9747FF]/10 text-[#9747FF]">
                            Images
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#9747FF]/10 text-[#9747FF]">
                            Videos
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#9747FF]/10 text-[#9747FF]">
                            Buttons
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#9747FF]/10 text-[#9747FF]">
                            Headers
                          </span>
            </div>
                      </div>
                    </div>
                  </button>

                  {/* SMS Option */}
                  <button
                    onClick={() => actions.setMedium('sms')}
                    className={`relative p-5 rounded-lg border transition-all text-left ${
                      state.medium === 'sms'
                        ? 'border-[#9747FF] bg-[#9747FF]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#9747FF]/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        state.medium === 'sms'
                          ? 'bg-[#9747FF]/10'
                          : 'bg-gray-100'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          state.medium === 'sms' ? 'text-[#9747FF]' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h4 className={`text-sm font-semibold ${
                            state.medium === 'sms' ? 'text-[#9747FF]' : 'text-[#101828]'
                          }`}>
                            SMS
                          </h4>
                        </div>
                        <p className="text-xs text-[#6a7282] mb-2">
                          Simple text messages with wide reach
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Text Only
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Variables
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Universal
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                      <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
                  )}
                </>
                )}
              </div>

            {/* Campaign Type Section */}
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.campaignType ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('campaignType');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                  <div>
                    <h3 className="text-sm font-bold text-[#101828]">Campaign Type</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Choose whether to include an offer in your campaign</p>
                  </div>
                </div>
                <button
                  onClick={() => actions.toggleSection('campaignType')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {state.sectionVisibility.campaignType ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
            </div>

              {state.sectionVisibility.campaignType && (
                <>
                  {isMounted ? (
                    <div className="grid grid-cols-2 gap-4">
                  {/* With Offer Option */}
                  <button
                    onClick={() => {
                      actions.setCampaignType('with-offer');
                      // Update body text for with-offer if current text doesn't have offer-related content
                      const hasOfferContent = state.bodyText && (
                        state.bodyText.toLowerCase().includes('off') || 
                        state.bodyText.toLowerCase().includes('discount') || 
                        state.bodyText.toLowerCase().includes('code') ||
                        state.bodyText.toLowerCase().includes('promo') ||
                        state.bodyText.toLowerCase().includes('deal') ||
                        state.bodyText.toLowerCase().includes('save')
                      );
                      if (!hasOfferContent) {
                        actions.setBodyText('Hi {{1}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.');
                      }
                    }}
                    className={`relative p-5 rounded-lg border transition-all text-left ${
                      state.campaignType === 'with-offer'
                        ? 'border-[#9747FF] bg-[#9747FF]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#9747FF]/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        state.campaignType === 'with-offer'
                          ? 'bg-[#9747FF]/10'
                          : 'bg-gray-100'
                      }`}>
                        <Tag className={`w-6 h-6 ${
                          state.campaignType === 'with-offer' ? 'text-[#9747FF]' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h4 className={`text-sm font-semibold ${
                            state.campaignType === 'with-offer' ? 'text-[#9747FF]' : 'text-[#101828]'
                          }`}>
                            With Offer
                          </h4>
                        </div>
                        <p className="text-xs text-[#6a7282] mb-2">
                          Include discounts, promotions, or special deals
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Discounts
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Promotions
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Coupons
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Without Offer Option */}
                  <button
                    onClick={() => {
                      actions.setCampaignType('without-offer');
                      // Update body text for without-offer if current text has offer-related content
                      const hasOfferContent = state.bodyText && (
                        state.bodyText.toLowerCase().includes('off') || 
                        state.bodyText.toLowerCase().includes('discount') || 
                        state.bodyText.toLowerCase().includes('code') ||
                        state.bodyText.toLowerCase().includes('promo') ||
                        state.bodyText.toLowerCase().includes('deal') ||
                        state.bodyText.toLowerCase().includes('save')
                      );
                      if (hasOfferContent) {
                        actions.setBodyText('Hi {{1}}, we miss you! Just wanted to reach out and see how you&apos;re doing. We&apos;d love to hear from you!');
                      }
                    }}
                    className={`relative p-5 rounded-lg border transition-all text-left ${
                      state.campaignType === 'without-offer'
                        ? 'border-[#9747FF] bg-[#9747FF]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#9747FF]/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        state.campaignType === 'without-offer'
                          ? 'bg-[#9747FF]/10'
                          : 'bg-gray-100'
                      }`}>
                        <Send className={`w-6 h-6 ${
                          state.campaignType === 'without-offer' ? 'text-[#9747FF]' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h4 className={`text-sm font-semibold ${
                            state.campaignType === 'without-offer' ? 'text-[#9747FF]' : 'text-[#101828]'
                          }`}>
                            Without Offer
                          </h4>
                        </div>
                        <p className="text-xs text-[#6a7282] mb-2">
                          Simple messages without promotional content
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Informational
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Engagement
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            Follow-up
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                      <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Header Section - Only show for WhatsApp */}
            {state.medium === 'whatsapp' && (
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.header ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('header');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <div className="flex-shrink-0">
                            <DottedCircleIcon />
                          </div>
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Header (Optional)</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Add a header to make your message stand out</p>
                  </div>
          </div>
      <button
                  onClick={() => actions.toggleSection('header')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
      >
                  {state.sectionVisibility.header ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </button>
    </div>

              {state.sectionVisibility.header && (
                <div className="space-y-6">
                  {/* Header Type Selection - Card Grid */}
                  <div>
                    <label className="block text-xs font-medium text-[#101828] mb-3">Select Header Type</label>
                    <div className="grid grid-cols-5 gap-3">
                      {(['none', 'text', 'image', 'video', 'document'] as HeaderType[]).map((type) => {
                        const getTypeIcon = () => {
                          switch (type) {
                            case 'none': return null;
                            case 'text': return <span className="text-lg">Aa</span>;
                            case 'image': return <Upload className="w-5 h-5" />;
                            case 'video': return (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            );
                            case 'document': return (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            );
                            default: return null;
                          }
                        };

                        return (
                          <label
                            key={type}
                            className={`relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                              state.headerState.type === type
                                ? 'border-[#9747FF] bg-[#9747FF]/5'
                                : 'border-gray-200 bg-white hover:border-[#9747FF]/30 hover:bg-gray-50'
                            }`}
                          >
                        <input
                          type="radio"
                          name="headerType"
                          value={type}
                              checked={state.headerState.type === type}
                              onChange={(e) => actions.setHeaderType(e.target.value as HeaderType)}
                              className="sr-only"
                            />
                            {type === 'none' ? (
                              <span className="text-xs font-medium text-gray-400">None</span>
                            ) : (
                              <>
                                <div className={`mb-2 ${
                                  state.headerState.type === type ? 'text-[#9747FF]' : 'text-gray-400'
                                }`}>
                                  {getTypeIcon()}
                                </div>
                                <span className={`text-xs font-medium ${
                                  state.headerState.type === type ? 'text-[#9747FF]' : 'text-[#6a7282]'
                                }`}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                              </>
                            )}
                            {state.headerState.type === type && (
                              <div className="absolute top-2 right-2 w-4 h-4 bg-[#9747FF] rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                      </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Input */}
                  {state.headerState.type === 'text' && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-xs font-medium text-[#101828] mb-2">
                        Header Text <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={state.headerState.text}
                          onChange={(e) => {
                            if (e.target.value.length <= 60) {
                              actions.setHeaderText(e.target.value);
                            }
                          }}
                          placeholder="Enter a catchy header text (e.g., Special Offer Today!)"
                          className="w-full px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all placeholder:text-[#6a7282]"
                          maxLength={60}
                        />
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                          state.headerState.text.length >= 60 ? 'text-red-600 font-semibold' : 'text-[#6a7282]'
                        }`}>
                          {state.headerState.text.length}/60
                </div>
                            </div>
                      {state.headerState.text.length >= 60 && (
                        <p className="text-xs text-red-600 mt-1">Maximum 60 characters reached</p>
                      )}
                      {state.headerState.text.length < 60 && (
                        <p className="text-xs text-[#6a7282] mt-1">Keep it short and engaging</p>
                      )}
                          </div>
                    )}

                  {/* Image Upload */}
                  {state.headerState.type === 'image' && (
                    <div className="space-y-4">
                      {!state.headerState.uploadedImage ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <div
                              onDrop={handleImageDrop}
                              onDragOver={handleImageDragOver}
                              onDragLeave={handleImageDragLeave}
                              className={`border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all group ${
                                isDragOver
                                  ? 'border-[#9747FF] bg-[#9747FF]/10 scale-[1.02]'
                                  : 'border-[#9747FF] hover:bg-[#9747FF]/5 hover:border-[#9747FF]'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                                  isDragOver
                                    ? 'bg-[#9747FF]/20'
                                    : 'bg-[#9747FF]/10 group-hover:bg-[#9747FF]/20'
                                }`}>
                                  <Upload className={`w-8 h-8 text-[#9747FF] ${isDragOver ? 'animate-bounce' : ''}`} />
                        </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#101828]">
                                    {isDragOver ? 'Drop your image here' : 'Upload Image'}
                                  </p>
                                  <p className="text-xs text-[#6a7282] mt-1">
                                    {isDragOver ? 'Release to upload' : 'Click to browse or drag and drop your image here'}
                                  </p>
                      </div>
                </div>
              </div>
                          </label>
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">Supported Formats</p>
                                <p className="text-xs text-[#6a7282]">JPG, PNG, GIF, WebP</p>
                </div>
              </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">Size & Dimensions</p>
                                <p className="text-xs text-[#6a7282]">Max 5MB • 800x418px recommended</p>
                          </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                          <div className="relative group">
                            <img 
                              src={state.headerState.uploadedImage} 
                              alt="Uploaded header" 
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm" 
                            />
                <button
                              onClick={() => actions.setHeaderImage(null)}
                              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                              title="Remove image"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
      </button>
                      </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#101828]">Image uploaded successfully</p>
                                <p className="text-xs text-[#6a7282]">Ready to use in your campaign</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const event = { target: { files: [file] } } as any;
                                    handleImageUpload(event);
                                  }
                                };
                                input.click();
                              }}
                              className="text-xs font-medium text-[#9747FF] hover:text-[#8035e6]"
                            >
                              Replace
                            </button>
                    </div>
                      </div>
                    )}
                      
                      {state.headerState.uploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-red-800">Upload Error</p>
                            <p className="text-xs text-red-700 mt-0.5">{state.headerState.uploadError}</p>
                          </div>
                      </div>
                      )}
                    </div>
                  )}

                  {/* Video Upload or URL */}
                  {state.headerState.type === 'video' && (
                    <div className="space-y-4">
                      {!state.headerState.uploadedVideo && !state.headerState.videoUrl ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                              />
                              <div className="border border-dashed border-[#9747FF] rounded-lg p-6 text-center cursor-pointer hover:bg-[#9747FF]/5 hover:border-[#9747FF] transition-all group h-full flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-[#9747FF]/10 flex items-center justify-center mb-2 group-hover:bg-[#9747FF]/20 transition-colors">
                                  <Upload className="w-6 h-6 text-[#9747FF]" />
                  </div>
                                <p className="text-sm font-semibold text-[#101828]">Upload Video</p>
                                <p className="text-xs text-[#6a7282] mt-1">Choose a video file</p>
              </div>
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                  </div>
                              <p className="text-sm font-semibold text-[#101828] mb-2">Or Use URL</p>
                              <input
                                type="url"
                                value={state.headerState.videoUrl}
                                onChange={(e) => actions.setHeaderVideoUrl(e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] placeholder:text-gray-400"
                              />
                              </div>
                            </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">Supported Formats</p>
                                <p className="text-xs text-[#6a7282]">MP4, MOV, AVI, WebM</p>
                          </div>
                  </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">Size & Duration</p>
                                <p className="text-xs text-[#6a7282]">Max 16MB • 30s or less</p>
                </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-lg bg-[#9747FF]/10 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-6 h-6 text-[#9747FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
              </div>
              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#101828] truncate">
                                    {state.headerState.uploadedVideo ? state.headerState.uploadedVideo.file?.name : 'Video URL'}
                                  </p>
                                  {state.headerState.uploadedVideo && (
                                    <p className="text-xs text-[#6a7282] mt-1">
                                      {(state.headerState.uploadedVideo.file?.size || 0) / 1024 / 1024 > 0 
                                        ? `${((state.headerState.uploadedVideo.file?.size || 0) / 1024 / 1024).toFixed(2)}MB`
                                        : 'Video file'}
                                    </p>
                                  )}
                                  {state.headerState.videoUrl && (
                                    <p className="text-xs text-[#6a7282] mt-1 truncate break-all">{state.headerState.videoUrl}</p>
              )}
              </div>
            </div>
                      <button
                  onClick={() => {
                                  actions.setHeaderVideo(null);
                                  actions.setHeaderVideoUrl('');
                                }}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                title="Remove video"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                      </button>
    </div>
                    </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#101828]">Video ready</p>
                                <p className="text-xs text-[#6a7282]">Ready to use in your campaign</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                actions.setHeaderVideo(null);
                                actions.setHeaderVideoUrl('');
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'video/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const event = { target: { files: [file] } } as any;
                                    handleVideoUpload(event);
                                  }
                                };
                                input.click();
                              }}
                              className="text-xs font-medium text-[#9747FF] hover:text-[#8035e6]"
                            >
                              Replace
                            </button>
                </div>
                      </div>
                    )}
                      
                      {state.headerState.uploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-red-800">Upload Error</p>
                            <p className="text-xs text-red-700 mt-0.5">{state.headerState.uploadError}</p>
                          </div>
                </div>
                      )}
                        </div>
                  )}

                  {/* Document Upload or URL */}
                  {state.headerState.type === 'document' && (
          <div className="space-y-4">
                      {!state.headerState.uploadedDocument && !state.headerState.documentUrl ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <label className="block">
              <input
                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleDocumentUpload}
                className="hidden"
              />
                              <div className="border border-dashed border-[#9747FF] rounded-lg p-6 text-center cursor-pointer hover:bg-[#9747FF]/5 hover:border-[#9747FF] transition-all group h-full flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-[#9747FF]/10 flex items-center justify-center mb-2 group-hover:bg-[#9747FF]/20 transition-colors">
                                  <Upload className="w-6 h-6 text-[#9747FF]" />
                        </div>
                                <p className="text-sm font-semibold text-[#101828]">Upload PDF</p>
                                <p className="text-xs text-[#6a7282] mt-1">Choose a PDF file</p>
                      </div>
                    </label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                </div>
                              <p className="text-sm font-semibold text-[#101828] mb-2">Or Use URL</p>
                              <input
                                type="url"
                                value={state.headerState.documentUrl}
                                onChange={(e) => actions.setHeaderDocumentUrl(e.target.value)}
                                placeholder="https://example.com/document.pdf"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] placeholder:text-gray-400"
                  />
                </div>
                </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">File Format</p>
                                <p className="text-xs text-[#6a7282]">PDF only</p>
              </div>
                      </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <p className="text-xs font-medium text-[#101828]">Maximum Size</p>
                                <p className="text-xs text-[#6a7282]">10MB</p>
                    </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                      </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#101828] truncate">
                                    {state.headerState.uploadedDocument ? state.headerState.uploadedDocument.file?.name : 'Document URL'}
                                  </p>
                                  {state.headerState.uploadedDocument && (
                                    <p className="text-xs text-[#6a7282] mt-1">
                                      {state.headerState.uploadedDocument.file ? `${(state.headerState.uploadedDocument.file.size / 1024 / 1024).toFixed(2)}MB` : 'PDF document'}
                                    </p>
                                  )}
                                  {state.headerState.documentUrl && (
                                    <p className="text-xs text-[#6a7282] mt-1 truncate break-all">{state.headerState.documentUrl}</p>
                    )}
                  </div>
                              </div>
                  <button
                  onClick={() => {
                                  actions.setHeaderDocument(null);
                                  actions.setHeaderDocumentUrl('');
                                }}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                title="Remove document"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                  </button>
                </div>
                  </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#101828]">Document ready</p>
                                <p className="text-xs text-[#6a7282]">Ready to use in your campaign</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                actions.setHeaderDocument(null);
                                actions.setHeaderDocumentUrl('');
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'application/pdf,.pdf';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const event = { target: { files: [file] } } as any;
                                    handleDocumentUpload(event);
                                  }
                                };
                                input.click();
                              }}
                              className="text-xs font-medium text-[#9747FF] hover:text-[#8035e6]"
                            >
                              Replace
                            </button>
          </div>
        </div>
                      )}
                      
                      {state.headerState.uploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-red-800">Upload Error</p>
                            <p className="text-xs text-red-700 mt-0.5">{state.headerState.uploadError}</p>
                          </div>
                  </div>
                      )}
                    </div>
                  )}
              </div>
              )}
        </div>
            )}

            {/* Body Section */}
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.body ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('body');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Body</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Write your message and personalize it with variables</p>
                  </div>
                </div>
                        <button
                  onClick={() => actions.toggleSection('body')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
          >
                  {state.sectionVisibility.body ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </button>
                              </div>

              {state.sectionVisibility.body && (
                <div className="space-y-4">
                  {/* Text Editor */}
                  <div className="relative">
                <textarea
                      id="body-textarea"
                      value={state.bodyText}
                      onChange={(e) => {
                        if (e.target.value.length <= 1024) {
                          actions.setBodyText(e.target.value);
                        }
                      }}
                      className="w-full min-h-[120px] px-4 py-3 border border-[rgba(151,71,255,0.2)] rounded-lg text-[14px] font-normal text-[#101828] resize-none focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all placeholder:text-[#6a7282]"
                      placeholder="Enter your message here... Use variables like {{name}} to personalize your message."
                      maxLength={1024}
                    />
                    <div className="absolute bottom-3 right-4 flex items-center gap-4">
                      <div className={`text-xs ${
                        charCounts.body >= 1024 
                          ? 'text-red-600 font-semibold' 
                          : charCounts.body >= 900 
                          ? 'text-orange-600' 
                          : 'text-[#6a7282]'
                      }`}>
                        {charCounts.body}/1024
                      </div>
                            </div>
                          </div>

                  {/* Quick Actions Bar */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Formatting Tools */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-[#6a7282] mr-2">Format:</span>
                    <button
                        onClick={() => formatText('bold')} 
                        className="p-2 rounded-md hover:bg-white text-gray-600 hover:text-[#9747FF] transition-colors border border-transparent hover:border-[#9747FF]/20" 
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                    <button
                        onClick={() => formatText('italic')} 
                        className="p-2 rounded-md hover:bg-white text-gray-600 hover:text-[#9747FF] transition-colors border border-transparent hover:border-[#9747FF]/20" 
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button 
                        onClick={() => {
                          const commonEmojis = ['😊', '🎉', '🔥', '✨', '💯', '👍', '❤️', '🎁'];
                          const randomEmoji = commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
                          insertVariable(randomEmoji);
                        }}
                        className="p-2 rounded-md hover:bg-white text-gray-600 hover:text-[#9747FF] transition-colors border border-transparent hover:border-[#9747FF]/20"
                        title="Insert emoji"
                      >
                        <Smile className="w-4 h-4" />
                    </button>
                              </div>

                    {/* AI & Variables */}
                    <div className="flex items-center gap-2">
                      {/* AI Generate */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={generateAIMessage}
                          disabled={state.aiState.isGenerating}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#9747FF] hover:text-[#8035e6] disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-white border border-[#9747FF]/30 hover:border-[#9747FF] transition-all"
                        >
                          {state.aiState.isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#9747FF] border-t-transparent rounded-full animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>AI Generate</span>
                            </>
                          )}
                        </button>
                        {state.aiState.generatedMessages.length > 0 && (
                          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateAIMessage('prev');
                              }}
                              disabled={state.aiState.currentMessageIndex <= 0 || state.aiState.isGenerating}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title="Previous message"
                            >
                              <ChevronDown className="w-3.5 h-3.5 rotate-90 text-gray-600" />
                            </button>
                            <span className="text-xs font-medium text-[#101828] min-w-[2.5rem] text-center px-1">
                              {state.aiState.currentMessageIndex + 1}/{state.aiState.generatedMessages.length}
                                </span>
                    <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateAIMessage('next');
                              }}
                              disabled={state.aiState.currentMessageIndex >= state.aiState.generatedMessages.length - 1 || state.aiState.isGenerating}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title="Next message"
                            >
                              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-600" />
                    </button>
                              </div>
                )}
                  </div>

                      <div className="w-px h-6 bg-gray-300"></div>

                      {/* Add Variable */}
          <button
                        onClick={addVariable}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#9747FF] hover:text-[#8035e6] rounded-md hover:bg-white border border-[#9747FF]/30 hover:border-[#9747FF] transition-all"
                        title="Add a new variable"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Variable</span>
          </button>
              </div>
            </div>

                  {/* Variables Management Section */}
                  {state.variables.length > 0 && (
                    <div className="bg-[#f6f6f6] rounded-lg border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#101828]">Manage Variables ({state.variables.length})</p>
                        <p className="text-xs text-[#6a7282]">Configure variable values and fallbacks</p>
                </div>
                      <Suspense fallback={
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 animate-pulse">
                              <div className="h-16 bg-gray-100 rounded"></div>
                      </div>
                      ))}
                            </div>
                      }>
                        <VirtualVariableList
                          variables={state.variables}
                          isMounted={isMounted}
                          onVariableChange={actions.updateVariable}
                          onRemoveVariable={removeVariable}
                        />
                      </Suspense>
                    </div>
                )}
                            </div>
                )}
                  </div>

            {/* Footer Section */}
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.footer ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('footer');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
                      <div>
                  <h3 className="text-sm font-bold text-[#101828]">Footer (Optional)</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Enter footer text</p>
                  </div>
                      </div>
                  <button
                  onClick={() => actions.toggleSection('footer')}
                  className="text-gray-400"
          >
                  {state.sectionVisibility.footer ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                </div>

              {state.sectionVisibility.footer && (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={state.footerText}
                      onChange={(e) => {
                        if (e.target.value.length <= 60) {
                          actions.setFooterText(e.target.value);
                        }
                      }}
                    placeholder="Reply stop if you want unsubscribe"
                      className="w-full px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all"
                      maxLength={60}
                  />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6a7282]">
                      {charCounts.footer}/60
                              </div>
                  </div>
                  {charCounts.footer >= 60 && (
                    <p className="text-xs text-red-600">Maximum 60 characters allowed</p>
                  )}
                  {charCounts.footer < 60 && (
                    <p className="text-xs text-[#6a7282]">Maximum 60 characters allowed</p>
                  )}
                            </div>
                )}
                </div>

            {/* Buttons Section - Only show for WhatsApp */}
            {state.medium === 'whatsapp' && (
            <div className="bg-white border border-[#f6f6f6] rounded p-6">
              <div className={`flex items-center justify-between ${state.sectionVisibility.buttons ? 'mb-4' : ''}`}>
                <div className="flex items-center gap-3 flex-1">
                  {(() => {
                    const status = getStepStatus('buttons');
                    return (
                      <>
                        {status === 'completed' && (
                          <div className="flex-shrink-0">
                            <GreenTickIcon />
                          </div>
                        )}
                        {status === 'current' && (
                          <Loader2 className="w-6 h-6 text-[#9747FF] flex-shrink-0 animate-spin" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                        )}
                      </>
                    );
                  })()}
            <div>
                  <h3 className="text-sm font-bold text-[#101828]">Buttons (Optional)</h3>
                    <p className="text-xs text-[#6a7282] mt-1">Add up to 3 interactive buttons to your message</p>
                  </div>
                </div>
                  <button
                  onClick={() => actions.toggleSection('buttons')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
          >
                  {state.sectionVisibility.buttons ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
              </div>

              {state.sectionVisibility.buttons && (
                <div className="border-t border-[rgba(151,71,255,0.2)] pt-6 space-y-4">
                  {state.buttons.map((button) => {
                    const getButtonTypeLabel = () => {
                      switch (button.type) {
                        case 'website': return 'Website Link';
                        case 'phone': return 'Phone Number';
                        case 'coupon': return 'Coupon Code';
                        default: return '';
                      }
                    };

                    const getButtonTypeIcon = () => {
                      switch (button.type) {
                        case 'website': return <ExternalLink className="w-4 h-4" />;
                        case 'phone': return <Phone className="w-4 h-4" />;
                        case 'coupon': return <Tag className="w-4 h-4" />;
                        default: return null;
                      }
                    };

                    const getPlaceholder = () => {
                      switch (button.type) {
                        case 'website': return 'https://example.com';
                        case 'phone': return '+91 9876543210';
                        case 'coupon': return 'SAVE20';
                        default: return '';
                      }
                    };

                    return (
                      <div
                          key={button.id}
                        className={`border rounded-lg p-4 transition-all ${
                            button.isAdded
                            ? 'border-[#9747FF] bg-[#9747FF]/5'
                            : 'border-gray-200 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              button.isAdded
                                ? 'bg-[#9747FF]/10 text-[#9747FF]'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {getButtonTypeIcon()}
                  </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#101828]">
                                {getButtonTypeLabel()}
                              </h4>
                              <p className="text-xs text-[#6a7282] mt-0.5">
                                {button.type === 'website' && 'Link to your website or landing page'}
                                {button.type === 'phone' && 'Click to call this number'}
                                {button.type === 'coupon' && 'Customers can copy this code'}
                              </p>
            </div>
          </div>

                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={button.isAdded}
                              onChange={() => actions.toggleButton(button.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
                            <span className="ml-3 text-xs font-medium text-[#6a7282]">
                              {button.isAdded ? 'Active' : 'Inactive'}
                            </span>
                          </label>
                              </div>

                        {button.isAdded && (
                          <div className="space-y-3 mt-4">
                            {/* Button Name Input */}
                            <div>
                              <label className="block text-xs font-medium text-[#101828] mb-1.5">
                                Button Label <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={button.name}
                                onChange={(e) => actions.updateButton(button.id, 'name', e.target.value)}
                                placeholder={`e.g., ${button.type === 'website' ? 'Visit Store' : button.type === 'phone' ? 'Call Now' : 'Get Offer'}`}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all placeholder:text-gray-400"
                              />
                              <p className="text-xs text-[#6a7282] mt-1">
                                Text that appears on the button (max 20 characters)
                              </p>
                            </div>

                            {/* Button Value Input */}
                            <div>
                              <label className="block text-xs font-medium text-[#101828] mb-1.5">
                                {button.type === 'website' ? 'URL' : button.type === 'phone' ? 'Phone Number' : 'Coupon Code'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type={button.type === 'phone' ? 'tel' : button.type === 'website' ? 'url' : 'text'}
                                value={button.value}
                                onChange={(e) => actions.updateButton(button.id, 'value', e.target.value)}
                                placeholder={getPlaceholder()}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all placeholder:text-gray-400 font-mono"
                              />
                              <p className="text-xs text-[#6a7282] mt-1">
                                {button.type === 'website' && 'Must start with http:// or https://'}
                                {button.type === 'phone' && 'Include country code (e.g., +91)'}
                                {button.type === 'coupon' && 'Code customers will receive'}
                    </p>
    </div>

                            {/* Preview Badge */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#6a7282]">Preview:</span>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e4fded] border border-[#1c8854]/30 rounded-md">
                                {getButtonTypeIcon()}
                                <span className="text-xs font-medium text-[#1c8854]">
                                  {button.name || 'Button Label'}
                                </span>
    </div>
              </div>
                    </div>
                )}
        </div>
                    );
                  })}
      </div>
                )}
          </div>
        )}

            {/* Choose Audience Section - Only show when coming from campaigns page */}
            {fromCampaigns && (
              <div className="bg-white border border-[#f6f6f6] rounded p-6">
                <div className={`flex items-center justify-between ${showAudienceSection ? 'mb-4' : ''}`}>
                  <div className="flex items-center gap-3 flex-1">
                    {(() => {
                      const isAudienceSelected = audienceCount.visible > 0;
                      return (
                        <>
                          {isAudienceSelected && (
                            <div className="flex-shrink-0">
                              <GreenTickIcon />
                            </div>
                          )}
                          {!isAudienceSelected && (
                            <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                          )}
                        </>
                      );
                    })()}
                    <div>
                      <h3 className="text-sm font-bold text-[#101828]">Choose Audience</h3>
                      <p className="text-xs text-[#6a7282] mt-1">Select your target audience based on filters</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAudienceSection(!showAudienceSection)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showAudienceSection ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                </div>

                {showAudienceSection && (
                  <div className="border-t border-[rgba(151,71,255,0.2)] pt-6">
                    <DataCenterFilters
                      key={clearFiltersTrigger}
                      onFiltersChange={(filters) => {
                        setAudienceFilters(filters);
                        // Here you would typically fetch audience count based on filters
                        // For now, we'll use mock data
                        const hasFilters = Object.keys(filters).some(key => {
                          const value = filters[key as keyof typeof filters];
                          if (Array.isArray(value)) return value.length > 0;
                          return value !== undefined && value !== '';
                        });
                        setAudienceCount({
                          total: hasFilters ? 1250 : 0,
                          visible: hasFilters ? 1250 : 0
                        });
                      }}
                      totalUsers={audienceCount.total}
                      visibleUsers={audienceCount.visible}
                      showUserCount={false}
                      showFilterByLabel={false}
                      showSearchBar={true}
                      showImportButton={true}
                      onImportClick={() => {
                        // Handle import CSV functionality
                        console.log('Import CSV clicked');
                        // TODO: Implement CSV import logic
                      }}
                      clearFilters={clearFiltersTrigger > 0}
                    />
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#101828]">
                            {audienceCount.visible.toLocaleString()} customers selected
                          </p>
                          <p className="text-xs text-[#6a7282] mt-1">
                            {audienceCount.visible > 0 
                              ? 'These customers will receive your campaign message'
                              : 'Apply filters to select your target audience'}
                          </p>
                        </div>
                        {audienceCount.visible > 0 && (
                          <button
                            onClick={() => {
                              // Clear filters by incrementing trigger
                              setClearFiltersTrigger(prev => prev + 1);
                              setAudienceFilters({});
                              setAudienceCount({ total: 0, visible: 0 });
                            }}
                            className="text-xs font-medium text-[#9747FF] hover:text-[#8035e6]"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview with Suspense */}
          <Suspense fallback={
          <div className="w-[486px] bg-white border border-[#f6f6f6] rounded p-6 sticky top-10">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="bg-gray-100 rounded-[10px] h-[500px]"></div>
            </div>
            </div>
          }>
            {state.medium === 'sms' ? (
              <SMSPreview 
                bodyText={state.bodyText}
                variables={state.variables}
              />
            ) : (
              <WhatsAppPreview 
                headerState={state.headerState}
                bodyText={state.bodyText}
                footerText={state.footerText}
                buttons={state.buttons}
                variables={state.variables}
              />
            )}
          </Suspense>
        </div>
      </div>

        {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-[64px] right-0 bg-white border-t border-[#e9e9e9] px-10 py-4 flex items-center justify-between z-10 shadow-lg">
          <div className="text-sm text-[#9747FF]">Saved recent changes</div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-bold text-[#9747FF] hover:text-[#8035e6]">
              Save as draft
            </button>
          <button 
            onClick={handleSendCampaign}
            className="flex items-center gap-2 px-6 py-3 bg-[#9747FF] text-white text-sm font-bold rounded hover:bg-[#8035e6] transition-colors"
          >
              <Send className="w-4 h-4" />
              Send Campaign Now
            </button>
              </div>
            </div>

      {/* Success Confirmation Dialog */}
      {showSuccessDialog && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowSuccessDialog(false)}
          />
          
          {/* Dialog */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]">
            <div 
              className="w-96 border border-green-200 bg-white rounded-lg shadow-xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col items-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
                </div>

                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-[#2A2A2F] mb-2">
                    Campaign Sent for Review
                  </h3>
                  <p className="text-sm text-[#626266] leading-relaxed">
                    Your campaign has been successfully submitted for WhatsApp review. You&apos;ll be notified once it&apos;s approved.
                  </p>
                </div>

                {/* Action Button */}
                <div className="w-full mt-6">
                  <button
                    onClick={handleTrackCampaign}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#9747FF] text-white text-sm font-bold rounded hover:bg-[#8035e6] transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    Track Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
  );
}
