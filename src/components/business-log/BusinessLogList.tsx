"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import type { BusinessLogEntry } from '@/hooks/useBusinessLogData';

interface BusinessLogListProps {
  data: BusinessLogEntry[] | undefined;
  loading: boolean;
  error: any;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onUpdateEntry: ({ id, updates }: { id: string; updates: Partial<BusinessLogEntry> }) => Promise<unknown>;
  onDeleteEntry: (id: string) => Promise<unknown>;
}

export function BusinessLogList({
  data,
  loading,
  error,
  onNextPage,
  onPrevPage,
  hasNextPage,
  hasPrevPage,
  onUpdateEntry,
  onDeleteEntry,
}: BusinessLogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNewCustomers, setFilterNewCustomers] = useState<boolean | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BusinessLogEntry>>({});

  // Function to determine if user is new or returning based on frequency
  const getUserStatus = (phoneNumber: string, allEntries: BusinessLogEntry[]) => {
    const userEntries = allEntries.filter(entry => entry.customerPhone === phoneNumber);
    return userEntries.length === 1 ? 'New User' : 'Returning';
  };

  const filteredData = (Array.isArray(data) ? data : []).filter(entry => {
    const matchesSearch =
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customerPhone.includes(searchTerm) ||
      (entry.products && entry.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())));

    // Use the new user status logic for filtering
    let matchesFilter = true;
    if (filterNewCustomers !== null) {
      const userStatus = getUserStatus(entry.customerPhone, data || []);
      if (filterNewCustomers === true) {
        // Show only "New User" entries
        matchesFilter = userStatus === 'New User';
      } else {
        // Show only "Returning" entries
        matchesFilter = userStatus === 'Returning';
      }
    }

    return matchesSearch && matchesFilter;
  });

  console.log('filteredData length:', filteredData.length);

  const handleEditEntry = (entry: BusinessLogEntry) => {
    setEditingEntry(entry.id);
    setEditForm({
      customerName: entry.customerName,
      customerPhone: entry.customerPhone,
      products: entry.products,
      totalAmount: entry.totalAmount,
      isNewCustomer: entry.isNewCustomer
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await onUpdateEntry({ id, updates: editForm });

      // Reset edit state
      setEditingEntry(null);
      setEditForm({});

      // Show success message
      alert('Entry updated successfully!');
    } catch (error) {
      alert('Error updating entry. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditForm({});
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    if (!editForm.products) return;

    const updatedProducts = [...editForm.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };

    // Recalculate total amount
    const totalAmount = updatedProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);

    setEditForm({
      ...editForm,
      products: updatedProducts,
      totalAmount
    });
  };

  const addProduct = () => {
    if (!editForm.products) return;

    const newProduct = { name: '', quantity: 1, price: 0, customFields: {} };
    const updatedProducts = [...editForm.products, newProduct];
    const totalAmount = updatedProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);

    setEditForm({
      ...editForm,
      products: updatedProducts,
      totalAmount
    });
  };

  const removeProduct = (index: number) => {
    if (!editForm.products || editForm.products.length <= 1) return;

    const updatedProducts = editForm.products.filter((_, i) => i !== index);
    const totalAmount = updatedProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);

    setEditForm({
      ...editForm,
      products: updatedProducts,
      totalAmount
    });
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
      <div className="space-y-3">
        <div>
          <div className="group bg-[#f6f6f6] border border-[#e9e9e9] hover:border-[#d1d5db] focus-within:border-[#6E4EFF] focus-within:ring-2 focus-within:ring-[#6E4EFF]/20 flex flex-row h-10 items-center justify-start p-px relative rounded shrink-0 w-full transition-all duration-200">
            <div className="flex items-center justify-center h-full w-7 shrink-0 mt-1 ml-1 text-[#757575] group-focus-within:text-[#6E4EFF] transition-colors duration-200">
              <SearchIcon />
            </div>
            <div className="flex-1 flex items-center h-full min-w-0">
              <div className="flex-1 flex items-center h-full px-1 py-0">
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-[#2a2a2f] text-[13.344px] placeholder:text-[#757575] font-normal placeholder:text-[12px] sm:placeholder:text-[13.344px] focus:text-[#2a2a2f] transition-colors duration-200"
                />
              </div>
            </div>
          </div>
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
            <span className="hidden sm:inline">New Users</span>
            <span className="sm:hidden">New</span>
          </Button>
          <Button
            variant={filterNewCustomers === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterNewCustomers(false)}
            className={`${filterNewCustomers === false ? "bg-[#7856ff] text-white" : ""} flex-1 sm:flex-none`}
          >
            <span className="hidden sm:inline">Returning</span>
            <span className="sm:hidden">Returning</span>
          </Button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredData.map((entry) => (
          <Card key={entry.id} className="hover:border-[#7856ff]/30 transition-all duration-200 group overflow-hidden">
            <CardContent className="p-0 px-2">
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

              {/* Edit Form */}
              {editingEntry === entry.id && (
                <div className="p-3 bg-blue-50 border-b border-blue-100">
                  <div className="space-y-4">
                    {/* Customer Info Edit */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={editForm.customerName || ''}
                          onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-[#7856ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={editForm.customerPhone || ''}
                          onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-[#7856ff]"
                        />
                      </div>
                    </div>

                    {/* Products Edit */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700">Products/Services</label>
                        <button
                          onClick={addProduct}
                          className="text-xs text-[#7856ff] hover:text-[#6d46e5] font-medium"
                        >
                          + Add Product
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editForm.products?.map((product, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Product name"
                              value={product.name}
                              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-[#7856ff]"
                            />
                            <input
                              type="number"
                              placeholder="Qty"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-[#7856ff]"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={product.price}
                              onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-[#7856ff]"
                            />
                            {editForm.products && editForm.products.length > 1 && (
                              <button
                                onClick={() => removeProduct(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Customer Type</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditForm({...editForm, isNewCustomer: true})}
                          className={`px-3 py-1 text-xs rounded ${
                            editForm.isNewCustomer
                              ? 'bg-[#7856ff] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          New User
                        </button>
                        <button
                          onClick={() => setEditForm({...editForm, isNewCustomer: false})}
                          className={`px-3 py-1 text-xs rounded ${
                            !editForm.isNewCustomer
                              ? 'bg-[#7856ff] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Returning
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSaveEdit(entry.id)}
                        className="bg-[#7856ff] hover:bg-[#6d46e5] text-white text-xs px-3 py-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="text-xs px-3 py-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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

              </div>

              {/* Footer Section - Actions */}
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                      onClick={() => handleEditEntry(entry)}
                      className="h-6 px-2 text-xs hover:bg-[#7856ff]/5 hover:border-[#7856ff]/30 hover:text-[#7856ff] transition-colors group/edit"
                    >
                      <svg className="w-2.5 h-2.5 mr-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                  </div>
                   <div className="flex gap-1">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleEditEntry(entry)}
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
                       onClick={() => {
                         if (confirm('Are you sure you want to delete this entry?')) {
                           onDeleteEntry(entry.id);
                         }
                       }}
                       className="h-6 px-2 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors group/delete"
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

      {/* Pagination */}
      <Card>
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={!hasPrevPage || loading}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">
                Showing {filteredData.length} entries
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={!hasNextPage || loading}
              className="flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11.5 11.5L14.5 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="7"
      r="5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
