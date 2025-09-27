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
  search?: string;
}

export interface DataCenterResponse extends ApiResponse<CustomerData[]> {
  total: number;
  metrics?: any;
  categories?: Array<{ name: string; label: string }>;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}