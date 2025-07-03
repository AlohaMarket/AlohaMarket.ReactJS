import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
  ApiResponse,
} from '@/types';
import type { Seller, User } from '@/types/user.type';

export const authApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.auth.profile);
    return response;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(API_ENDPOINTS.auth.updateProfile, data);
    return response;
  },

  // Initialize user profile
  initUserProfile: async (): Promise<User> => {
    // Send the request through YARP API gateway
    const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.auth.register, null);
    return response.data;
  },

  // Upload avatar image
  uploadAvatar: async (formData: FormData): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      API_ENDPOINTS.auth.uploadAvatar,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getSellerInfo: async (userId: string): Promise<Seller> => {
    const response = await api.get<Seller>(`${API_ENDPOINTS.auth.sellerInfo(userId)}`);
    return response;
  }
};