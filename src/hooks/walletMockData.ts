import {
  WalletBalance,
  WalletTransaction,
  WalletTransactionsResponse,
  WalletSpendingBreakdown,
  CategorySpending,
  PaymentResponse,
  PaymentStatusResponse,
} from '@/lib/api/types';

// Mock wallet balance
export const mockWalletBalance: WalletBalance = {
  balance: 12500.50,
  currency: 'INR',
  last_updated: new Date().toISOString(),
};

// Mock transactions with various categories and types
export const mockTransactions: WalletTransaction[] = [
  // Recent transactions
  {
    _id: 'txn_001',
    amount: 2500,
    type: 'debit',
    category: 'targeted_campaign',
    description: 'Targeted Campaign: Summer Sale Promo',
    campaign_id: 'camp_001',
    campaign_name: 'Summer Sale Promo',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'completed',
    message_type: 'template',
    communication_channel: 'whatsapp',
    metadata: {
      recipients: 500,
      channel: 'whatsapp',
    },
  },
  {
    _id: 'txn_002',
    amount: 1500,
    type: 'debit',
    category: 'digital_invoice',
    description: 'Digital Invoice: Invoice #INV-2024-001',
    invoice_id: 'inv_001',
    customer_id: 'cust_001',
    customer_name: 'Rajesh Kumar',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'completed',
    message_type: 'document',
    communication_channel: ['whatsapp', 'sms'],
    metadata: {
      invoice_amount: 15000,
      items: 5,
    },
  },
  {
    _id: 'txn_003',
    amount: 3000,
    type: 'debit',
    category: 'event_campaign',
    description: 'Event Campaign: Diwali Special Offer',
    campaign_id: 'camp_002',
    campaign_name: 'Diwali Special Offer',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'completed',
    message_type: 'text',
    communication_channel: 'sms',
    metadata: {
      recipients: 1200,
      channel: 'sms',
    },
  },
  {
    _id: 'txn_004',
    amount: 5000,
    type: 'credit',
    category: 'recharge',
    description: 'Wallet Recharge via UPI',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    metadata: {
      payment_method: 'upi',
      transaction_id: 'pay_001',
    },
  },
  {
    _id: 'txn_005',
    amount: 800,
    type: 'debit',
    category: 'followup_reminder',
    description: 'Follow-up Reminder: Appointment Reminder',
    campaign_id: 'camp_003',
    campaign_name: 'Appointment Reminder',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'completed',
    message_type: 'text',
    communication_channel: 'whatsapp',
    metadata: {
      recipients: 200,
      channel: 'whatsapp',
    },
  },
  {
    _id: 'txn_006',
    amount: 1200,
    type: 'debit',
    category: 'digital_invoice',
    description: 'Digital Invoice: Invoice #INV-2024-002',
    invoice_id: 'inv_002',
    customer_id: 'cust_002',
    customer_name: 'Priya Sharma',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: 'completed',
    message_type: 'document',
    communication_channel: 'whatsapp',
    metadata: {
      invoice_amount: 12000,
      items: 3,
    },
  },
  {
    _id: 'txn_007',
    amount: 1800,
    type: 'debit',
    category: 'targeted_campaign',
    description: 'Targeted Campaign: New Product Launch',
    campaign_id: 'camp_004',
    campaign_name: 'New Product Launch',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    message_type: 'image',
    communication_channel: ['whatsapp', 'sms'],
    metadata: {
      recipients: 360,
      channel: 'whatsapp',
    },
  },
  {
    _id: 'txn_008',
    amount: 10000,
    type: 'credit',
    category: 'recharge',
    description: 'Wallet Recharge via Card',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    status: 'completed',
    metadata: {
      payment_method: 'card',
      transaction_id: 'pay_002',
    },
  },
  {
    _id: 'txn_009',
    amount: 600,
    type: 'debit',
    category: 'event_campaign',
    description: 'Event Campaign: Weekend Flash Sale',
    campaign_id: 'camp_005',
    campaign_name: 'Weekend Flash Sale',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'completed',
    message_type: 'text',
    communication_channel: 'sms',
    metadata: {
      recipients: 150,
      channel: 'sms',
    },
  },
  {
    _id: 'txn_010',
    amount: 450,
    type: 'debit',
    category: 'followup_reminder',
    description: 'Follow-up Reminder: Payment Due',
    campaign_id: 'camp_006',
    campaign_name: 'Payment Due Reminder',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    status: 'completed',
    message_type: 'template',
    communication_channel: 'whatsapp',
    metadata: {
      recipients: 90,
      channel: 'whatsapp',
    },
  },
  {
    _id: 'txn_011',
    amount: 2000,
    type: 'debit',
    category: 'digital_invoice',
    description: 'Digital Invoice: Invoice #INV-2024-003',
    invoice_id: 'inv_003',
    customer_id: 'cust_003',
    customer_name: 'Amit Patel',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    status: 'completed',
    message_type: 'document',
    communication_channel: ['whatsapp', 'sms'],
    metadata: {
      invoice_amount: 20000,
      items: 8,
    },
  },
  {
    _id: 'txn_012',
    amount: 150,
    type: 'credit',
    category: 'refund',
    description: 'Refund: Failed Campaign - Partial Refund',
    campaign_id: 'camp_007',
    campaign_name: 'Failed Campaign',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'completed',
    metadata: {
      reason: 'campaign_failed',
      original_amount: 300,
    },
  },
  {
    _id: 'txn_013',
    amount: 3200,
    type: 'debit',
    category: 'targeted_campaign',
    description: 'Targeted Campaign: Customer Retention',
    campaign_id: 'camp_008',
    campaign_name: 'Customer Retention',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: 'completed',
    message_type: 'interactive',
    communication_channel: 'whatsapp',
    metadata: {
      recipients: 640,
      channel: 'whatsapp',
    },
  },
  {
    _id: 'txn_014',
    amount: 950,
    type: 'debit',
    category: 'event_campaign',
    description: 'Event Campaign: Festival Special',
    campaign_id: 'camp_009',
    campaign_name: 'Festival Special',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    status: 'completed',
    message_type: 'text',
    communication_channel: 'sms',
    metadata: {
      recipients: 190,
      channel: 'sms',
    },
  },
  {
    _id: 'txn_015',
    amount: 5000,
    type: 'credit',
    category: 'recharge',
    description: 'Wallet Recharge via Net Banking',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    status: 'completed',
    metadata: {
      payment_method: 'netbanking',
      transaction_id: 'pay_003',
    },
  },
];

// Mock transactions response
export function getMockTransactionsResponse(
  filters?: { 
    type?: 'credit' | 'debit'; 
    category?: string; 
    page?: number; 
    page_size?: number;
    start_date?: string;
    end_date?: string;
    filter_days?: number;
  }
): WalletTransactionsResponse {
  let filtered = [...mockTransactions];

  // Filter by type
  if (filters?.type) {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Filter by category
  if (filters?.category) {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // Filter by date range
  if (filters?.start_date && filters?.end_date) {
    const startDate = new Date(filters.start_date);
    const endDate = new Date(filters.end_date);
    endDate.setHours(23, 59, 59, 999); // Include entire end date
    
    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  } else if (filters?.filter_days !== undefined) {
    // Filter by number of days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (filters.filter_days || 0));
    cutoffDate.setHours(0, 0, 0, 0);
    
    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= cutoffDate;
    });
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const page = filters?.page || 1;
  const pageSize = filters?.page_size || 50;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    transactions: paginated,
    total: filtered.length,
    page: page,
    page_size: pageSize,
    has_next: endIndex < filtered.length,
  };
}

// Mock spending breakdown - calculate based on filtered transactions
export function getMockSpendingBreakdown(
  startDate?: string,
  endDate?: string
): WalletSpendingBreakdown {
  let filtered = [...mockTransactions];

  // Filter by date range if provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  // Calculate totals
  const totalSpent = filtered
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCredited = filtered
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate category-wise spending
  const categoryMap = new Map<TransactionCategory, { spent: number; count: number }>();
  
  filtered.forEach((t) => {
    if (t.type === 'debit') {
      const existing = categoryMap.get(t.category) || { spent: 0, count: 0 };
      categoryMap.set(t.category, {
        spent: existing.spent + t.amount,
        count: existing.count + 1,
      });
    } else if (t.type === 'credit') {
      // For credits, we still count them but don't add to spent
      const existing = categoryMap.get(t.category) || { spent: 0, count: 0 };
      categoryMap.set(t.category, {
        spent: existing.spent,
        count: existing.count + 1,
      });
    }
  });

  // Build categories array
  const categories: CategorySpending[] = [
    {
      category: 'targeted_campaign',
      category_label: 'Targeted Campaign',
      total_spent: categoryMap.get('targeted_campaign')?.spent || 0,
      transaction_count: categoryMap.get('targeted_campaign')?.count || 0,
      percentage: totalSpent > 0 ? ((categoryMap.get('targeted_campaign')?.spent || 0) / totalSpent) * 100 : 0,
    },
    {
      category: 'digital_invoice',
      category_label: 'Digital Invoice',
      total_spent: categoryMap.get('digital_invoice')?.spent || 0,
      transaction_count: categoryMap.get('digital_invoice')?.count || 0,
      percentage: totalSpent > 0 ? ((categoryMap.get('digital_invoice')?.spent || 0) / totalSpent) * 100 : 0,
    },
    {
      category: 'event_campaign',
      category_label: 'Event Campaign',
      total_spent: categoryMap.get('event_campaign')?.spent || 0,
      transaction_count: categoryMap.get('event_campaign')?.count || 0,
      percentage: totalSpent > 0 ? ((categoryMap.get('event_campaign')?.spent || 0) / totalSpent) * 100 : 0,
    },
    {
      category: 'followup_reminder',
      category_label: 'Follow-up Reminder',
      total_spent: categoryMap.get('followup_reminder')?.spent || 0,
      transaction_count: categoryMap.get('followup_reminder')?.count || 0,
      percentage: totalSpent > 0 ? ((categoryMap.get('followup_reminder')?.spent || 0) / totalSpent) * 100 : 0,
    },
    {
      category: 'recharge',
      category_label: 'Recharge',
      total_spent: 0,
      transaction_count: categoryMap.get('recharge')?.count || 0,
      percentage: 0,
    },
    {
      category: 'refund',
      category_label: 'Refund',
      total_spent: 0,
      transaction_count: categoryMap.get('refund')?.count || 0,
      percentage: 0,
    },
  ].filter((cat) => cat.transaction_count > 0); // Only show categories with transactions

  return {
    total_spent: totalSpent,
    total_credited: totalCredited,
    current_balance: 12500.50, // This would come from wallet balance
    categories: categories,
    period: {
      start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: endDate || new Date().toISOString().split('T')[0],
    },
  };
}

// Legacy mock for backward compatibility
export const mockSpendingBreakdown: WalletSpendingBreakdown = getMockSpendingBreakdown();

// Store payment amounts for status checks (in a real app, this would be in a database)
const paymentAmounts = new Map<string, number>();

// Mock payment response
export function getMockPaymentResponse(amount: number, paymentMethod: string): PaymentResponse {
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store the amount for later status checks
  paymentAmounts.set(paymentId, amount);
  
  return {
    payment_id: paymentId,
    qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=merchant@upi&pn=Merchant%20Name&am=${amount}&cu=INR&tn=Wallet%20Recharge`)}`,
    payment_url: `https://payment.gateway.com/pay/${paymentId}`,
    amount: amount,
    status: 'pending',
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
  };
}

// Mock payment status
export function getMockPaymentStatus(paymentId: string, amount?: number): PaymentStatusResponse {
  // Get stored amount or use provided amount
  const paymentAmount = amount || paymentAmounts.get(paymentId) || 0;
  
  // For demo purposes, let's make it more likely to be completed after a delay
  // Check if payment was created more than 8 seconds ago
  const paymentCreated = parseInt(paymentId.split('_')[1] || '0');
  const timeSinceCreation = Date.now() - paymentCreated;
  const shouldComplete = timeSinceCreation > 8000; // Complete after 8 seconds
  
  if (shouldComplete) {
    // Clean up stored amount
    paymentAmounts.delete(paymentId);
    return {
      payment_id: paymentId,
      status: 'completed',
      amount: paymentAmount,
      transaction_id: `txn_${Date.now()}`,
    };
  }
  
  return {
    payment_id: paymentId,
    status: 'pending',
    amount: paymentAmount,
  };
}

