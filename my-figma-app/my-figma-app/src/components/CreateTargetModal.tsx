"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetHeader,
  SheetFooter
} from "@/components/ui/sheet";

interface CreateTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTarget: (target: any) => void;
}

export function CreateTargetModal({ isOpen, onClose, onCreateTarget }: CreateTargetModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    unit: 'users',
    category: 'customers',
    deadline: '',
    icon: '🎯'
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTarget({
      ...formData,
      target: parseFloat(formData.target),
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
      deadline: '',
      icon: '🎯'
    });
    onClose();
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setOpenDropdown(null);
  };

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'users': return 'Users';
      case '₹': return '₹ (Rupees)';
      case '%': return '% (Percentage)';
      case 'visits': return 'Visits';
      default: return 'Users';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'customers': return 'Customers';
      case 'sales': return 'Sales';
      case 'engagement': return 'Engagement';
      case 'retention': return 'Retention';
      default: return 'Customers';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-[384px] sm:max-w-md md:w-[480px] md:max-w-lg lg:w-2/5 lg:max-w-none p-0 overflow-y-auto"
      >
        <SheetTitle className="sr-only">Create New Target</SheetTitle>
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Create New Target</h2>
          </SheetHeader>

          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Reach 10K Active Users"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your target..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('unit')}
                      className="w-full bg-white h-10 px-3 py-2 border border-[#e9e9e9] rounded flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
                        {getUnitLabel(formData.unit)}
                      </span>
                      <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
                        <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>

                    {openDropdown === 'unit' && (
                      <div className="absolute top-full mt-1 left-0 bg-white border border-[#e9e9e9] rounded z-50 w-full min-w-[180px] shadow-lg">
                        <div className="px-4 py-2 bg-white border-b border-gray-100">
                          <span className="text-[12px] text-[#626266]">Select Unit</span>
                        </div>
                        <div className="py-2">
                          {[
                            { value: 'users', label: 'Users' },
                            { value: '₹', label: '₹ (Rupees)' },
                            { value: '%', label: '% (Percentage)' },
                            { value: 'visits', label: 'Visits' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleOptionSelect('unit', option.value)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-[14px] text-[#2a2a2f] tracking-[0.15px]"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('category')}
                      className="w-full bg-white h-10 px-3 py-2 border border-[#e9e9e9] rounded flex items-center justify-between overflow-hidden hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
                        {getCategoryLabel(formData.category)}
                      </span>
                      <div className="flex-shrink-0 w-[22px] h-full flex items-center justify-center">
                        <svg width="7.5" height="4.518" viewBox="0 0 7.5 4.518" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L3.75 3.518L6.5 1" stroke="#2A2A2F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>

                    {openDropdown === 'category' && (
                      <div className="absolute top-full mt-1 left-0 bg-white border border-[#e9e9e9] rounded z-50 w-full min-w-[180px] shadow-lg">
                        <div className="px-4 py-2 bg-white border-b border-gray-100">
                          <span className="text-[12px] text-[#626266]">Select Category</span>
                        </div>
                        <div className="py-2">
                          {[
                            { value: 'customers', label: 'Customers' },
                            { value: 'sales', label: 'Sales' },
                            { value: 'engagement', label: 'Engagement' },
                            { value: 'retention', label: 'Retention' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleOptionSelect('category', option.value)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-[14px] text-[#2a2a2f] tracking-[0.15px]"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['🎯', '👥', '💰', '📈', '🔄', '⭐', '🚀', '🏆'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded border-2 flex items-center justify-center text-lg transition-colors ${
                        formData.icon === icon
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <SheetFooter className="border-t border-gray-100 px-6 py-4">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                className="flex-1"
              >
                Create Target
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
