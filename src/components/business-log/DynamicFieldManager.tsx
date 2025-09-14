"use client";

import { useState } from "react";
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

interface DynamicFieldManagerProps {
  customFields: DynamicField[];
  formData: any;
  onCustomFieldChange: (fieldId: string, value: any) => void;
}

export function DynamicFieldManager({
  customFields,
  formData,
  onCustomFieldChange
}: DynamicFieldManagerProps) {

  const renderFieldInput = (field: DynamicField) => {
    const value = formData.customFields[field.id] || '';

    switch (field.type) {
      case 'select':
        return (
          <CustomDropdown
            options={field.options?.map(option => ({ value: option, label: option })) || []}
            value={value}
            onChange={(value) => onCustomFieldChange(field.id, value)}
            placeholder="Select an option"
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onCustomFieldChange(field.id, e.target.value)}
            className="w-full"
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => onCustomFieldChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.placeholder || 'Check this option'}
            </label>
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onCustomFieldChange(field.id, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            step="0.01"
            className="w-full"
          />
        );
      
      case 'percentage':
        return (
          <div className="relative">
            <Input
              type="number"
              value={value}
              onChange={(e) => onCustomFieldChange(field.id, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder || 'Enter percentage'}
              min="0"
              max="100"
              step="0.01"
              className="w-full pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => onCustomFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full"
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Additional Fields</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Manage custom fields in the "Manage Fields" tab
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Custom Fields */}
        {customFields.map((field) => (
          <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderFieldInput(field)}
          </div>
        ))}
        
      </CardContent>
    </Card>
  );
}
