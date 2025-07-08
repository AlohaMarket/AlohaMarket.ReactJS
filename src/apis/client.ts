import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils';
import { type ApiError, type ApiResponse, type ApiErrorResponse } from '@/types';
import { keycloak } from '@/lib/keycloak';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    // Handle token refresh or redirect to login if needed
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // // Show success toast if message exists
    // if (response.data.message) {
    //   toast.success(response.data.message);
    // }
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };

    if (error.response) {
      const { status, data }: { status: number; data: ApiErrorResponse } = error.response;

      // Backend returns { message, data } structure for errors too
      apiError.message = data.message || 'Something went wrong';
      apiError.data = data.data;

      switch (status) {
        case 400:
          apiError.code = 'BAD_REQUEST';
          break;
        case 401:
          apiError.code = 'UNAUTHORIZED';
          // Clear tokens and redirect for Keycloak
          if (keycloak.authenticated) {
            keycloak.logout();
          } else {
            storage.remove(STORAGE_KEYS.token);
            storage.remove(STORAGE_KEYS.user);
            window.location.href = '/';
          }
          break;
        case 403:
          apiError.code = 'FORBIDDEN';
          break;
        case 404:
          apiError.code = 'NOT_FOUND';
          break;
        case 422:
          apiError.code = 'VALIDATION_ERROR';
          // Handle validation errors from backend
          if (data.data && typeof data.data === 'object' && data.data !== null) {
            apiError.validationErrors = Object.entries(data.data as Record<string, string[]>).map(([field, messages]) => ({
              field,
              message: Array.isArray(messages) ? messages[0] : String(messages),
            }));
          }
          break;
        case 429:
          apiError.code = 'RATE_LIMIT';
          break;
        case 500:
          apiError.code = 'SERVER_ERROR';
          break;
        default:
          apiError.code = `HTTP_${status}`;
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.';
      apiError.code = 'NETWORK_ERROR';
    } else {
      apiError.message = error.message || 'Request failed';
      apiError.code = 'REQUEST_ERROR';
    }

    return Promise.reject(apiError);
  }
);


// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<ApiResponse<T>>(url, config).then((response) => response.data.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<ApiResponse<T>>(url, data, config).then((response) => response.data.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<ApiResponse<T>>(url, data, config).then((response) => response.data.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then((response) => response.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<ApiResponse<T>>(url, config).then((response) => response.data.data),

  getPaginated: <T>(url: string, config?: AxiosRequestConfig): Promise<{ items: T[]; meta: { total_pages: number; total_items: number; current_page: number; page_size: number } }> =>
    apiClient.get(url, config).then((response) => response.data.data),

  getFullResponse: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get<ApiResponse<T>>(url, config).then((response) => response.data),
};

export default apiClient;
