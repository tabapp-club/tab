"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Sidepane, SidepaneSection } from '@/components/Sidepane';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';

interface CreateTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTarget: (target: any) => void;
}

// Icon components
const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CategoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export function CreateTargetModal({ isOpen, onClose, onCreateTarget }: CreateTargetModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    unit: 'users',
    category: 'customers',
    deadline: undefined as Date | undefined,
    icon: '🎯'
  });

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.target || !formData.deadline) {
      return;
    }

    onCreateTarget({
      ...formData,
      target: parseFloat(formData.target),
      deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : '',
      current: 0,
      progress: 0,
      status: 'active',
      color: 'bg-blue-500'
    });
    setFormData({
      title: '',
      description: '',
      target: '',
      unit: 'users',
      category: 'customers',
      deadline: undefined,
      icon: '🎯'
    });
    onClose();
  }, [formData, onCreateTarget, onClose]);

  // Header Content
  const headerContent = useMemo(() => {
  return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-300">
            <span className="text-2xl">{formData.icon || '🎯'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#2a2a2f] mb-1">
              {formData.title || 'New Target'}
            </h3>
            <p className="text-sm text-[#626266] line-clamp-2">
              {formData.description || 'Create a new target to track your business milestones'}
            </p>
          </div>
        </div>
      </div>
    );
  }, [formData.icon, formData.title, formData.description]);

  // Build sections
  const sections = useMemo<SidepaneSection[]>(() => {
    return [
      {
        id: 'target-details',
        title: 'Target Details',
        icon: <TargetIcon className="w-5 h-5 text-gray-600" />,
        content: (
          <div className="space-y-4">
              <div>
              <Label htmlFor="target-title" className="block text-xs font-semibold text-gray-600 mb-2">
                  Target Title
              </Label>
                <input
                id="target-title"
                  type="text"
                  value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                  placeholder="e.g., Reach 10K Active Users"
                  required
                />
              </div>

              <div>
              <Label htmlFor="target-description" className="block text-xs font-semibold text-gray-600 mb-2">
                  Description
              </Label>
                <textarea
                id="target-description"
                  value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px] px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-[4px] resize-none focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                placeholder="Describe your target and what you want to achieve..."
                rows={4}
                  required
                />
              </div>
          </div>
        )
      },
      {
        id: 'target-metrics',
        title: 'Target Metrics',
        icon: <CategoryIcon className="w-5 h-5 text-gray-600" />,
        content: (
          <div className="grid grid-cols-2 gap-3">
                <div>
              <Label htmlFor="target-value" className="block text-xs font-semibold text-gray-600 mb-2">
                    Target Value
              </Label>
                  <input
                id="target-value"
                    type="number"
                    value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                    placeholder="10000"
                    required
                  />
                </div>

                <div>
              <Label htmlFor="target-unit" className="block text-xs font-semibold text-gray-600 mb-2">
                    Unit
              </Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger id="target-unit" className="rounded-[4px] border-gray-200 focus:ring-[#9747FF] focus:border-[#9747FF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[4px]">
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="₹">₹ (Rupees)</SelectItem>
                  <SelectItem value="%">% (Percentage)</SelectItem>
                  <SelectItem value="visits">Visits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      },
      {
        id: 'category-deadline',
        title: 'Category & Deadline',
        icon: <CalendarIcon className="w-5 h-5 text-gray-600" />,
        content: (
          <div className="space-y-4">
            <div>
              <Label className="block text-xs font-semibold text-gray-600 mb-2">
                Category
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'customers', label: 'Customers', icon: '👥' },
                  { value: 'sales', label: 'Sales', icon: '💰' },
                  { value: 'engagement', label: 'Engagement', icon: '📈' },
                  { value: 'retention', label: 'Retention', icon: '🔄' }
                ].map((category) => {
                  const isSelected = formData.category === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                      className="p-4 rounded-lg transition-all relative bg-gray-50 hover:bg-gray-100"
                      style={{
                        border: `0.5px solid ${isSelected ? '#9747FF' : '#e5e7eb'}`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                            {category.label}
                      </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#9747FF] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                      </div>
                    )}
                      </div>
                    </button>
                  );
                })}
                  </div>
                </div>

                <div>
              <Label className="block text-xs font-semibold text-gray-600 mb-2">
                    Deadline
              </Label>
              <DatePicker
                selected={formData.deadline}
                onSelect={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
                placeholder="Select deadline"
                minDate={new Date()}
                className="w-full"
                  />
                </div>
              </div>
        )
      },
      {
        id: 'icon',
        title: 'Target Icon',
        icon: <SparklesIcon className="w-5 h-5 text-gray-600" />,
        content: (
          <div className="flex gap-3 flex-wrap">
            {['🎯', '👥', '💰', '📈', '🔄', '⭐', '🚀', '🏆'].map((icon) => {
              const isSelected = formData.icon === icon;
              return (
                    <button
                      key={icon}
                      type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                    isSelected
                      ? 'bg-purple-50 scale-110'
                      : 'bg-white hover:bg-gray-50'
                      }`}
                  style={{
                    border: `0.5px solid ${isSelected ? '#9747FF' : '#e5e7eb'}`
                  }}
                    >
                      {icon}
                    </button>
              );
            })}
          </div>
        )
      }
    ];
  }, [formData]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return formData.title !== '' && 
           formData.description !== '' && 
           formData.target !== '' && 
           formData.deadline !== undefined;
  }, [formData]);

  // Footer Content
  const footerContent = useMemo(() => {
    return (
      <div className="flex justify-end gap-3">
        <button
                type="button"
                onClick={onClose}
          className="font-semibold py-3 px-6 transition-colors border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-[4px]"
              >
                Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!isFormValid}
          className={`font-semibold py-3 px-4 transition-colors flex items-center justify-center gap-2 rounded-[4px] ${
            isFormValid 
              ? 'bg-[#9747FF] text-white hover:bg-[#8636ee] cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
              >
          <TargetIcon className="w-5 h-5" />
                Create Target
        </button>
            </div>
    );
  }, [isFormValid, onClose, handleSubmit]);

  return (
    <Sidepane
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Target"
      headerContent={headerContent}
      sections={sections}
      footerContent={footerContent}
    />
  );
}
