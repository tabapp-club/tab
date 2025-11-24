// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  metrics?: any;
  categories?: Array<{ name: string; label: string }>;
}

// Authentication types
export interface AuthResponse {
  access_token: string;
  name?: string;
  userType?: string;
}



export interface SendOTPRequest {
  phone_number: string;
  country_code: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp: string;
}

export interface CreateCustomerRequest {
  name: string;
}

// Custom field types
export type FieldType = "Text" | "Number" | "Percentage" | "Dropdown" | "Date" | "Checkbox";

export interface CustomField {
  label: string;
  placeholder: string;
  required: boolean;
  field_type: FieldType;
}

export interface CreateCustomFieldRequest {
  label: string;
  placeholder: string;
  required: boolean;
  field_type: FieldType;
}

// Business data types
export interface BusinessDataResponse {
  all_customers?: number;
  all_customers_prev?: number;
  all_customers_change?: number;
  total_revenue?: number;
  total_revenue_prev?: number;
  total_revenue_change?: number;
  new_customers?: number;
  new_customers_prev?: number;
  new_customers_change?: number;
  new_customers_percentage?: number;
  retained_customers?: number;
  retained_customers_prev?: number;
  retained_customers_change?: number;
  retained_customers_percentage?: number;
  active_customers?: number;
  active_customers_prev?: number;
  active_customers_change?: number;
  active_customers_percentage?: number;
  inactive_customers?: number;
  inactive_customers_prev?: number;
  inactive_customers_change?: number;
  inactive_customers_percentage?: number;
  date?: string;
  filter_applied?: string;
}

export interface BusinessDataFilters {
  start_date?: string;
  end_date?: string;
  filter_days?: number;
}

// Data center types
export interface CustomerData {
  user_id: string;
  mobile_number: string;
  category: string | string[];
  user_type: string;
  no_of_visits: number;
  status: string;
  added_on: string;
}

export interface DataCenterFilters {
  page: number;
  page_size: number;
  category?: string;
  user_type?: string;
  no_of_visits_from?: number;
  no_of_visits_to?: number;
  status?: string;
  event_type?: string;
  search?: string;
}

export interface DataCenterResponse extends ApiResponse<CustomerData[]> {
  total: number;
  metrics?: any;
  categories?: Array<{ name: string; label: string }>;
}

// Business features types
export interface BusinessFeatures {
  dashboard: boolean;
  data_center: boolean;
  tribly_ai: boolean;
  achievements: boolean;
  cohorts: boolean;
  automation: boolean;
  campaigns: boolean;
  marketing_calendar: boolean;
  customer_funnel: boolean;
}

export interface BusinessDetails {
  _id: string;
  name: string;
  features: BusinessFeatures;
  [key: string]: any;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Wallet types
export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 'digital_invoice' | 'targeted_campaign' | 'event_campaign' | 'followup_reminder' | 'recharge' | 'refund';

export interface WalletBalance {
  balance: number;
  currency: string;
  last_updated: string;
}

export interface WalletTransaction {
  _id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  campaign_id?: string;
  campaign_name?: string;
  invoice_id?: string;
  customer_id?: string;
  customer_name?: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
  message_type?: string;
  communication_channel?: string | string[];
  metadata?: Record<string, any>;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface CategorySpending {
  category: TransactionCategory;
  category_label: string;
  total_spent: number;
  transaction_count: number;
  percentage: number;
}

export interface WalletSpendingBreakdown {
  total_spent: number;
  total_credited: number;
  current_balance: number;
  categories: CategorySpending[];
  period: {
    start_date: string;
    end_date: string;
  };
}

export interface CreatePaymentRequest {
  amount: number;
  payment_method: 'upi' | 'card' | 'netbanking';
  return_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  qr_code_url: string;
  payment_url: string;
  amount: number;
  status: 'pending' | 'processing';
  expires_at: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  transaction_id?: string;
  failure_reason?: string;
}

export interface WalletFilters {
  page?: number;
  page_size?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  start_date?: string;
  end_date?: string;
  filter_days?: number;
}

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}
