import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
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
    email: 'admin@alohamarket.com',
    password: 'admin123',
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567890',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  alice: {
    id: '2',
    email: 'alice@example.com',
    password: 'alice123',
    name: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b0f1?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567891',
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  bob: {
    id: '3',
    email: 'bob@example.com',
    password: 'bob123',
    name: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567892',
    role: 'seller',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  carol: {
    id: '4',
    email: 'carol@example.com',
    password: 'carol123',
    name: 'Carol Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567893',
    role: 'user',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  david: {
    id: '5',
    email: 'david@example.com',
    password: 'david123',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567894',
    role: 'seller',
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z',
  },
  emma: {
    id: '6',
    email: 'emma@example.com',
    password: 'emma123',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567895',
    role: 'user',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
  },
  frank: {
    id: '7',
    email: 'frank@example.com',
    password: 'frank123',
    name: 'Frank Miller',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567896',
    role: 'seller',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
  },
  grace: {
    id: '8',
    email: 'grace@example.com',
    password: 'grace123',
    name: 'Grace Lee',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    phone: '+1234567897',
    role: 'user',
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-02-20T00:00:00.000Z',
  },
};

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock login for development
    const user = Object.values(MOCK_USERS).find(u => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

    // Check if email already exists
    const existingUser = Object.values(MOCK_USERS).find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }    const newUser: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    };
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    // Mock get current user for development
    const token = localStorage.getItem('aloha_market_token');
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
      avatar: user.avatar,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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