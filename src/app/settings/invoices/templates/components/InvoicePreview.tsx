"use client";

import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { formatINR, amountInWordsINR, computeGSTSplit, classNames } from '../utils';

interface BusinessDetails {
  businessName: string;
  logo: File | null;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  cin: string;
  placeOfSupply: string;
  signature: File | null;
  // Footer content fields
  termsConditions: string;
  declaration: string;
  // Footer visibility toggles
  showPhone: boolean;
  showEmail: boolean;
  showGSTIN: boolean;
  showPAN: boolean;
  showCIN: boolean;
  showSignature: boolean;
  showTermsConditions: boolean;
  showDeclaration: boolean;
}

interface InvoicePreviewProps {
  businessDetails: BusinessDetails;
  selectedTemplate: 'basic' | 'modern' | 'elegant';
  selectedFormat: 'regular' | 'mobile';
}

// Sample invoice data
const sampleInvoiceData = {
  invoiceNumber: 'INV-2025-00123',
  date: new Date().toLocaleDateString('en-IN'),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
  customer: {
    name: 'Rahul Verma',
    phone: '09876543210',
    address: '123 Main Street, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pin: '500001',
    gstin: '36ABCDE1234F1Z5'
  },
  items: [
    {
      description: 'Dental Consultation',
      hsn: '9993',
      quantity: 1,
      unit: 'Nos',
      rate: 500,
      discount: 0,
      taxableValue: 500
    },
    {
      description: 'X-Ray Examination',
      hsn: '9993',
      quantity: 2,
      unit: 'Nos',
      rate: 300,
      discount: 50,
      taxableValue: 550
    },
    {
      description: 'Teeth Cleaning',
      hsn: '9993',
      quantity: 1,
      unit: 'Nos',
      rate: 800,
      discount: 0,
      taxableValue: 800
    }
  ],
  gstRate: 18
};

export function InvoicePreview({ businessDetails, selectedTemplate, selectedFormat }: InvoicePreviewProps) {
  const { customer, items, gstRate } = sampleInvoiceData;
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
  const gstSplit = computeGSTSplit(
    businessDetails.state || 'Maharashtra',
    businessDetails.placeOfSupply || 'Maharashtra',
    subtotal,
    gstRate
  );
  const roundOff = Math.round(subtotal + gstSplit.totalTax) - (subtotal + gstSplit.totalTax);
  const grandTotal = subtotal + gstSplit.totalTax + roundOff;

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          container: 'bg-white border border-gray-200 rounded-lg shadow-sm',
          header: 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-4',
          businessName: 'text-lg font-bold text-gray-900',
          address: 'text-sm text-gray-600',
          invoiceHeader: 'bg-blue-100 rounded-lg p-3 mb-4',
          invoiceTitle: 'text-lg font-bold text-blue-900',
          invoiceMeta: 'text-sm text-blue-700',
          customerSection: 'bg-gray-50 rounded-lg p-3 mb-4',
          customerTitle: 'font-semibold text-gray-900 mb-2',
          customerInfo: 'text-sm text-gray-700',
          tableHeader: 'bg-gray-100 rounded-t-lg',
          tableRow: 'border-b border-gray-200 hover:bg-gray-50',
          totalSection: 'bg-green-50 rounded-lg p-3 mt-4',
          totalText: 'font-bold text-green-900',
          footer: 'bg-gray-50 rounded-b-lg p-3 text-xs text-gray-600'
        };
      case 'elegant':
        return {
          container: 'bg-white border border-gray-300 rounded-lg shadow-sm',
          header: 'text-center p-4 border-b border-gray-300',
          businessName: 'text-lg font-serif font-semibold text-gray-900',
          address: 'text-sm text-gray-600 font-serif',
          invoiceHeader: 'border-b border-gray-300 pb-3 mb-4',
          invoiceTitle: 'text-lg font-serif font-medium text-gray-900',
          invoiceMeta: 'text-sm text-gray-600 font-serif',
          customerSection: 'border-l-2 border-gray-300 pl-4 mb-4',
          customerTitle: 'font-serif font-medium text-gray-900 mb-2',
          customerInfo: 'text-sm text-gray-700 font-serif',
          tableHeader: 'border-b border-gray-300',
          tableRow: 'border-b border-gray-200',
          totalSection: 'border-t border-gray-300 pt-3 mt-4',
          totalText: 'font-serif font-semibold text-gray-900',
          footer: 'border-t border-gray-300 pt-3 text-xs text-gray-500 text-center'
        };
      default: // basic
        return {
          container: 'bg-white border border-gray-200 rounded',
          header: 'text-center p-4 border-b border-gray-200',
          businessName: 'text-lg font-semibold text-gray-900',
          address: 'text-sm text-gray-600',
          invoiceHeader: 'border-b border-gray-200 pb-3 mb-4',
          invoiceTitle: 'text-lg font-medium text-gray-900',
          invoiceMeta: 'text-sm text-gray-600',
          customerSection: 'border-b border-gray-200 pb-3 mb-4',
          customerTitle: 'font-medium text-gray-900 mb-2',
          customerInfo: 'text-sm text-gray-700',
          tableHeader: 'border-b border-gray-200',
          tableRow: 'border-b border-gray-200',
          totalSection: 'border-t border-gray-200 pt-3 mt-4',
          totalText: 'font-semibold text-gray-900',
          footer: 'border-t border-gray-200 pt-3 text-xs text-gray-500'
        };
    }
  };

  const styles = getTemplateStyles();

  const handleOpenPublicLink = () => {
    // Simulate opening public link
    alert('This would open the invoice as a public link (simulating SMS link behavior)');
  };

  const handleDownload = () => {
    // Simulate download
    alert('This would download the invoice as PDF');
  };

  return (
    <div className="space-y-4">
      {/* Mobile Frame */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="bg-white rounded-lg shadow-lg mx-auto" style={{ 
          width: selectedFormat === 'mobile' ? '360px' : '800px', 
          maxWidth: '100%' 
        }}>
          {/* Invoice Content */}
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
              {businessDetails.logo && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(businessDetails.logo)}
                    alt="Business Logo"
                    className="h-12 mx-auto object-contain"
                  />
                </div>
              )}
              <div className={styles.businessName}>
                {businessDetails.businessName || 'Your Business Name'}
              </div>
              <div className={styles.address}>
                {businessDetails.address || 'Your Business Address'}<br />
                {businessDetails.city || 'City'}, {businessDetails.state || 'State'} - {businessDetails.pin || 'PIN'}<br />
                Phone: {businessDetails.phone || 'Phone'} | Email: {businessDetails.email || 'Email'}
              </div>
              {businessDetails.gstin && (
                <div className="text-xs text-gray-600 mt-2">
                  GSTIN: {businessDetails.gstin}
                </div>
              )}
            </div>

            {/* Invoice Header */}
            <div className="p-4">
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceTitle}>TAX INVOICE</div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className={styles.invoiceMeta}>Invoice No: {sampleInvoiceData.invoiceNumber}</div>
                    <div className={styles.invoiceMeta}>Date: {sampleInvoiceData.date}</div>
                    <div className={styles.invoiceMeta}>Due Date: {sampleInvoiceData.dueDate}</div>
                  </div>
                  <div>
                    <div className={styles.invoiceMeta}>Place of Supply: {businessDetails.placeOfSupply || 'State'}</div>
                    <div className={styles.invoiceMeta}>Reverse Charge: No</div>
                    <div className={styles.invoiceMeta}>Payment Mode: Online</div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className={styles.customerSection}>
                <div className={styles.customerTitle}>Bill To:</div>
                <div className={styles.customerInfo}>
                  <div className="font-medium">{customer.name}</div>
                  <div>Phone: {customer.phone}</div>
                  <div>{customer.address}</div>
                  <div>{customer.city}, {customer.state} - {customer.pin}</div>
                  {customer.gstin && <div>GSTIN: {customer.gstin}</div>}
                </div>
              </div>

              {/* Items Table */}
              {selectedFormat === 'mobile' ? (
                /* Mobile-friendly vertical layout */
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{item.description}</div>
                        <div className="text-sm font-semibold">{formatINR(item.taxableValue)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>HSN: {item.hsn}</div>
                        <div>Qty: {item.quantity} {item.unit}</div>
                        <div>Rate: {formatINR(item.rate)}</div>
                        <div>Disc: {formatINR(item.discount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Regular table layout */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className="text-left py-2 px-1">Item</th>
                        <th className="text-left py-2 px-1">HSN</th>
                        <th className="text-center py-2 px-1">Qty</th>
                        <th className="text-center py-2 px-1">Unit</th>
                        <th className="text-right py-2 px-1">Rate</th>
                        <th className="text-right py-2 px-1">Disc</th>
                        <th className="text-right py-2 px-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className={styles.tableRow}>
                          <td className="py-2 px-1">{item.description}</td>
                          <td className="py-2 px-1">{item.hsn}</td>
                          <td className="py-2 px-1 text-center">{item.quantity}</td>
                          <td className="py-2 px-1 text-center">{item.unit}</td>
                          <td className="py-2 px-1 text-right">{formatINR(item.rate)}</td>
                          <td className="py-2 px-1 text-right">{formatINR(item.discount)}</td>
                          <td className="py-2 px-1 text-right">{formatINR(item.taxableValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tax Breakdown */}
              <div className="mt-4 text-xs">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {gstSplit.cgst > 0 && (
                  <>
                    <div className="flex justify-between py-1">
                      <span>CGST @ {gstRate}%:</span>
                      <span>{formatINR(gstSplit.cgst)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>SGST @ {gstRate}%:</span>
                      <span>{formatINR(gstSplit.sgst)}</span>
                    </div>
                  </>
                )}
                {gstSplit.igst > 0 && (
                  <div className="flex justify-between py-1">
                    <span>IGST @ {gstRate}%:</span>
                    <span>{formatINR(gstSplit.igst)}</span>
                  </div>
                )}
                {roundOff !== 0 && (
                  <div className="flex justify-between py-1">
                    <span>Round Off:</span>
                    <span>{formatINR(roundOff)}</span>
                  </div>
                )}
                <div className={`flex justify-between py-2 font-semibold ${styles.totalText}`}>
                  <span>Grand Total:</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="mt-4 text-xs text-gray-600">
                <div className="font-medium">Amount in Words:</div>
                <div className="italic">{amountInWordsINR(grandTotal)}</div>
              </div>

              {/* Signature */}
              {businessDetails.signature && (
                <div className="mt-6 text-center">
                  <img
                    src={URL.createObjectURL(businessDetails.signature)}
                    alt="Signature"
                    className="h-16 mx-auto object-contain"
                  />
                  <div className="text-xs text-gray-500 mt-2">Authorized Signature</div>
                </div>
              )}

              {/* Footer */}
              <div className={styles.footer}>
                <div className="text-center">
                  {/* Terms & Conditions - Only show if toggle is enabled */}
                  {businessDetails.showTermsConditions && businessDetails.termsConditions && (
                    <>
                      <div className="font-medium mb-2">Terms & Conditions:</div>
                      <div className="mb-2 whitespace-pre-line">
                        {businessDetails.termsConditions}
                      </div>
                    </>
                  )}
                  
                  {/* Declaration - Only show if toggle is enabled */}
                  {businessDetails.showDeclaration && businessDetails.declaration && (
                    <div className="mb-2">
                      <strong>Declaration:</strong> {businessDetails.declaration}
                    </div>
                  )}
                  
                  {/* Business Information - Only show if toggles are enabled */}
                  {(businessDetails.showPhone || businessDetails.showEmail || businessDetails.showGSTIN || businessDetails.showPAN || businessDetails.showCIN) && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 space-y-1">
                        {businessDetails.showPhone && businessDetails.phone && (
                          <div>Phone: {businessDetails.phone}</div>
                        )}
                        {businessDetails.showEmail && businessDetails.email && (
                          <div>Email: {businessDetails.email}</div>
                        )}
                        {businessDetails.showGSTIN && businessDetails.gstin && (
                          <div>GSTIN: {businessDetails.gstin}</div>
                        )}
                        {businessDetails.showPAN && businessDetails.pan && (
                          <div>PAN: {businessDetails.pan}</div>
                        )}
                        {businessDetails.showCIN && businessDetails.cin && (
                          <div>CIN: {businessDetails.cin}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Signature - Only show if toggle is enabled */}
                  {businessDetails.showSignature && businessDetails.signature && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <img
                        src={URL.createObjectURL(businessDetails.signature)}
                        alt="Signature"
                        className="h-12 mx-auto object-contain"
                      />
                      <div className="text-xs text-gray-500 mt-1">Authorized Signature</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-3">
                    E & OE (Errors and Omissions Excepted)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleOpenPublicLink}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white px-4 py-2 rounded-md font-medium hover:from-[#5D3EE8] hover:to-[#7A59FF] transition-all duration-300"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open as Public Link</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Preview Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-yellow-800">
              This preview shows how your invoice will appear when customers receive it via SMS links. 
              The mobile frame simulates a typical smartphone screen size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
