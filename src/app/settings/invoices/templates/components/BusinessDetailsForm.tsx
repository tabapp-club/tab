"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Building2, MapPin, Phone, Mail, FileText, Signature } from 'lucide-react';
import { validateGSTIN, validatePAN, validatePIN, validateEmail, validatePhone, classNames } from '../utils';

interface BusinessDetails {
  businessName: string;
  logo: File | null;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  cin: string;
  placeOfSupply: string;
  signature: File | null;
  // Footer content fields
  termsConditions: string;
  declaration: string;
  // Footer visibility toggles
  showPhone: boolean;
  showEmail: boolean;
  showGSTIN: boolean;
  showPAN: boolean;
  showCIN: boolean;
  showSignature: boolean;
  showTermsConditions: boolean;
  showDeclaration: boolean;
}

interface BusinessDetailsFormProps {
  businessDetails: BusinessDetails;
  setBusinessDetails: (details: BusinessDetails) => void;
  onSave: () => void;
  onReset: () => void;
}

export function BusinessDetailsForm({ businessDetails, setBusinessDetails, onSave, onReset }: BusinessDetailsFormProps) {
  const [errors, setErrors] = useState<Partial<BusinessDetails>>({});
  const logoRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof BusinessDetails, value: string | File | null) => {
    setBusinessDetails({ ...businessDetails, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateField = (field: keyof BusinessDetails, value: string): string => {
    switch (field) {
      case 'gstin':
        return value && !validateGSTIN(value) ? 'Invalid GSTIN format' : '';
      case 'pan':
        return value && !validatePAN(value) ? 'Invalid PAN format' : '';
      case 'pin':
        return value && !validatePIN(value) ? 'Invalid PIN code (6 digits required)' : '';
      case 'email':
        return value && !validateEmail(value) ? 'Invalid email format' : '';
      case 'phone':
        return value && !validatePhone(value) ? 'Invalid phone number' : '';
      case 'businessName':
        return !value ? 'Business name is required' : '';
      case 'address':
        return !value ? 'Address is required' : '';
      case 'city':
        return !value ? 'City is required' : '';
      case 'state':
        return !value ? 'State is required' : '';
      case 'placeOfSupply':
        return !value ? 'Place of supply is required' : '';
      default:
        return '';
    }
  };

  const handleBlur = (field: keyof BusinessDetails) => {
    const error = validateField(field, businessDetails[field] as string);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleFileUpload = (field: 'logo' | 'signature', file: File | null) => {
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, [field]: 'Please upload a valid image file (JPEG, PNG)' });
        return;
      }
      
      if (file.size > maxSize) {
        setErrors({ ...errors, [field]: 'File size must be less than 2MB' });
        return;
      }
    }
    
    handleInputChange(field, file);
  };

  const handleSave = () => {
    const newErrors: Partial<BusinessDetails> = {};
    
    // Validate required fields
    const requiredFields: (keyof BusinessDetails)[] = [
      'businessName', 'address', 'city', 'state', 'pin', 'phone', 'email', 'gstin', 'placeOfSupply'
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, businessDetails[field] as string);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        
        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={businessDetails.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              onBlur={() => handleBlur('businessName')}
              className={classNames(
                "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                errors.businessName ? "border-red-300" : "border-gray-300"
              )}
              placeholder="Enter business name"
            />
          </div>
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
          )}
        </div>

        {/* Logo Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Logo
          </label>
          <div className="flex items-center space-x-4">
            {businessDetails.logo ? (
              <div className="flex items-center space-x-2">
                <img
                  src={URL.createObjectURL(businessDetails.logo)}
                  alt="Business logo"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => handleInputChange('logo', null)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Logo</span>
              </button>
            )}
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('logo', e.target.files?.[0] || null)}
            className="hidden"
          />
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Recommended: 200x200px, max 2MB</p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              value={businessDetails.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              rows={3}
              className={classNames(
                "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] resize-none",
                errors.address ? "border-red-300" : "border-gray-300"
              )}
              placeholder="Enter complete address"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* City, State, PIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={businessDetails.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={classNames(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                errors.city ? "border-red-300" : "border-gray-300"
              )}
              placeholder="City"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={businessDetails.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              className={classNames(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                errors.state ? "border-red-300" : "border-gray-300"
              )}
              placeholder="State"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              value={businessDetails.pin}
              onChange={(e) => handleInputChange('pin', e.target.value)}
              onBlur={() => handleBlur('pin')}
              className={classNames(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                errors.pin ? "border-red-300" : "border-gray-300"
              )}
              placeholder="PIN Code"
              maxLength={6}
            />
            {errors.pin && (
              <p className="mt-1 text-sm text-red-600">{errors.pin}</p>
            )}
          </div>
        </div>

        {/* Phone and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={businessDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={classNames(
                  "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                  errors.phone ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={businessDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={classNames(
                  "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                  errors.email ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
        
        {/* GSTIN */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GSTIN *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={businessDetails.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('gstin')}
              className={classNames(
                "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
                errors.gstin ? "border-red-300" : "border-gray-300"
              )}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
          </div>
          {errors.gstin && (
            <p className="mt-1 text-sm text-red-600">{errors.gstin}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">15-character GSTIN format</p>
        </div>

        {/* PAN */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN (Optional)
          </label>
          <input
            type="text"
            value={businessDetails.pan}
            onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('pan')}
            className={classNames(
              "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
              errors.pan ? "border-red-300" : "border-gray-300"
            )}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
          {errors.pan && (
            <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
          )}
        </div>

        {/* CIN */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CIN (Optional)
          </label>
          <input
            type="text"
            value={businessDetails.cin}
            onChange={(e) => handleInputChange('cin', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]"
            placeholder="U12345AB1234ABC123456"
          />
        </div>

        {/* Place of Supply */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place of Supply *
          </label>
          <input
            type="text"
            value={businessDetails.placeOfSupply}
            onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
            onBlur={() => handleBlur('placeOfSupply')}
            className={classNames(
              "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]",
              errors.placeOfSupply ? "border-red-300" : "border-gray-300"
            )}
            placeholder="State where supply is made"
          />
          {errors.placeOfSupply && (
            <p className="mt-1 text-sm text-red-600">{errors.placeOfSupply}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature & Seal</h3>
        
        {/* Signature Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature/Seal (Optional)
          </label>
          <div className="flex items-center space-x-4">
            {businessDetails.signature ? (
              <div className="flex items-center space-x-2">
                <img
                  src={URL.createObjectURL(businessDetails.signature)}
                  alt="Signature"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => handleInputChange('signature', null)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signatureRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Signature className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Signature</span>
              </button>
            )}
          </div>
          <input
            ref={signatureRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('signature', e.target.files?.[0] || null)}
            className="hidden"
          />
          {errors.signature && (
            <p className="mt-1 text-sm text-red-600">{errors.signature}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Recommended: 200x100px, max 2MB</p>
        </div>
      </div>

      {/* Footer Content */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Content</h3>
        <p className="text-sm text-gray-600 mb-4">
          Customize the terms, conditions, and declaration text for your invoices
        </p>
        
        {/* Terms & Conditions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            value={businessDetails.termsConditions}
            onChange={(e) => handleInputChange('termsConditions', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]"
            placeholder="Enter your terms and conditions (e.g., Payment due within 30 days, Late payment charges may apply, etc.)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use bullet points or line breaks to separate different terms
          </p>
        </div>

        {/* Declaration */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Declaration Statement
          </label>
          <textarea
            value={businessDetails.declaration}
            onChange={(e) => handleInputChange('declaration', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF]"
            placeholder="Enter your declaration statement (e.g., We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Standard legal declaration for invoice authenticity
          </p>
        </div>
      </div>

      {/* Footer Visibility Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Footer Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose which information to display in your invoice footer
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Phone Number</div>
                <div className="text-xs text-gray-500">Show contact phone</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showPhone}
                onChange={(e) => handleInputChange('showPhone', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* Email Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Email Address</div>
                <div className="text-xs text-gray-500">Show contact email</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showEmail}
                onChange={(e) => handleInputChange('showEmail', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* GSTIN Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">GSTIN</div>
                <div className="text-xs text-gray-500">Show tax registration</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showGSTIN}
                onChange={(e) => handleInputChange('showGSTIN', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* PAN Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">PAN</div>
                <div className="text-xs text-gray-500">Show PAN number</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showPAN}
                onChange={(e) => handleInputChange('showPAN', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* CIN Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">CIN</div>
                <div className="text-xs text-gray-500">Show company registration</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showCIN}
                onChange={(e) => handleInputChange('showCIN', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* Signature Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Signature className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Signature/Seal</div>
                <div className="text-xs text-gray-500">Show signature image</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showSignature}
                onChange={(e) => handleInputChange('showSignature', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* Terms & Conditions Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Terms & Conditions</div>
                <div className="text-xs text-gray-500">Show payment terms</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showTermsConditions}
                onChange={(e) => handleInputChange('showTermsConditions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>

          {/* Declaration Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Declaration</div>
                <div className="text-xs text-gray-500">Show legal declaration</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.showDeclaration}
                onChange={(e) => handleInputChange('showDeclaration', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9747FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9747FF]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-[#9747FF] to-[#9747FF] text-white px-6 py-3 rounded-md font-semibold hover:from-[#9747FF] hover:to-[#9747FF] transition-all duration-300"
        >
          Save Settings
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
