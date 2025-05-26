import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils';
import { ApiError } from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          apiError.message = data.message || 'Bad request';
          apiError.code = 'BAD_REQUEST';
          break;
        case 401:
          apiError.message = 'Authentication required';
          apiError.code = 'UNAUTHORIZED';
          // Clear stored auth data on 401
          storage.remove(STORAGE_KEYS.token);
          storage.remove(STORAGE_KEYS.user);
          // Redirect to login page
          window.location.href = '/login';
          break;
        case 403:
          apiError.message = 'Access forbidden';
          apiError.code = 'FORBIDDEN';
          break;
        case 404:
          apiError.message = 'Resource not found';
          apiError.code = 'NOT_FOUND';
          break;
        case 422:
          apiError.message = data.message || 'Validation error';
          apiError.code = 'VALIDATION_ERROR';
          apiError.field = data.field;
          break;
        case 429:
          apiError.message = 'Too many requests';
          apiError.code = 'RATE_LIMIT';
          break;
        case 500:
          apiError.message = 'Internal server error';
          apiError.code = 'SERVER_ERROR';
          break;
        default:
          apiError.message = data.message || `HTTP ${status} error`;
          apiError.code = `HTTP_${status}`;
      }
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error. Please check your connection.';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Request setup error
      apiError.message = error.message || 'Request failed';
      apiError.code = 'REQUEST_ERROR';
    }

    return Promise.reject(apiError);
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then((response) => response.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then((response) => response.data),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then((response) => response.data),
};

export default apiClient; 