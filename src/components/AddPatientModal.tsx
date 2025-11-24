'use client';

import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle2, Loader2, ChevronDownIcon, UserPlus } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type TreatmentCategory = 'Skin' | 'Hair' | 'Laser' | 'Medical' | 'Cosmetic' | 'PRP' | string;

const AddPatientModal = ({ isOpen, onClose, onSuccess }: AddPatientModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    treatmentCategory: '',
    dateOfBirth: undefined as Date | undefined,
    gender: '',
    occupation: '',
    area: '',
    source: '',
    preferredLanguage: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customCategories, setCustomCategories] = useState<TreatmentCategory[]>([]);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const defaultTreatmentCategoryOptions: TreatmentCategory[] = ['Skin', 'Hair', 'Laser', 'Medical', 'Cosmetic', 'PRP'];
  const allTreatmentCategoryOptions = [...defaultTreatmentCategoryOptions, ...customCategories];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryDropdownOpen]);

  const addCustomCategory = () => {
    const trimmedCategory = customCategoryInput.trim();
    if (trimmedCategory && !allTreatmentCategoryOptions.includes(trimmedCategory)) {
      setCustomCategories(prev => [...prev, trimmedCategory]);
      setFormData(prev => ({ ...prev, treatmentCategory: trimmedCategory }));
      setCustomCategoryInput('');
      setIsCategoryDropdownOpen(false);
    }
  };

  const handleChange = (name: string, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone Number is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the payload - only include fields that have values
      const payload: any = {
        name: formData.fullName.trim(),
        phone_number: formData.phoneNumber.trim(),
      };

      if (formData.dateOfBirth) {
        payload.date_of_birth = formData.dateOfBirth.toISOString().split('T')[0];
      }
      if (formData.gender) {
        payload.gender = formData.gender;
      }
      if (formData.occupation) {
        payload.occupation = formData.occupation.trim();
      }
      if (formData.area) {
        payload.area = formData.area.trim();
      }
      if (formData.source) {
        payload.source = formData.source;
      }
      if (formData.preferredLanguage) {
        payload.preferred_language = formData.preferredLanguage.trim();
      }
      if (formData.treatmentCategory) {
        payload.treatment_category = formData.treatmentCategory;
      }

      const response = await fetch(`${config.api.baseURL}/dashboard/v1/data_center/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create patient. Status: ${response.status}`);
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        treatmentCategory: '',
        dateOfBirth: undefined,
        gender: '',
        occupation: '',
        area: '',
        source: '',
        preferredLanguage: '',
      });
      setCustomCategories([]);
      setCustomCategoryInput('');
      
      // Call the callback to refetch data
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setSuccess(false);
          onClose();
        }, 1500);
      } else {
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }

    } catch (error: any) {
      setError(error.message || 'Failed to create patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white rounded-xl border border-[#e9e9e9] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9e9e9] bg-gradient-to-r from-[#9747FF]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#9747FF] flex items-center justify-center text-white text-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#2a2a2f]">
                Add New Patient/Client
              </h3>
              <p className="text-[12px] text-[#626266] mt-0.5">
                Enter the patient or client information below
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#626266] hover:text-[#2a2a2f] hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {success ? (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-[16px] font-medium text-green-600">Patient created successfully!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e9]">
                  <span className="text-[14px] font-semibold text-[#2a2a2f]">Basic Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        required
                        placeholder="Enter phone number"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Treatment Category */}
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="treatmentCategory" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Treatment Category <span className="text-[11px] font-normal text-[#626266]">(Optional)</span>
                      </Label>
                      <div className="relative" ref={categoryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-[4px] text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:ring-offset-2"
                        >
                          <span className="text-sm text-[#2a2a2f]">
                            {formData.treatmentCategory || 'Select treatment category...'}
                          </span>
                          <ChevronDownIcon className="w-4 h-4 opacity-50" />
                        </button>
                        {isCategoryDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-[#e9e9e9] rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
                            {allTreatmentCategoryOptions.map((category: TreatmentCategory) => {
                              const isSelected = formData.treatmentCategory === category;
                              return (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => {
                                    handleChange('treatmentCategory', category);
                                    setIsCategoryDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                                    isSelected ? 'bg-[#9747FF]/10' : ''
                                  }`}
                                >
                                  <span className={`w-4 h-4 border rounded-[4px] flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-[#9747FF] border-[#9747FF]' 
                                      : 'border-[#e9e9e9]'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                  <span>{category}</span>
                                </button>
                              );
                            })}
                            <div className="border-t border-[#e9e9e9] p-3 bg-gray-50">
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={customCategoryInput}
                                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                                  placeholder="Custom category..."
                                  className="flex-1 text-xs h-8"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addCustomCategory();
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={addCustomCategory}
                                  size="sm"
                                  disabled={!customCategoryInput.trim()}
                                  className="h-8 px-3 text-xs bg-[#9747FF] hover:bg-[#9747FF]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Selected Category Display */}
                      {formData.treatmentCategory && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[4px] bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                            {formData.treatmentCategory}
                            <button
                              type="button"
                              onClick={() => handleChange('treatmentCategory', '')}
                              className="hover:text-[#9747FF]/80 focus:outline-none"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Date of Birth
                      </Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="dateOfBirth"
                            className="w-full justify-between font-normal text-sm"
                          >
                            {formData.dateOfBirth ? formData.dateOfBirth.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.dateOfBirth}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              handleChange('dateOfBirth', date);
                              setDatePickerOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Gender <span className="text-[11px] font-normal text-[#626266]">(Optional)</span>
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                        <SelectTrigger id="gender" className="text-sm">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Occupation
                      </Label>
                      <Input
                        id="occupation"
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => handleChange('occupation', e.target.value)}
                        placeholder="Enter occupation"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Area / Apartment / Locality */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Area / Apartment / Locality
                      </Label>
                      <Input
                        id="area"
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                        placeholder="Enter area, apartment, or locality"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* How they found the clinic */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-[13px] font-semibold text-[#2a2a2f]">
                        How they found the clinic
                      </Label>
                      <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                        <SelectTrigger id="source" className="text-sm">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage" className="text-[13px] font-semibold text-[#2a2a2f]">
                        Preferred Language
                      </Label>
                      <Input
                        id="preferredLanguage"
                        type="text"
                        value={formData.preferredLanguage}
                        onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                        placeholder="Enter preferred language"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-[12px] text-red-600">{error}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e9e9e9]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-white text-sm rounded"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Patient'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;

