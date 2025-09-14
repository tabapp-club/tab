"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomDropdown from "@/components/ui/CustomDropdown";

interface BusinessDetailsData {
  // Basic Information
  brandName: string;
  businessType: string;
  logo: string;
  
  // Contact Information
  email: string;
  phone: string;
  website: string;
  
  // Address Information
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Business Registration
  gstNumber: string;
  panNumber: string;
  businessRegistrationNumber: string;
  
  // Banking Information
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  
  // Policies and Terms
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
  shippingPolicy: string;
  
  // Additional Information
  description: string;
  foundedYear: string;
  employeeCount: string;
}

export function BusinessDetails() {
  const [formData, setFormData] = useState<BusinessDetailsData>({
    brandName: '',
    businessType: '',
    logo: '',
    email: '',
    phone: '',
    website: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    gstNumber: '',
    panNumber: '',
    businessRegistrationNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    termsAndConditions: '',
    privacyPolicy: '',
    refundPolicy: '',
    shippingPolicy: '',
    description: '',
    foundedYear: '',
    employeeCount: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load business details from localStorage on component mount
  useEffect(() => {
    const savedDetails = localStorage.getItem('businessDetails');
    if (savedDetails) {
      setFormData(JSON.parse(savedDetails));
    }
  }, []);

  const handleInputChange = (field: keyof BusinessDetailsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('businessDetails', JSON.stringify(formData));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving business details:', error);
      alert('Error saving details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">Business details saved successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  placeholder="Enter your brand name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <CustomDropdown
                  options={[
                    { value: "retail", label: "Retail" },
                    { value: "restaurant", label: "Restaurant" },
                    { value: "services", label: "Services" },
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "wholesale", label: "Wholesale" },
                    { value: "ecommerce", label: "E-commerce" },
                    { value: "consulting", label: "Consulting" },
                    { value: "other", label: "Other" }
                  ]}
                  value={formData.businessType}
                  onChange={(value) => handleInputChange('businessType', value)}
                  placeholder="Select business type"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {formData.logo && (
                  <img 
                    src={formData.logo} 
                    alt="Business Logo" 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center w-full h-10 px-4 py-2 border border-gray-300 rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Choose File
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload your business logo (PNG, JPG, SVG)</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your business..."
                rows={3}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Business Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <Input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                placeholder="123 Main Street, Building Name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="400001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <CustomDropdown
                options={[
                  { value: "India", label: "India" },
                  { value: "United States", label: "United States" },
                  { value: "United Kingdom", label: "United Kingdom" },
                  { value: "Canada", label: "Canada" },
                  { value: "Australia", label: "Australia" },
                  { value: "Germany", label: "Germany" },
                  { value: "France", label: "France" },
                  { value: "Japan", label: "Japan" },
                  { value: "Other", label: "Other" }
                ]}
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                placeholder="Select country"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Business Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                <Input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  placeholder="22ABCDE1234F1Z5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number
                </label>
                <Input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Registration Number
              </label>
              <Input
                type="text"
                value={formData.businessRegistrationNumber}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                placeholder="U74999MH2014PTC123456"
              />
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Banking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <Input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="State Bank of India"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <Input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <Input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                placeholder="SBIN0001234"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <Input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  placeholder="2020"
                  min="1900"
                  max="2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Count
                </label>
                <CustomDropdown
                  options={[
                    { value: "1-10", label: "1-10" },
                    { value: "11-50", label: "11-50" },
                    { value: "51-200", label: "51-200" },
                    { value: "201-500", label: "201-500" },
                    { value: "500+", label: "500+" }
                  ]}
                  value={formData.employeeCount}
                  onChange={(value) => handleInputChange('employeeCount', value)}
                  placeholder="Select employee count"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Terms and Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions
              </label>
              <textarea
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                placeholder="Enter your terms and conditions..."
                rows={4}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Policy
              </label>
              <textarea
                value={formData.privacyPolicy}
                onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
                placeholder="Enter your privacy policy..."
                rows={4}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Policy
              </label>
              <textarea
                value={formData.refundPolicy}
                onChange={(e) => handleInputChange('refundPolicy', e.target.value)}
                placeholder="Enter your refund policy..."
                rows={4}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Policy
              </label>
              <textarea
                value={formData.shippingPolicy}
                onChange={(e) => handleInputChange('shippingPolicy', e.target.value)}
                placeholder="Enter your shipping policy..."
                rows={4}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Reset form
              setFormData({
                brandName: '',
                businessType: '',
                logo: '',
                email: '',
                phone: '',
                website: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                gstNumber: '',
                panNumber: '',
                businessRegistrationNumber: '',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                termsAndConditions: '',
                privacyPolicy: '',
                refundPolicy: '',
                shippingPolicy: '',
                description: '',
                foundedYear: '',
                employeeCount: ''
              });
            }}
            className="w-full sm:w-auto"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#7856ff] hover:bg-[#6d46e5] w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Business Details'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
