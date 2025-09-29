"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { CreateCustomFieldRequest, FieldType } from "@/lib/api";
import { config } from "@/lib/config";

interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'percentage' | 'dropdown';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  originalLabel?: string; // For API calls
  field_type?: string; // Original API field type
}

export function BusinessLogFields() {
  const { user } = useAuth();
  const token = user?.accessToken;
  const businessId = user?.business_id;
  const queryClient = useQueryClient();

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
  const [editingField, setEditingField] = useState<{ originalLabel: string; label: string; placeholder: string; required: boolean; field_type: string } | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create field form state
  const [isCreatingFields, setIsCreatingFields] = useState(false);
  const [createFieldsData, setCreateFieldsData] = useState<CreateCustomFieldRequest[]>([
    {
      label: '',
      placeholder: '',
      required: false,
      field_type: 'Text'
    }
  ]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ originalLabel, updatedData }: { originalLabel: string; updatedData: { label: string; placeholder: string; required: boolean; field_type: string } }) =>
      api.business.updateCustomField(token!, businessId!, originalLabel, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields', businessId] });
      setEditingField(null);
      setMessage({ type: 'success', text: 'Custom field updated successfully' });
    },
    onError: (error) => {
      console.error('Update failed:', error);
      setMessage({ type: 'error', text: 'Failed to update custom field' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (label: string) => api.business.deleteCustomField(token!, businessId!, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields', businessId] });
      setIsDeleteConfirmOpen(false);
      setFieldToDelete(null);
      setMessage({ type: 'success', text: 'Custom field deleted successfully' });
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      setMessage({ type: 'error', text: 'Failed to delete custom field' });
    },
  });

  const createFieldsMutation = useMutation({
    mutationFn: async (fieldsData: CreateCustomFieldRequest[]) => {
      console.log('Sending fields data (array):', fieldsData);
      console.log('Token:', token);
      console.log('Business ID:', businessId);

      // Validate required data
      if (!token) {
        throw new Error('No authentication token available');
      }
      if (!businessId) {
        throw new Error('No business ID available');
      }
      if (!fieldsData || fieldsData.length === 0) {
        throw new Error('No fields to create');
      }

      // Validate each field
      for (const field of fieldsData) {
        if (!field.label || field.label.trim() === '') {
          throw new Error('Field label is required for all fields');
        }
        if (!field.field_type) {
          throw new Error('Field type is required for all fields');
        }
      }

      try {
        // Try the multiple fields endpoint first
        const result = await api.business.createCustomFields(token!, businessId!, fieldsData);
        console.log('API response:', result);
        return result;
      } catch (error) {
        console.error('Multiple fields API call failed:', error);

        // If multiple fields fails, try creating fields one by one
        console.log('Trying to create fields individually...');
        try {
          const results = [];
          for (const field of fieldsData) {
            console.log('Creating individual field:', field);
            const result = await api.business.createCustomField(token!, businessId!, field);
            results.push(result);
          }
          console.log('All individual fields created:', results);
          return { message: 'Fields created successfully', data: results.flatMap(r => r.data) };
        } catch (individualError) {
          console.error('Individual field creation also failed:', individualError);
          console.error('Error details:', {
            message: individualError instanceof Error ? individualError.message : 'Unknown error',
            stack: individualError instanceof Error ? individualError.stack : undefined,
            error: individualError
          });
          throw individualError;
        }
      }
    },
    onSuccess: (data) => {
      console.log('Success response:', data);
      queryClient.invalidateQueries({ queryKey: ['customFields', businessId] });
      setIsCreatingFields(false);
      setCreateFieldsData([{ label: '', placeholder: '', required: false, field_type: 'Text' }]);
      setMessage({ type: 'success', text: 'Custom fields created successfully' });
    },
    onError: (error) => {
      console.error('Create failed with error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Full error object:', JSON.stringify(error, null, 2));

      let errorMessage = 'Failed to create custom fields';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        // Handle ApiError from the API client
        const errorObj = error as any;
        if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.status) {
          errorMessage = `HTTP ${errorObj.status}: ${errorObj.statusText || 'Unknown error'}`;
        }
      }

      setMessage({ type: 'error', text: errorMessage });
    },
  });

  // Helper functions for managing fields
  const addNewField = () => {
    setCreateFieldsData([...createFieldsData, {
      label: '',
      placeholder: '',
      required: false,
      field_type: 'Text'
    }]);
  };

  const removeField = (index: number) => {
    if (createFieldsData.length > 1) {
      setCreateFieldsData(createFieldsData.filter((_, i) => i !== index));
    }
  };

  const updateField = (index: number, field: CreateCustomFieldRequest) => {
    const newFields = [...createFieldsData];
    newFields[index] = field;
    setCreateFieldsData(newFields);
  };

  const resetFields = () => {
    setCreateFieldsData([{ label: '', placeholder: '', required: false, field_type: 'Text' }]);
  };

  const startCreatingFields = () => {
    setIsCreatingFields(true);
    setCreateFieldsData([{ label: '', placeholder: '', required: false, field_type: 'Text' }]);
  };

  const cancelCreatingFields = () => {
    setIsCreatingFields(false);
    resetFields();
  };

  const duplicateField = (field: CreateCustomFieldRequest) => {
    setCreateFieldsData([...createFieldsData, { ...field, label: field.label + ' (Copy)' }]);
  };

  const editField = (field: CreateCustomFieldRequest, index: number) => {
    const newFields = [...createFieldsData];
    newFields[index] = field;
    setCreateFieldsData(newFields);
  };

  // Map API fields to DynamicField format
  useEffect(() => {
    if (apiFields) {
      const mappedFields: DynamicField[] = apiFields.map((field, index) => ({
        id: `api-${index}`,
        type: field.field_type.toLowerCase() as DynamicField['type'], // Assuming API uses "Percentage" -> "percentage"
        label: field.label,
        required: field.required,
        placeholder: field.placeholder,
        originalLabel: field.label, // Store original for API calls
        field_type: field.field_type, // Store original field_type
      }));
      setCustomFields(mappedFields);
    }
  }, [apiFields]);







  const renderFieldPreview = (field: DynamicField) => {
    switch (field.type) {
      case 'select':
      case 'dropdown':
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
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right ml-4">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Business Log Fields</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review the current custom fields retrieved from the backend
          </p>
        </div>
        <Button
          onClick={startCreatingFields}
          className="bg-[#6E4EFF] hover:bg-[#5a3fd9] text-white"
        >
          + Add Custom Fields
        </Button>
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

                 {/* Action Buttons */}
                 <div className="flex gap-2 mt-4">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setEditingField({
                       originalLabel: field.originalLabel!,
                       label: field.label,
                       placeholder: field.placeholder || '',
                       required: field.required,
                       field_type: field.field_type || 'Text'
                     })}
                     className="text-blue-600 border-blue-600 hover:bg-blue-50"
                   >
                     Edit
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                       setFieldToDelete(field.label);
                       setIsDeleteConfirmOpen(true);
                     }}
                     className="text-red-600 border-red-600 hover:bg-red-50"
                   >
                     Delete
                   </Button>
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

      {/* Edit Field BottomSheet */}
      <BottomSheet
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        title="Edit Custom Field"
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={editingField?.label || ''}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, label: e.target.value } : null)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={editingField?.placeholder || ''}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, placeholder: e.target.value } : null)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
            <select
              value={editingField?.field_type || 'Text'}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, field_type: e.target.value } : null)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Text">Text</option>
              <option value="Number">Number</option>
              <option value="Percentage">Percentage</option>
              <option value="Dropdown">Dropdown</option>
              <option value="Date">Date</option>
              <option value="Checkbox">Checkbox</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editingField?.required || false}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, required: e.target.checked } : null)}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-sm text-gray-700">Required</label>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (editingField) {
                  updateMutation.mutate({
                    originalLabel: editingField.originalLabel,
                    updatedData: {
                      label: editingField.label,
                      placeholder: editingField.placeholder,
                      required: editingField.required,
                      field_type: editingField.field_type
                    }
                  });
                }
              }}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setEditingField(null)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Custom Field</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the field &quot;{fieldToDelete}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (fieldToDelete) {
                    deleteMutation.mutate(fieldToDelete);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setFieldToDelete(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Fields Inline Form */}
      {isCreatingFields && (
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-[#6E4EFF]/5 to-[#7856ff]/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-[#2a2a2f]">Create Custom Fields</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Add new fields to your business records</p>
              </div>
              <button
                onClick={cancelCreatingFields}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {createFieldsData.map((field, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-[#2a2a2f]">Field {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => duplicateField(field)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Duplicate field"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {createFieldsData.length > 1 && (
                        <button
                          onClick={() => removeField(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove field"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#2a2a2f]">
                        Field Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                        placeholder="e.g., Customer Age, Product Category"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF] transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#2a2a2f]">
                        Field Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={field.field_type}
                        onChange={(e) => updateField(index, { ...field, field_type: e.target.value as FieldType })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF] transition-all duration-200 bg-white"
                      >
                        <option value="Text">📝 Text Input</option>
                        <option value="Number">🔢 Number Input</option>
                        <option value="Percentage">📊 Percentage</option>
                        <option value="Dropdown">📋 Dropdown</option>
                        <option value="Date">📅 Date Picker</option>
                        <option value="Checkbox">☑️ Checkbox</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-[#2a2a2f]">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => updateField(index, { ...field, placeholder: e.target.value })}
                        placeholder="e.g., Enter customer age, Select category"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF]/20 focus:border-[#6E4EFF] transition-all duration-200"
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl md:col-span-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required}
                        onChange={(e) => updateField(index, { ...field, required: e.target.checked })}
                        className="w-4 h-4 text-[#6E4EFF] border-2 border-gray-300 rounded focus:ring-[#6E4EFF] focus:ring-2"
                      />
                      <label htmlFor={`required-${index}`} className="text-sm font-medium text-[#2a2a2f] cursor-pointer">
                        This field is required
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Field Button */}
              <button
                onClick={addNewField}
                className="w-full border-2 border-dashed border-[#6E4EFF]/30 hover:border-[#6E4EFF]/50 rounded-xl p-4 text-[#6E4EFF] hover:bg-[#6E4EFF]/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Field
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={cancelCreatingFields}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-xl font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('=== DEBUG INFO ===');
                  console.log('Fields data:', createFieldsData);
                  console.log('Request payload (array):', createFieldsData);
                  console.log('Token exists:', !!token);
                  console.log('Business ID exists:', !!businessId);
                  console.log('API base URL:', config.api.baseURL);
                  console.log('==================');
                  createFieldsMutation.mutate(createFieldsData);
                }}
                disabled={createFieldsData.some(field => !field.label) || createFieldsMutation.isPending}
                className="px-6 py-2 bg-gradient-to-r from-[#6E4EFF] to-[#7856ff] hover:from-[#5a3fd9] hover:to-[#6b46c1] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl font-medium shadow-lg hover:shadow-xl"
              >
                {createFieldsMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating {createFieldsData.length} Field{createFieldsData.length > 1 ? 's' : ''}...
                  </div>
                ) : (
                  `Create ${createFieldsData.length} Field${createFieldsData.length > 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
