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
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
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
      <div className="space-y-4">
        {filteredData.map((entry) => (
          <Card key={entry.id} className="hover:border-gray-300 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {entry.customerName}
                  </h3>
                  <p className="text-sm text-gray-600">{entry.customerPhone}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-[#7856ff]">
                    ₹{entry.totalAmount.toFixed(2)}
                  </div>
                  <div>
                    {entry.isNewCustomer ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="hidden sm:inline">New Customer</span>
                        <span className="sm:hidden">New</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="hidden sm:inline">Existing Customer</span>
                        <span className="sm:hidden">Existing</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Products/Services:</h4>
                <div className="space-y-1">
                  {entry.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {product.name} × {product.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(product.quantity * product.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              {Object.keys(entry.customFields).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Details:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(entry.customFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <span className="font-medium">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      console.log('Edit entry:', entry.id);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center text-sm">
            <span className="text-gray-600 block">
              Showing {filteredData.length} of {data.length} entries
            </span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
              <span className="text-gray-600">
                Total Revenue: <span className="font-semibold text-[#7856ff]">₹{data.reduce((sum, entry) => sum + entry.totalAmount, 0).toFixed(2)}</span>
              </span>
              <span className="text-gray-600">
                New Customers: <span className="font-semibold text-green-600">{data.filter(entry => entry.isNewCustomer).length}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
