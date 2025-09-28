"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFieldManager } from "./DynamicFieldManager";
import { CustomerValidation } from "./CustomerValidation";
import { ProductServiceInput } from "./ProductServiceInput";
import { useBusinessLogData, type BusinessLogEntry } from "@/hooks/useBusinessLogData";

interface FormData {
  customerPhone: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customFields: Record<string, any>;
}

export function BusinessLogForm() {
  const { addEntry } = useBusinessLogData();
  const [formData, setFormData] = useState<FormData>({
    customerPhone: '',
    customerName: '',
    products: [{ name: '', quantity: 1, price: 0 }],
    customFields: {}
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [customFields, setCustomFields] = useState<Array<{
    id: string;
    type: 'text' | 'number' | 'select' | 'date' | 'checkbox';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
  }>>([]);

  // Load custom fields from localStorage and sync with changes
  useEffect(() => {
    const loadFields = () => {
      const savedFields = localStorage.getItem('businessLogCustomFields');
      if (savedFields) {
        try {
          const parsed = JSON.parse(savedFields);
          setCustomFields(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          setCustomFields([]);
        }
      } else {
        // No default fields - user must create their own
        setCustomFields([]);
      }
    };

    loadFields();

    // Listen for changes to custom fields from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'businessLogCustomFields') {
        loadFields();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(loadFields, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [customerValidation, setCustomerValidation] = useState<{
    isValidating: boolean;
    customerFound: boolean;
    customerData: any;
  }>({
    isValidating: false,
    customerFound: false,
    customerData: null
  });

  // Validate customer when phone number changes
  useEffect(() => {
    const cleanPhone = formData.customerPhone.replace(/\D/g, '');
    if (cleanPhone && cleanPhone.length === 10) {
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
  }, [formData.customerPhone]);

  const validateCustomer = async (phone: string) => {
    setCustomerValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Check existing entries for this phone number
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
      
      // If not found in entries, check mock customers
      if (!foundCustomer) {
        const mockCustomers = [
          { phone: '9876543210', name: 'John Doe', email: 'john@example.com' },
          { phone: '9876543211', name: 'Jane Smith', email: 'jane@example.com' },
          { phone: '9876543212', name: 'Bob Johnson', email: 'bob@example.com' },
          { phone: '9876543213', name: 'Alice Brown', email: 'alice@example.com' },
          { phone: '9876543214', name: 'Charlie Wilson', email: 'charlie@example.com' }
        ];
        
        foundCustomer = mockCustomers.find(c => c.phone === phone);
      }
      
      setTimeout(() => {
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
      }, 800);
    } catch (error) {
      setCustomerValidation({
        isValidating: false,
        customerFound: false,
        customerData: null
      });
    }
  };

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

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 1, price: 0 }]
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
    const subtotal = formData.products.reduce((sum, product) => {
      return sum + (product.quantity * product.price);
    }, 0);

    const cgst = formData.customFields.cgst || 0;
    const discount = formData.customFields.discount || 0;
    
    const cgstAmount = (subtotal * cgst) / 100;
    const total = subtotal + cgstAmount - discount;
    
    return { subtotal, cgstAmount, discount, total };
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
      
        const entry: Omit<BusinessLogEntry, 'id' | 'timestamp'> = {
         customerPhone: formData.customerPhone,
         customerName: formData.customerName,
         products: formData.products,
         totalAmount: totals.total,
         customFields: formData.customFields,
         isNewCustomer: !customerValidation.customerFound
       };

      await addEntry(entry);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('businessLogUpdated'));
      
      setSubmitSuccess(true);
      setFormData({
        customerPhone: '',
        customerName: '',
        products: [{ name: '', quantity: 1, price: 0 }],
        customFields: {}
      });
      
      // Reset customer validation
      setCustomerValidation({
        isValidating: false,
        customerFound: false,
        customerData: null
      });
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      alert('Error submitting entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">Entry submitted successfully!</p>
          </div>
        </div>
      )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                </div>
                
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

        {/* Dynamic Fields - Only show if there are custom fields */}
        {customFields.length > 0 && (
          <DynamicFieldManager
            customFields={customFields}
            formData={formData}
            onCustomFieldChange={(fieldId, value) => {
              setFormData(prev => ({
                ...prev,
                customFields: {
                  ...prev.customFields,
                  [fieldId]: value
                }
              }));
            }}
          />
        )}

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
              {formData.customFields.cgst && (
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST ({formData.customFields.cgst}%):</span>
                  <span className="font-medium">₹{totals.cgstAmount.toFixed(2)}</span>
                </div>
              )}
              {formData.customFields.discount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-₹{totals.discount.toFixed(2)}</span>
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
                products: [{ name: '', quantity: 1, price: 0 }],
                customFields: {}
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
