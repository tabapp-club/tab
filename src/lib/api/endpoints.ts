import { apiClient } from './client';
import {
  AuthResponse,
  BusinessDataResponse,
  DataCenterResponse,
  SendOTPRequest,
  VerifyOTPRequest,
  CreateCustomerRequest,
  BusinessDataFilters,
  DataCenterFilters,
} from './types';

// Authentication endpoints
export const auth = {
  sendOTP: (data: SendOTPRequest): Promise<{ success: boolean; message?: string }> =>
    apiClient.post('/dashboard/v1/user/login', data),

  verifyOTP: (data: VerifyOTPRequest): Promise<{ message: string; data: { token: string } }> =>
    apiClient.post('/dashboard/v1/user/verify-otp', data),

  getUser: (token: string): Promise<{ message: string; data: { user_type: string } }> =>
    apiClient.get('/dashboard/v1/user/me', { headers: apiClient.withAuth(token) }),

  createCustomer: (token: string, data: CreateCustomerRequest): Promise<{ success: boolean; message?: string }> =>
    apiClient.put('/dashboard/v1customers/{business_id}/customers/{customer_id}', data, { headers: apiClient.withAuth(token) }),
};

// Business Log and Entry endpoints
export const business = {
  getBusinesses: (token: string): Promise<{ message: string; data: Array<{ _id: string; name: string; [key: string]: any }> }> =>
    apiClient.get('/dashboard/v1/business/', { headers: apiClient.withAuth(token) }),

  // Business entries endpoints
  getBusinessLogEntries: (
    token: string,
    businessId: string,
    limit?: number,
    cursor?: string
  ): Promise<{ message: string; data: any[]; next_cursor?: string }> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);
    const queryString = params.toString();
    return apiClient.get(
      `/dashboard/v1/business_log/${businessId}/business_entries${queryString ? `?${queryString}` : ''}`,
      { headers: apiClient.withAuth(token) }
    );
  },

  createBusinessEntry: (token: string, businessId: string, data: any): Promise<{ message: string; data: { id: string } }> =>
    apiClient.post(`/dashboard/v1/business_entries/${businessId}`, data, { headers: apiClient.withAuth(token) }),

  updateBusinessEntry: (token: string, businessId: string, entryId: string, data: any): Promise<{ message: string; data: any }> =>
    apiClient.patch(`/dashboard/v1/business_entries/${businessId}/${entryId}`, data, { headers: apiClient.withAuth(token) }),

  deleteBusinessEntry: (token: string, businessId: string, entryId: string): Promise<{ message: string }> =>
    apiClient.delete(`/dashboard/v1/business_entries/${businessId}/${entryId}`, { headers: apiClient.withAuth(token) }),

  getDashboardData: (
    token: string,
    filters?: BusinessDataFilters
  ): Promise<{ message: string; data: BusinessDataResponse }> => {
    const queryString = filters ? apiClient.buildQueryString(filters) : '';
    return apiClient.get(`/dashboard/v1/overview/business_metrics${queryString}`, {
      headers: apiClient.withAuth(token)
    });
  },

  getCustomFields: (token: string, businessId: string): Promise<{ message: string; data: Array<{ label: string; placeholder: string; required: boolean; field_type: string }> }> =>
    apiClient.get(`/dashboard/v1/business_log/${businessId}/custom_fields`, { headers: apiClient.withAuth(token) }),

  updateCustomField: (token: string, businessId: string, label: string, data: { label: string; placeholder: string; required: boolean; field_type: string }): Promise<{ message: string; data: Array<{ label: string; placeholder: string; required: boolean; field_type: string }> }> =>
    apiClient.put(`/dashboard/v1/business_log/${businessId}/custom_fields?label=${encodeURIComponent(label)}`, data, { headers: apiClient.withAuth(token) }),

  deleteCustomField: (token: string, businessId: string, labels: string): Promise<{ message: string; success?: boolean; error?: string }> =>
    apiClient.delete(`/dashboard/v1/business_log/${businessId}/custom_fields?labels=${encodeURIComponent(labels)}`, { headers: apiClient.withAuth(token) }),
};

// Data center endpoints
export const dataCenter = {
  getCustomers: (
    token: string,
    filters: DataCenterFilters
  ): Promise<DataCenterResponse> => {
    const queryString = apiClient.buildQueryString(filters);
    return apiClient.get(`/dashboard/v1/data_center/data_center_grid_data${queryString}`, {
      headers: apiClient.withAuth(token)
    });
  },
};

// Export all endpoints
export const api = {
  auth,
  business,
  dataCenter,
};
