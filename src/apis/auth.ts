import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';

// Mock users for development
const MOCK_USERS = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  userA: {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
  },
};

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock login for development
    const user = Object.values(MOCK_USERS).find(u => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: `mock-token-${user.id}`,
    };
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Mock register for development
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
    };
    
    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    };
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    // Mock get current user for development
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const userId = token.split('-')[2];
    const user = Object.values(MOCK_USERS).find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  // Logout user
  logout: async (): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout);
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    return api.post<AuthResponse>(API_ENDPOINTS.auth.refresh);
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.auth.profile);
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.put<User>(API_ENDPOINTS.auth.updateProfile, data);
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.changePassword, data);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  // Reset password
  resetPassword: async (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.resetPassword, data);
  },
}; 