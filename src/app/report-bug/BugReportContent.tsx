'use client';

import { useState } from 'react';
import { useSidebar } from '@/components/SidebarContext';
import { MobileHeaderButton } from '@/components/MobileHeaderButton';

interface BugReportData {
  title: string;
  description: string;
}

export function BugReportContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<BugReportData>({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<BugReportData>>({});

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BugReportData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    // Only title and description are required now

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));


      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 3000);

    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BugReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const { isCollapsed, isMobile } = useSidebar();
  const actualIsCollapsed = isMobile ? false : isCollapsed;
  const isFormValid = formData.title.trim().length > 0 && formData.description.trim().length > 0;

  if (showSuccess) {
    return (
      <main className={`flex-1 transition-sidebar ${
        actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
      }`}>
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <MobileHeaderButton />
        </div>

        <div className="h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#2a2a2f] mb-2">Bug Report Submitted!</h2>
            <p className="text-[#8f8f91] mb-4">Thank you for your feedback. Our team will review your report and get back to you soon.</p>
            <p className="text-sm text-[#8f8f91]">Form will reset in 3 seconds...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
            <div className="min-w-0">
              <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">Report a Bug</h1>
              <p className="text-[14px] text-[#8f8f91] font-normal mt-2">Help us improve by reporting issues you encounter</p>
            </div>
          </div>
        </header>

        {/* Bug Report Form */}
        <div className="bg-white rounded-lg border border-[#e9e9e9] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Bug Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${errors.title ? 'border-red-500' : 'border-[#e9e9e9]'}`}
                placeholder="Brief description of the issue"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Bug Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${errors.description ? 'border-red-500' : 'border-[#e9e9e9]'}`}
                placeholder="Provide a detailed description of the bug..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-5 h-9 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg  disabled:opacity-50 disabled:cursor-not-allowed  disabled:hover:shadow-none transition-all duration-300 ease-in-out  flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Bug'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
