'use client';

import { useState } from 'react';

interface CreateCampaignModalProps {
  onClose: () => void;
}

const CreateCampaignModal = ({ onClose }: CreateCampaignModalProps) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'engagement' as 'feedback' | 'retention' | 'engagement' | 'advertise',
    description: '',
    budget: '',
    audience: '',
    startDate: '',
    endDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const campaignTypes = [
    { value: 'feedback', label: 'Feedback & Survey' },
    { value: 'retention', label: 'Retention' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'advertise', label: 'Advertise' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!campaignData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    if (!campaignData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!campaignData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(Number(campaignData.budget)) || Number(campaignData.budget) <= 0) {
      newErrors.budget = 'Budget must be a valid positive number';
    }
    if (!campaignData.audience) {
      newErrors.audience = 'Audience size is required';
    } else if (isNaN(Number(campaignData.audience)) || Number(campaignData.audience) <= 0) {
      newErrors.audience = 'Audience size must be a valid positive number';
    }
    if (!campaignData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!campaignData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (campaignData.startDate && new Date(campaignData.endDate) <= new Date(campaignData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Creating campaign:', campaignData);

      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Transparent blur background overlay */}
      <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10"></div>

      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              value={campaignData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter campaign name"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </label>
            <select
              value={campaignData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent"
            >
              {campaignTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={campaignData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe your campaign objectives and strategy"
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Budget and Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (USD) *
              </label>
              <input
                type="number"
                value={campaignData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent ${
                  errors.budget ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.budget && <p className="text-red-600 text-xs mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience Size *
              </label>
              <input
                type="number"
                value={campaignData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent ${
                  errors.audience ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.audience && <p className="text-red-600 text-xs mt-1">{errors.audience}</p>}
            </div>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={campaignData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent ${
                  errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={campaignData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7856FF] focus:border-transparent ${
                  errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                min={campaignData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#7856FF] text-white hover:bg-[#6B46E5]'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Icon Components
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export { CreateCampaignModal };
