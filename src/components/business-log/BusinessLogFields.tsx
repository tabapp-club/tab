"use client";

import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'percentage';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export function BusinessLogFields() {
  const { user } = useAuth();
  const token = user?.accessToken;
  const businessId = user?.business_id;

  const { data: apiFields, isLoading, error } = useQuery({
    queryKey: ['customFields', businessId],
    queryFn: async () => {
      if (!token || !businessId) throw new Error('Not authenticated');
      const response = await api.business.getCustomFields(token, businessId);
      return response.data;
    },
    enabled: !!token && !!businessId,
  });

  const [customFields, setCustomFields] = useState<DynamicField[]>([]);

  // Map API fields to DynamicField format
  useEffect(() => {
    if (apiFields) {
      const mappedFields: DynamicField[] = apiFields.map((field, index) => ({
        id: `api-${index}`,
        type: field.field_type.toLowerCase() as DynamicField['type'], // Assuming API uses "Percentage" -> "percentage"
        label: field.label,
        required: field.required,
        placeholder: field.placeholder,
      }));
      setCustomFields(mappedFields);
    }
  }, [apiFields]);







  const renderFieldPreview = (field: DynamicField) => {
    switch (field.type) {
      case 'select':
        return (
          <select className="w-full h-10 px-3 py-2 border border-[#d1d5db] rounded bg-gray-50 text-sm" disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options && field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            disabled
            className="w-full border border-[#d1d5db] rounded px-3 py-2 bg-gray-50 text-sm"
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              disabled
              className="h-4 w-4 text-[#6E4EFF] focus:ring-[#6E4EFF] border-[#d1d5db] rounded bg-gray-50"
            />
            <label className="ml-2 text-sm text-gray-500">
              {field.placeholder || 'Check this option'}
            </label>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            disabled
            className="w-full border border-[#d1d5db] rounded px-3 py-2 bg-gray-50 text-sm"
          />
        );

      case 'percentage':
        return (
          <div className="relative">
            <input
              type="number"
              placeholder={field.placeholder || 'Enter percentage'}
              disabled
              className="w-full border border-[#d1d5db] rounded px-3 py-2 bg-gray-50 pr-8 text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            disabled
            className="w-full border border-[#d1d5db] rounded px-3 py-2 bg-gray-50 text-sm"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7856ff]"></div>
        <span className="ml-3 text-gray-600">Loading fields...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading fields</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Business Log Fields</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review the current custom fields retrieved from the backend
          </p>
        </div>
      </div>

      {/* Existing Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Current Fields</CardTitle>
        </CardHeader>
         <CardContent className="space-y-4">
           {customFields.map((field) => (
            <div key={field.id} className="p-4 border border-[#e5e7eb] rounded-lg hover:border-[#d1d5db] transition-colors">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-medium text-[#2a2a2f]">
                      {field.label}
                    </h3>
                    {field.required && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {field.type}
                    </span>
                  </div>

                  {/* Field Preview */}
                  <div className="max-w-md">
                    {renderFieldPreview(field)}
                  </div>

                  {field.placeholder && (
                    <p className="text-xs text-gray-500 mt-1">
                      Placeholder: &quot;{field.placeholder}&quot;
                    </p>
                  )}
                </div>


              </div>


            </div>
          ))}

           {customFields.length === 0 && (
             <div className="text-center py-8 text-gray-500">
               <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="text-sm">No custom fields available</p>
               <p className="text-xs text-gray-400">Fields are retrieved from the backend.</p>
             </div>
           )}
        </CardContent>
      </Card>



      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">How to Use Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</div>
              <div>
                <p className="font-medium text-gray-900">Review Fields</p>
                <p>Use the provided GST number, discount amount, and issued date fields to capture the key billing details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</div>
              <div>
                <p className="font-medium text-gray-900">Field Types</p>
                <p>Each field is pre-mapped to the appropriate input (text, number, or date) so teams collect consistent information.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-medium text-gray-900">Use in Entries</p>
                <p>These fields automatically appear in the &quot;New Entry&quot; form so every log captures the same revenue details.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
