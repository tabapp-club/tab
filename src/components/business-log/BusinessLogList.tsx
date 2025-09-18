"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface BusinessLogEntry {
  id: string;
  customerPhone: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  customFields: Record<string, any>;
  timestamp: Date;
  isNewCustomer: boolean;
}

interface BusinessLogListProps {
  data: BusinessLogEntry[] | undefined;
  loading: boolean;
  error: any;
}

export function BusinessLogList({ data, loading, error }: BusinessLogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNewCustomers, setFilterNewCustomers] = useState<boolean | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredData = data?.filter(entry => {
    const matchesSearch = 
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customerPhone.includes(searchTerm) ||
      entry.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterNewCustomers === null || entry.isNewCustomer === filterNewCustomers;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        const existing = localStorage.getItem('businessLogEntries');
        if (existing) {
          const entries = JSON.parse(existing);
          const filtered = entries.filter((entry: BusinessLogEntry) => entry.id !== id);
          localStorage.setItem('businessLogEntries', JSON.stringify(filtered));
          
          // Trigger a custom event to notify other components
          window.dispatchEvent(new CustomEvent('businessLogUpdated'));
          
          // Show success message
          alert('Entry deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Error deleting entry. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7856ff]"></div>
        <span className="ml-3 text-gray-600">Loading entries...</span>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading entries</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
        <p className="text-gray-500 mb-6">Start by creating your first business log entry.</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#7856ff] hover:bg-[#6d46e5]"
        >
          Create First Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-2">
          <div className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Search by customer name, phone, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterNewCustomers === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterNewCustomers(null)}
                className={`${filterNewCustomers === null ? "bg-[#7856ff] text-white" : ""} flex-1 sm:flex-none`}
              >
                All
              </Button>
              <Button
                variant={filterNewCustomers === true ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterNewCustomers(true)}
                className={`${filterNewCustomers === true ? "bg-[#7856ff] text-white" : ""} flex-1 sm:flex-none`}
              >
                <span className="hidden sm:inline">New Customers</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button
                variant={filterNewCustomers === false ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterNewCustomers(false)}
                className={`${filterNewCustomers === false ? "bg-[#7856ff] text-white" : ""} flex-1 sm:flex-none`}
              >
                <span className="hidden sm:inline">Existing</span>
                <span className="sm:hidden">Existing</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredData.map((entry) => (
          <Card key={entry.id} className="hover:border-[#7856ff]/30 transition-all duration-200 group overflow-hidden">
            <CardContent className="p-0">
              {/* Header Section - Customer Info & Amount */}
              <div className="p-2 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  {/* Customer Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-gradient-to-br from-[#7856ff] to-[#6d46e5] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {entry.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {entry.customerName}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-xs text-gray-600 font-medium">{entry.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  {/* Amount Display */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#7856ff]">
                      ₹{entry.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.products.length} item{entry.products.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-2">
                {/* Products/Services Section */}
                <div className="mb-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg className="w-3 h-3 text-[#7856ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h4 className="text-xs font-semibold text-gray-800">Items</h4>
                  </div>
                  <div className="space-y-1">
                    {entry.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-gray-900 truncate">
                              {product.name}: {product.quantity}×₹{product.price.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 ml-2">
                            ₹{(product.quantity * product.price).toFixed(2)}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details Section - Enhanced */}
                {Object.keys(entry.customFields).length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <svg className="w-3 h-3 text-[#7856ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="text-xs font-semibold text-gray-800">Details</h4>
                    </div>
                    <div className="space-y-1">
                      {(() => {
                        const fields = Object.entries(entry.customFields);
                        const discountField = fields.find(([key]) => key.toLowerCase().includes('discount'));
                        const couponField = fields.find(([key]) => key.toLowerCase().includes('coupon'));
                        const otherFields = fields.filter(([key]) => 
                          !key.toLowerCase().includes('discount') && !key.toLowerCase().includes('coupon')
                        );

                        return (
                          <>
                            {/* Discount and Coupon side by side */}
                            {(discountField || couponField) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {discountField && (
                                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-medium text-gray-900 truncate">
                                        {discountField[0].replace(/([A-Z])/g, ' $1').toLowerCase().trim()}: {
                                          typeof discountField[1] === 'boolean' ? (
                                            <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ml-1 ${
                                              discountField[1] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {discountField[1] ? 'Yes' : 'No'}
                                            </span>
                                          ) : (
                                            <span className="text-gray-600 ml-1">{String(discountField[1])}</span>
                                          )
                                        }
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {couponField && (
                                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-medium text-gray-900 truncate">
                                        {couponField[0].replace(/([A-Z])/g, ' $1').toLowerCase().trim()}: {
                                          typeof couponField[1] === 'boolean' ? (
                                            <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ml-1 ${
                                              couponField[1] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {couponField[1] ? 'Yes' : 'No'}
                                            </span>
                                          ) : (
                                            <span className="text-gray-600 ml-1">{String(couponField[1])}</span>
                                          )
                                        }
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Other fields in single column */}
                            {otherFields.map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs font-medium text-gray-900 truncate">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}: {
                                      typeof value === 'boolean' ? (
                                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ml-1 ${
                                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {value ? 'Yes' : 'No'}
                                        </span>
                                      ) : (
                                        <span className="text-gray-600 ml-1">{String(value)}</span>
                                      )
                                    }
                                  </span>
                                </div>
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Section - Actions */}
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {format(new Date(entry.timestamp), 'h:mm a • MMM d, yyyy')}
                    {entry.isNewCustomer ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                        <span className="hidden sm:inline">New</span>
                        <span className="sm:hidden">N</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                        <span className="hidden sm:inline">Returning</span>
                        <span className="sm:hidden">R</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log('Edit entry:', entry.id);
                      }}
                      className="h-6 px-2 text-xs hover:bg-[#7856ff]/5 hover:border-[#7856ff]/30 hover:text-[#7856ff] transition-colors group/edit"
                    >
                      <svg className="w-2.5 h-2.5 mr-0.5 group-hover/edit:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors group/delete"
                    >
                      <svg className="w-2.5 h-2.5 mr-0.5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-2">
          <div className="text-center text-sm">
            <span className="text-gray-600">
              Showing {filteredData.length} of {data.length} entries
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
