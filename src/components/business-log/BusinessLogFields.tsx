"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomDropdown from "@/components/ui/CustomDropdown";

interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'percentage';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export function BusinessLogFields() {
  const [customFields, setCustomFields] = useState<DynamicField[]>([]);

  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<DynamicField>>({
    type: 'text',
    label: '',
    required: false,
    placeholder: ''
  });

  // Load fields from localStorage on component mount
  useEffect(() => {
    const savedFields = localStorage.getItem('businessLogCustomFields');
    if (savedFields) {
      try {
        const parsed = JSON.parse(savedFields);
        setCustomFields(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing custom fields:', error);
        setCustomFields([]);
      }
    } else {
      // Initialize with default fields only when user first visits this tab
      const defaultFields: DynamicField[] = [
        { id: 'gst', type: 'text' as const, label: 'GST Number', required: false, placeholder: 'Enter GST number' },
        { id: 'cgst', type: 'number' as const, label: 'CGST (%)', required: false, placeholder: 'Enter CGST percentage' },
        { id: 'discount', type: 'number' as const, label: 'Discount Amount', required: false, placeholder: 'Enter discount amount' },
        { id: 'coupon', type: 'text' as const, label: 'Coupon Code', required: false, placeholder: 'Enter coupon code' }
      ];
      setCustomFields(defaultFields);
      localStorage.setItem('businessLogCustomFields', JSON.stringify(defaultFields));
    }
  }, []);

  // Save fields to localStorage whenever customFields changes
  useEffect(() => {
    localStorage.setItem('businessLogCustomFields', JSON.stringify(customFields));
  }, [customFields]);

  // Initialize options when field type changes to select
  useEffect(() => {
    if (newField.type === 'select' && (!newField.options || newField.options.length === 0)) {
      setNewField(prev => ({ ...prev, options: ['Option 1', 'Option 2'] }));
    }
  }, [newField.type]);

  const addCustomField = () => {
    if (newField.label) {
      const field: DynamicField = {
        id: Date.now().toString(),
        type: newField.type || 'text',
        label: newField.label,
        required: newField.required || false,
        options: newField.type === 'select' ? (newField.options && newField.options.length > 0 ? newField.options : ['Option 1', 'Option 2']) : undefined,
        placeholder: newField.placeholder || ''
      };

      setCustomFields([...customFields, field]);
      setNewField({ type: 'text', label: '', required: false, placeholder: '' });
      setShowAddField(false);
    }
  };

  const updateCustomField = (fieldId: string, updates: Partial<DynamicField>) => {
    setCustomFields(customFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    setEditingField(null);
  };

  const removeCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter(field => field.id !== fieldId));
  };

  const duplicateField = (field: DynamicField) => {
    const newField: DynamicField = {
      ...field,
      id: Date.now().toString(),
      label: `${field.label} (Copy)`
    };
    setCustomFields([...customFields, newField]);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Manage Custom Fields</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage custom fields for your business log entries
          </p>
        </div>
        <Button
          onClick={() => setShowAddField(true)}
          className="bg-[#6E4EFF] hover:bg-[#5a3fd9] self-start lg:self-auto text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Field
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

                <div className="flex flex-wrap gap-2 lg:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingField(field.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1 sm:flex-none border-[#d1d5db]"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateField(field)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1 sm:flex-none border-[#d1d5db]"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomField(field.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none border-[#d1d5db]"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>

              {/* Edit Field Form */}
              {editingField === field.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-[#e5e7eb]">
                  <h4 className="text-sm font-medium text-[#2a2a2f] mb-3">Edit Field</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                        Field Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                        placeholder="Enter field label"
                        className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                        Field Type
                      </label>
                      <CustomDropdown
                        options={[
                          { value: "text", label: "Text" },
                          { value: "number", label: "Number" },
                          { value: "percentage", label: "Percentage" },
                          { value: "select", label: "Dropdown" },
                          { value: "date", label: "Date" },
                          { value: "checkbox", label: "Checkbox" }
                        ]}
                        value={field.type}
                        onChange={(value) => updateCustomField(field.id, { type: value as any })}
                        placeholder="Select field type"
                      />
                    </div>

                    {/* Options for dropdown fields */}
                    {field.type === 'select' && (
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                          Dropdown Options
                        </label>
                        <div className="space-y-2">
                          {(field.options || []).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(field.options || [])];
                                  newOptions[index] = e.target.value;
                                  updateCustomField(field.id, { options: newOptions });
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = (field.options || []).filter((_, i) => i !== index);
                                  updateCustomField(field.id, { options: newOptions });
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-[#d1d5db]"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...(field.options || []), ''];
                              updateCustomField(field.id, { options: newOptions });
                            }}
                            className="border-[#d1d5db]"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Option
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Add options that will appear in the dropdown</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateCustomField(field.id, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text"
                        className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                        className="h-4 w-4 text-[#6E4EFF] focus:ring-[#6E4EFF] border-[#d1d5db] rounded"
                      />
                      <label className="ml-2 text-sm text-[#2a2a2f]">
                        Required field
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditingField(null)}
                      className="w-full sm:w-auto border-[#d1d5db] text-[#2a2a2f] hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setEditingField(null)}
                      className="bg-[#6E4EFF] hover:bg-[#5a3fd9] w-full sm:w-auto text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {customFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No custom fields created yet</p>
              <p className="text-xs text-gray-400">Add fields like GST, discounts, coupons, etc.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Field Form */}
      {showAddField && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2a2a2f]">Add New Field</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={newField.label || ''}
                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Enter field label"
                    className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                    Field Type
                  </label>
                  <CustomDropdown
                    options={[
                      { value: "text", label: "Text" },
                      { value: "number", label: "Number" },
                      { value: "percentage", label: "Percentage" },
                      { value: "select", label: "Dropdown" },
                      { value: "date", label: "Date" },
                      { value: "checkbox", label: "Checkbox" }
                    ]}
                    value={newField.type || 'text'}
                    onChange={(value) => setNewField(prev => ({ ...prev, type: value as any }))}
                    placeholder="Select field type"
                  />
                </div>
              </div>

              {/* Options for dropdown fields */}
              {newField.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                    Dropdown Options
                  </label>
                  <div className="space-y-2">
                    {(newField.options || []).map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(newField.options || [])];
                            newOptions[index] = e.target.value;
                            setNewField(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = (newField.options || []).filter((_, i) => i !== index);
                            setNewField(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-[#d1d5db]"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(newField.options || []), ''];
                        setNewField(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="border-[#d1d5db]"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Add options that will appear in the dropdown</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="Enter placeholder text"
                  className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required || false}
                  onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                  className="h-4 w-4 text-[#6E4EFF] focus:ring-[#6E4EFF] border-[#d1d5db] rounded"
                />
                <label className="ml-2 text-sm text-[#2a2a2f]">
                  Required field
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddField(false);
                    setNewField({ type: 'text', label: '', required: false, placeholder: '' });
                  }}
                  className="w-full sm:w-auto border-[#d1d5db] text-[#2a2a2f] hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addCustomField}
                  className="bg-[#6E4EFF] hover:bg-[#5a3fd9] w-full sm:w-auto text-white"
                >
                  Add Field
                </Button>
              </div>
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
                <p className="font-medium text-gray-900">Create Fields</p>
                <p>Add custom fields like GST number, discount amounts, coupon codes, or any other business-specific information.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</div>
              <div>
                <p className="font-medium text-gray-900">Field Types</p>
                <p>Choose from text, number, dropdown, date, or checkbox field types based on your needs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-medium text-gray-900">Use in Entries</p>
                <p>These fields will automatically appear in the &quot;New Entry&quot; form for easy data collection.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
