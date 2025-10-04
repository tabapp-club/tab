"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFieldManager } from "./DynamicFieldManager";
import { CustomerValidation } from "./CustomerValidation";
import { ProductServiceInput } from "./ProductServiceInput";
import { useBusinessLogData, type BusinessLogEntry } from "@/hooks/useBusinessLogData";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { config } from "@/lib/config";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'percentage';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  originalLabel?: string; // For API compatibility
  field_type?: string; // Original API field type
}

interface FormData {
  customerPhone: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    discount: number;
    customFields: Record<string, any>;
  }>;
}

export function BusinessLogForm() {
  // CACHE BUST: Fixed cgst error - v2.0
  const { addEntry } = useBusinessLogData();
  const { user } = useAuth();
  const { toasts, success, error, removeToast } = useToast();
  const token = user?.accessToken;
  const businessId = user?.business_id;

  const [formData, setFormData] = useState<FormData>({
    customerPhone: '',
    customerName: '',
    products: [{ name: '', quantity: 1, price: 0, discount: 0, customFields: {} }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFields, setCustomFields] = useState<DynamicField[]>([]);

  // Load custom fields from API
  const { data: apiFields, isLoading: fieldsLoading, error: fieldsError } = useQuery({
    queryKey: ['customFields', businessId],
    queryFn: async () => {
      if (!token || !businessId) throw new Error('Not authenticated');
      const response = await api.business.getCustomFields(token, businessId);
      return response.data;
    },
    enabled: !!token && !!businessId,
  });

  // Map API fields to DynamicField format
  useEffect(() => {
    if (apiFields) {
      const mappedFields: DynamicField[] = apiFields.map((field, index) => ({
        id: `api-${index}`,
        type: field.field_type.toLowerCase() as DynamicField['type'],
        label: field.label,
        required: field.required,
        placeholder: field.placeholder,
        originalLabel: field.label,
        field_type: field.field_type,
      }));
      setCustomFields(mappedFields);
    }
  }, [apiFields]);

  const [customerValidation, setCustomerValidation] = useState<{
    isValidating: boolean;
    customerFound: boolean;
    customerData: any;
  }>({
    isValidating: false,
    customerFound: false,
    customerData: null
  });

  const validateCustomer = useCallback(async (phone: string) => {
    console.log('🔍 validateCustomer called with:', { phone, token: !!token, businessId });
    setCustomerValidation(prev => ({ ...prev, isValidating: true }));

    try {
      // Call the customer exists API
      if (token && businessId) {
        console.log('📞 Making API call to checkCustomerExists...');
        const response = await api.business.checkCustomerExists(token, businessId, phone);
        console.log('📥 API response:', response);

        if (response.data && response.data.name) {
          // Customer found - fill the name
          setCustomerValidation({
            isValidating: false,
            customerFound: true,
            customerData: {
              phone: phone,
              name: response.data.name
            }
          });
          setFormData(prev => ({
            ...prev,
            customerName: response.data?.name || ''
          }));
        } else {
          // Customer not found - clear name
          setCustomerValidation({
            isValidating: false,
            customerFound: false,
            customerData: null
          });
          setFormData(prev => ({
            ...prev,
            customerName: ''
          }));
        }
      } else {
        // Fallback to local storage check if no token/businessId
        console.log('⚠️ No token or businessId, falling back to local storage check');
        const existingEntries = localStorage.getItem('businessLogEntries');
        let foundCustomer = null;

        if (existingEntries) {
          const entries = JSON.parse(existingEntries);
          const existingEntry = entries.find((entry: any) =>
            entry.customerPhone.replace(/\D/g, '') === phone
          );

          if (existingEntry) {
            foundCustomer = {
              phone: existingEntry.customerPhone,
              name: existingEntry.customerName
            };
          }
        }

        if (foundCustomer) {
          setCustomerValidation({
            isValidating: false,
            customerFound: true,
            customerData: foundCustomer
          });
          setFormData(prev => ({
            ...prev,
            customerName: foundCustomer.name
          }));
        } else {
          setCustomerValidation({
            isValidating: false,
            customerFound: false,
            customerData: null
          });
          setFormData(prev => ({
            ...prev,
            customerName: ''
          }));
        }
      }
    } catch (error) {
      console.error('Error validating customer:', error);
      setCustomerValidation({
        isValidating: false,
        customerFound: false,
        customerData: null
      });
      setFormData(prev => ({
        ...prev,
        customerName: ''
      }));
    }
  }, [token, businessId]);

  // Validate customer when phone number changes
  useEffect(() => {
    const cleanPhone = formData.customerPhone.replace(/\D/g, '');
    if (cleanPhone && cleanPhone.length === 10) {
      console.log('📱 Phone number validation triggered:', { cleanPhone, token: !!token, businessId });
      validateCustomer(cleanPhone);
    } else if (cleanPhone.length === 0) {
      // Reset validation when phone is cleared
      setCustomerValidation({
        isValidating: false,
        customerFound: false,
        customerData: null
      });
      setFormData(prev => ({
        ...prev,
        customerName: ''
      }));
    }
  }, [formData.customerPhone, validateCustomer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const handleProductCustomFieldChange = (productIndex: number, fieldId: string, value: any) => {
    const updatedProducts = [...formData.products];
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      customFields: {
        ...updatedProducts[productIndex].customFields,
        [fieldId]: value
      }
    };
    setFormData(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 1, price: 0, discount: 0, customFields: {} }]
    }));
  };

  const removeProduct = (index: number) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        products: updatedProducts
      }));
    }
  };

  const calculateTotal = () => {
    try {
      let subtotal = 0;
      let totalDiscount = 0;

      formData.products.forEach(product => {
        const productSubtotal = product.quantity * product.price;
        const productDiscount = (productSubtotal * product.discount) / 100;
        const productTotal = productSubtotal - productDiscount;

        subtotal += productSubtotal;
        totalDiscount += productDiscount;
      });

      const total = subtotal - totalDiscount;

      return {
        subtotal,
        discount: totalDiscount,
        total: Math.max(0, total) // Ensure total is not negative
      };
    } catch (error) {
      console.error('Error in calculateTotal:', error);
      return { subtotal: 0, discount: 0, total: 0 };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.customerPhone || !formData.customerName) {
      alert('Please fill in all required fields (Phone and Name)');
      return;
    }

    if (formData.products.some(p => !p.name || p.quantity <= 0 || p.price <= 0)) {
      alert('Please fill in all product details (Name, Quantity > 0, Price > 0)');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const totals = calculateTotal();

      // Map form data to new API schema
      // This creates a structured payload that matches the business entries API specification
      // Using null instead of empty strings for better API compatibility
      const apiPayload = {
        entry: {
          number: `ENT-${Date.now()}`,
          status: "DRFT",
          type: "SALE",
          issued_at: new Date().toISOString(),
          currency: "INR"
        },
        buyer: {
          name: formData.customerName,
          legal_name: formData.customerName,
          gstin: null,
          tax_id: null,
          address: {
            line1: null,
            line2: null,
            city: null,
            state: null,
            pincode: null,
            country: "India"
          },
          contact: {
            phone: formData.customerPhone,
            email: null
          },
          fssai: null,
          store_id: null
        },
        totals: {
          items_subtotal: totals.subtotal,
          discounts_total: totals.discount,
          tax_total: 0,
          rounding: 0,
          grand_total: totals.total,
          paid_total: 0,
          balance_due: totals.total
        },
        items: formData.products.map((product, index) => ({
          line_id: `ITEM-${index + 1}`,
          name: product.name,
          sku: `SKU-${Date.now()}-${index + 1}`,
          category: "General",
          quantity: product.quantity,
          unit_of_measure: "pcs",
          unit_price: product.price,
          discount: product.discount,
          tax_rate: 0,
          metadata: {
            ...(Object.keys(product.customFields || {}).length > 0 ? product.customFields : {}),
            product_id: `PROD-${Date.now()}-${index + 1}`,
            created_at: new Date().toISOString()
          }
        })),
        payments: [],
        source: "business-log",
        ingestion_id: `ING-${Date.now()}`,
        metadata: {
          isNewCustomer: !customerValidation.customerFound,
          form_version: "1.0",
          submitted_at: new Date().toISOString(),
          total_products: formData.products.length,
          custom_fields_count: formData.products.reduce((count, product) =>
            count + Object.keys(product.customFields || {}).length, 0
          ),
          additional_notes: null,
          tags: null
        }
      };

      // Validate required data before API call
      if (!token) {
        throw new Error('No authentication token available');
      }
      if (!businessId) {
        throw new Error('No business ID available');
      }
      if (!apiPayload.entry.number) {
        throw new Error('Entry number is missing');
      }
      if (!apiPayload.buyer.name) {
        throw new Error('Buyer name is missing');
      }

      // Call the new API endpoint


      const apiResponse = await api.business.createBusinessEntry(token!, businessId!, apiPayload);
      console.log('API Response:', apiResponse);

      // Check if response is successful (201 Created)
      if (apiResponse && apiResponse.data && apiResponse.data.id) {
        // Show success toast
        console.log('Showing success toast...');
        success("Entry created successfully!", 4000);

        // Reset form data
        setFormData({
          customerPhone: '',
          customerName: '',
          products: [{ name: '', quantity: 1, price: 0, discount: 0, customFields: {} }]
        });

        // Reset customer validation
        setCustomerValidation({
          isValidating: false,
          customerFound: false,
          customerData: null
        });

        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('businessLogUpdated'));
      } else {
        // Show error toast for unexpected response
        error("Entry created but with unexpected response format", 4000);
      }
    } catch (err) {
      console.error('Error submitting entry:', err);
      console.error('Error type:', typeof err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'No message',
        status: (err as any)?.status,
        statusText: (err as any)?.statusText,
        response: (err as any)?.response,
        data: (err as any)?.data,
        fullError: err
      });

      let errorMessage = 'Unknown error';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as any;
        if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.statusText) {
          errorMessage = errorObj.statusText;
        } else if (errorObj.status) {
          errorMessage = `HTTP ${errorObj.status}`;
        } else if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else {
          errorMessage = JSON.stringify(err);
        }
      }

      // Show error toast
      error(`Error submitting entry: ${errorMessage}. Please try again.`, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotal();

  return (
    <div className="space-y-6" data-version="2.0-fixed-cgst">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="p-1">
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      if (value.length <= 10) {
                        handleInputChange('customerPhone', value);
                      }
                    }}
                    placeholder="Enter 10-digit phone number"
                    required
                    className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                    maxLength={10}
                  />
                </div>
                <CustomerValidation validation={customerValidation} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="p-1">
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    required
                    className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products/Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Products/Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.products.map((product, index) => (
              <div key={index} className="p-4 border border-[#e5e7eb] rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="md:col-span-2 xl:col-span-1">
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                      Product/Service Name <span className="text-red-500">*</span>
                    </label>
                    <ProductServiceInput
                      value={product.name}
                      onChange={(value) => handleProductChange(index, 'name', value)}
                      placeholder="Enter product/service name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="p-1">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                        className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="p-1">
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                        className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2f] mb-1">
                      Discount (%)
                    </label>
                    <div className="p-1">
                      <div className="relative">
                        <input
                          type="number"
                          value={product.discount}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                            handleProductChange(index, 'discount', value);
                          }}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full border border-[#d1d5db] rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#6E4EFF] focus:border-transparent text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Total Display */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Product Total:</span>
                    <div className="text-right">
                      <div className="text-gray-900 font-medium">
                        ₹{((product.quantity * product.price) - ((product.quantity * product.price) * product.discount / 100)).toFixed(2)}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-red-600 text-xs">
                          (Discount: ₹{((product.quantity * product.price) * product.discount / 100).toFixed(2)})
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Fields for this Product */}
                {fieldsLoading ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6E4EFF]"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading additional fields...</span>
                    </div>
                  </div>
                ) : customFields.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Fields</h4>
                    <DynamicFieldManager
                      customFields={customFields}
                      formData={{ customFields: product.customFields }}
                      onCustomFieldChange={(fieldId, value) => handleProductCustomFieldChange(index, fieldId, value)}
                    />
                  </div>
                ) : null}

                {formData.products.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeProduct(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addProduct}
              className="w-full border-dashed border border-gray-300 hover:border-gray-400"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Product/Service
            </Button>
          </CardContent>
        </Card>


        {/* Bill Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Total Discount:</span>
                  <span className="font-medium">-₹{totals.discount.toFixed(2)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                customerPhone: '',
                customerName: '',
                products: [{ name: '', quantity: 1, price: 0, discount: 0, customFields: {} }]
              });
            }}
            className="w-full sm:w-auto border-[#d1d5db] text-[#2a2a2f] hover:bg-gray-50"
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#6E4EFF] hover:bg-[#5a3fd9] w-full sm:w-auto text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Entry'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
