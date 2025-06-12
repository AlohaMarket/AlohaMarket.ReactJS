import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
  User,
  ApiResponse,
} from '@/types';

export const authApi = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return api.get<ApiResponse<User>>(API_ENDPOINTS.auth.profile);
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put<ApiResponse<User>>(API_ENDPOINTS.auth.updateProfile, data);
  },

  // Initialize user profile
  initUserProfile: async (): Promise<ApiResponse<User>> => {
    // Send the request through YARP API gateway
    return api.post<ApiResponse<User>>(API_ENDPOINTS.auth.register, null);
  },

  // Upload avatar image
  uploadAvatar: async (formData: FormData): Promise<ApiResponse<User>> => {
    return api.patch<ApiResponse<User>>(
      API_ENDPOINTS.auth.uploadAvatar,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};