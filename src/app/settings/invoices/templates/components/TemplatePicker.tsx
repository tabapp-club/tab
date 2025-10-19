"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { classNames } from '../utils';

interface TemplatePickerProps {
  selectedTemplate: 'basic' | 'modern' | 'elegant';
  setSelectedTemplate: (template: 'basic' | 'modern' | 'elegant') => void;
  selectedFormat: 'regular' | 'mobile';
  setSelectedFormat: (format: 'regular' | 'mobile') => void;
}

const templates = [
  {
    id: 'basic' as const,
    name: 'Regular',
    description: 'Clean, single-column layout with minimal borders',
    features: ['Simple design', 'System fonts', 'Minimal borders', 'Mobile-friendly']
  },
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Bold headings with card layout and rounded corners',
    features: ['Bold headings', 'Card layout', 'Rounded corners', 'Soft separators']
  },
  {
    id: 'elegant' as const,
    name: 'Elegant',
    description: 'Serif headings with thin dividers and signature emphasis',
    features: ['Serif headings', 'Thin dividers', 'Light spacing', 'Signature emphasis']
  }
];

export function TemplatePicker({ selectedTemplate, setSelectedTemplate, selectedFormat, setSelectedFormat }: TemplatePickerProps) {

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Template Style</h3>
        <p className="text-sm text-gray-600 mb-6">
          Select a template that matches your business style. Choose between regular and mobile-friendly formats.
        </p>
      </div>

      {/* Format Selection Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg" aria-label="Format tabs">
          <button
            onClick={() => setSelectedFormat('mobile')}
            className={classNames(
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
              selectedFormat === 'mobile'
                ? "bg-white text-[#6E4EFF] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Mobile Friendly
          </button>
          <button
            onClick={() => setSelectedFormat('regular')}
            className={classNames(
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
              selectedFormat === 'regular'
                ? "bg-white text-[#6E4EFF] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Regular Format
          </button>
        </nav>
      </div>

      {/* Format Description */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              {selectedFormat === 'regular' ? 'Regular Format' : 'Mobile Friendly Format'}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {selectedFormat === 'regular' 
                ? 'Standard invoice format optimized for printing and desktop viewing. Perfect for formal business transactions and record keeping.'
                : 'Mobile-optimized format designed for viewing on smartphones. Ideal for SMS-delivered invoices and mobile-first customer experience.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={classNames(
              "relative border rounded-lg p-4 cursor-pointer transition-all duration-200 text-center",
              selectedTemplate === template.id
                ? "border-[#6E4EFF] bg-[#6E4EFF]/5"
                : template.id === 'basic'
                ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                : template.id === 'modern'
                ? "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            )}
            onClick={() => setSelectedTemplate(template.id)}
            role="radio"
            aria-checked={selectedTemplate === template.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedTemplate(template.id);
              }
            }}
          >
            {/* Selection indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#6E4EFF] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Template Icon */}
            <div className="mb-3">
              <div className={classNames(
                "w-12 h-12 mx-auto rounded-lg flex items-center justify-center",
                template.id === 'basic' 
                  ? "bg-gradient-to-br from-gray-100 to-gray-200" 
                  : template.id === 'modern'
                  ? "bg-gradient-to-br from-blue-100 to-blue-200"
                  : "bg-gradient-to-br from-purple-100 to-purple-200"
              )}>
                <div className={classNames(
                  "text-lg font-bold",
                  template.id === 'basic' 
                    ? "text-gray-700" 
                    : template.id === 'modern'
                    ? "text-blue-700"
                    : "text-purple-700"
                )}>
                  {template.id === 'basic' ? 'R' : template.id === 'modern' ? 'M' : 'E'}
                </div>
              </div>
            </div>

            {/* Template Name */}
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{template.name}</h4>
            
            {/* Template Description */}
            <p className="text-xs text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>

      {/* Template Preview Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Live Preview</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your selected template will be applied to the {selectedFormat === 'regular' ? 'regular' : 'mobile-friendly'} invoice preview on the right. 
              Changes to business details will update the preview in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
