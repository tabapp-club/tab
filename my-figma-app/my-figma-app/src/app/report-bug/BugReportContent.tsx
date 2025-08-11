'use client';

import { useState } from 'react';
import { useSidebar } from '@/components/SidebarContext';
import { MobileMenuToggle } from '@/components/MobileMenuToggle';

interface BugReportData {
  title: string;
  description: string;
  category: string;
  priority: string;
  steps: string;
  expected: string;
  actual: string;
  browser: string;
  device: string;
  screenshot?: File | null;
}

export function BugReportContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<BugReportData>({
    title: '',
    description: '',
    category: 'ui',
    priority: 'medium',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    device: '',
    screenshot: null,
  });

  const [errors, setErrors] = useState<Partial<BugReportData>>({});

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'ui',
      priority: 'medium',
      steps: '',
      expected: '',
      actual: '',
      browser: '',
      device: '',
      screenshot: null,
    });
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
    if (!formData.steps.trim()) {
      newErrors.steps = 'Steps to reproduce are required';
    }
    if (!formData.expected.trim()) {
      newErrors.expected = 'Expected behavior is required';
    }
    if (!formData.actual.trim()) {
      newErrors.actual = 'Actual behavior is required';
    }

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

      console.log('Bug Report Submitted:', formData);

      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error submitting bug report:', error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  const { isCollapsed, isMobile } = useSidebar();
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  if (showSuccess) {
    return (
      <main className={`flex-1 transition-sidebar ${
        actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
      }`}>
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <MobileMenuToggle />
        </div>

        <div className="h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
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
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">Report a Bug</h1>
              <p className="text-sm sm:text-base text-[#8f8f91] font-medium mt-2">Help us improve by reporting issues you encounter</p>
            </div>
          </div>
        </header>

        {/* Bug Report Form */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e9e9e9] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#2a2a2f] mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Bug Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-[#e9e9e9]'
                    }`}
                    placeholder="Brief description of the issue"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  >
                    <option value="ui">UI/UX Issue</option>
                    <option value="functionality">Functionality</option>
                    <option value="performance">Performance</option>
                    <option value="data">Data Issue</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-[#6E4EFF] file:text-white hover:file:bg-[#5D3EE8]"
                  />
                  <p className="text-xs text-[#8f8f91] mt-1">Max file size: 5MB</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                  Bug Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-[#e9e9e9]'
                  }`}
                  placeholder="Provide a detailed description of the bug..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Reproduction Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#2a2a2f] mb-4">Reproduction Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Steps to Reproduce *
                  </label>
                  <textarea
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${
                      errors.steps ? 'border-red-500' : 'border-[#e9e9e9]'
                    }`}
                    placeholder="1. Go to... &#10;2. Click on... &#10;3. Observe that..."
                  />
                  {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                      Expected Behavior *
                    </label>
                    <textarea
                      value={formData.expected}
                      onChange={(e) => handleInputChange('expected', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${
                        errors.expected ? 'border-red-500' : 'border-[#e9e9e9]'
                      }`}
                      placeholder="What should happen?"
                    />
                    {errors.expected && <p className="text-red-500 text-sm mt-1">{errors.expected}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                      Actual Behavior *
                    </label>
                    <textarea
                      value={formData.actual}
                      onChange={(e) => handleInputChange('actual', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent ${
                        errors.actual ? 'border-red-500' : 'border-[#e9e9e9]'
                      }`}
                      placeholder="What actually happens?"
                    />
                    {errors.actual && <p className="text-red-500 text-sm mt-1">{errors.actual}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#2a2a2f] mb-4">Environment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Browser & Version
                  </label>
                  <input
                    type="text"
                    value={formData.browser}
                    onChange={(e) => handleInputChange('browser', e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                    placeholder="e.g., Chrome 121.0.6167.139"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">
                    Device & OS
                  </label>
                  <input
                    type="text"
                    value={formData.device}
                    onChange={(e) => handleInputChange('device', e.target.value)}
                    className="w-full px-3 py-2 border border-[#e9e9e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent"
                    placeholder="e.g., MacBook Pro M1, macOS 14.2"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#e9e9e9]">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none px-6 py-3 border border-[#e9e9e9] text-[#626266] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#6E4EFF] text-white rounded-lg hover:bg-[#5D3EE8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
