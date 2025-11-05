"use client";

import React, { useState } from 'react';
import { MobileHeaderButton } from "@/components/MobileHeaderButton";
import { useSidebar } from "@/components/SidebarContext";
import { BusinessDetailsForm } from './components/BusinessDetailsForm';
import { TemplatePicker } from './components/TemplatePicker';
import { InvoicePreview } from './components/InvoicePreview';
import { useToast } from '@/hooks/useToast';

interface InvoiceTemplatesContentProps {
  activeTab?: string;
}

export function InvoiceTemplatesContent({ activeTab: externalActiveTab }: InvoiceTemplatesContentProps) {
  const { success } = useToast();
  const [internalActiveTab, setInternalActiveTab] = useState<'template-preview' | 'business-details'>('template-preview');

  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab;

  // Business details state
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    logo: null as File | null,
    address: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    email: '',
    gstin: '',
    pan: '',
    cin: '',
    placeOfSupply: '',
    signature: null as File | null,
    // Footer content fields
    termsConditions: '• Payment due within 30 days\n• Late payment charges may apply\n• Goods once sold will not be taken back',
    declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
    // Footer visibility toggles
    showPhone: true,
    showEmail: true,
    showGSTIN: true,
    showPAN: false,
    showCIN: false,
    showSignature: false,
    showTermsConditions: true,
    showDeclaration: true,
  });

  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<'basic' | 'modern' | 'elegant'>('basic');
  const [selectedFormat, setSelectedFormat] = useState<'regular' | 'mobile'>('mobile');

  const handleSave = () => {
    success('Your invoice template settings have been saved successfully.');
  };

  const handleReset = () => {
    setBusinessDetails({
      businessName: '',
      logo: null,
      address: '',
      city: '',
      state: '',
      pin: '',
      phone: '',
      email: '',
      gstin: '',
      pan: '',
      cin: '',
      placeOfSupply: '',
      signature: null,
      // Footer content fields
      termsConditions: '• Payment due within 30 days\n• Late payment charges may apply\n• Goods once sold will not be taken back',
      declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
      // Footer visibility toggles
      showPhone: true,
      showEmail: true,
      showGSTIN: true,
      showPAN: false,
      showCIN: false,
      showSignature: false,
      showTermsConditions: true,
      showDeclaration: true,
    });
    setSelectedTemplate('basic');
    success('All invoice template settings have been reset to default values.');
  };

  return (
    <>
      {/* Tab Navigation - Only show when used standalone */}
      {!externalActiveTab && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setInternalActiveTab('template-preview')}
            className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
              activeTab === 'template-preview'
                ? 'bg-[rgba(151,71,255,0.05)] text-[#9747FF] border-[#9747FF]'
                : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#9747FF0D] hover:text-[#9747FF] hover:border-[#9747FF]'
            }`}
          >
            Template & Preview
          </button>
          <button
            onClick={() => setInternalActiveTab('business-details')}
            className={`h-8 px-3 py-1 rounded-[4px] text-[13.563px] leading-[19.6px] tracking-[-0.1px] font-medium transition-colors border ${
              activeTab === 'business-details'
                ? 'bg-[rgba(151,71,255,0.05)] text-[#9747FF] border-[#9747FF]'
                : 'bg-white text-gray-700 border-[#e9e9e9] hover:bg-[#9747FF0D] hover:text-[#9747FF] hover:border-[#9747FF]'
            }`}
          >
            Business Details
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'template-preview' && (
          <TemplatePicker
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
          />
        )}

        {activeTab === 'business-details' && (
          <BusinessDetailsForm
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            onSave={handleSave}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Live Preview Section - Only show for Template & Preview tab */}
      {activeTab === 'template-preview' && (
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <p className="text-sm text-gray-600">
              See how your invoice will look in {selectedFormat === 'mobile' ? 'mobile devices' : 'regular format'}
            </p>
          </div>

          <InvoicePreview
            businessDetails={businessDetails}
            selectedTemplate={selectedTemplate}
            selectedFormat={selectedFormat}
          />
        </div>
      )}
    </>
  );
}
