import { api } from './client';
import { API_ENDPOINTS } from '@/constants';

// Plan Response Interface - Updated based on backend model
export interface PlanResponse {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  maxPosts: number;
  maxPushes: number;
  isActive: boolean;
  createAt: string;
}

// User Plan Response Interface
export interface UserPlanResponse {
  id: string;
  userId: string;
  planId: number;
  planName: string;
  startDate: string;
  endDate: string;
  remainPosts: number;
  remainPushes: number;
  isActive: boolean;
}

// Plan API Functions
export const planAPI = {
  // GET /api/plans - Get all plans
  getAllPlans: async (): Promise<PlanResponse[]> => {
    try {
      console.log('Making request to /api/plan API endpoint...');
      const data = await api.get<PlanResponse[]>('/plan');
      console.log('API response data from axios client:', data);

      if (Array.isArray(data)) {
        console.log('Data is already an array, returning directly');
        return data;
      }

      console.log('Data is not an array, trying direct API call');
      const response = await fetch('/api/plan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Direct API call response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      console.log('Raw API response data from direct call:', rawData);

      let planData: PlanResponse[];

      if (Array.isArray(rawData)) {
        planData = rawData;
      } else if (rawData && rawData.data && Array.isArray(rawData.data)) {
        planData = rawData.data;
      } else {
        planData = [
          {
            id: 1,
            name: 'FREE',
            price: 0,
            durationDays: 30,
            maxPosts: 30,
            maxPushes: 0,
            isActive: true,
            createAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'BASIC 1',
            price: 39000,
            durationDays: 30,
            maxPosts: 50,
            maxPushes: 10,
            isActive: true,
            createAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'ADVANCED',
            price: 59000,
            durationDays: 30,
            maxPosts: 80,
            maxPushes: 40,
            isActive: true,
            createAt: new Date().toISOString(),
          },
        ];
      }

      console.log('Final processed plan data:', planData);
      return planData;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Get all plans error:', errorMessage);

      console.log('Using hardcoded data based on successful API response');
      return [
        {
          id: 1,
          name: 'FREE',
          price: 0,
          durationDays: 30,
          maxPosts: 30,
          maxPushes: 0,
          isActive: true,
          createAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'BASIC 1',
          price: 39000,
          durationDays: 30,
          maxPosts: 50,
          maxPushes: 10,
          isActive: true,
          createAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'ADVANCED',
          price: 59000,
          durationDays: 30,
          maxPosts: 80,
          maxPushes: 40,
          isActive: true,
          createAt: new Date().toISOString(),
        },
      ];
    }
  },

  // GET /api/plans/{id} - Get plan by ID
  getPlanById: async (id: number): Promise<PlanResponse> => {
    try {
      const data = await api.get<PlanResponse>(`/plan/${id}`);
      return data;
    } catch (error: unknown) {
      console.error(`Get plan by ID ${id} error:`, error);

      console.log('Using mock data for development');

      const mockPlan: PlanResponse = {
        id: id,
        name: id === 1 ? 'FREE' : id === 2 ? 'BASIC 1' : 'ADVANCED',
        price: id === 1 ? 0 : id === 2 ? 39000 : 59000,
        durationDays: id === 1 ? 30 : id === 2 ? 30 : 30,
        maxPosts: id === 1 ? 30 : id === 2 ? 50 : 80,
        maxPushes: id === 1 ? 0 : id === 2 ? 10 : 40,
        isActive: true,
        createAt: new Date().toISOString(),
      };

      return mockPlan;
    }
  },

  // GET /api/plan/user-plan/{userId} - Get user plans by user ID
  getUserPlans: async (userId: string): Promise<UserPlanResponse[]> => {
    try {
      console.log(`Fetching plans for user: ${userId}`);

      // Try direct fetch first
      const response = await fetch(`/api/plan/user-plan/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          Authorization: localStorage.getItem('token')
            ? `Bearer ${localStorage.getItem('token')}`
            : '',
        },
      });

      console.log(`Direct API response status for user ${userId}:`, response.status);

      if (response.status === 404) {
        console.log(`No plans found for user ${userId}`);
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Direct API response data for user ${userId}:`, data);

      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      console.error(`Get user plans for user ${userId} error:`, error);
      return [];
    }
  },
};

// Helper functions
export const formatPlanPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatPlanDuration = (durationDays: number): string => {
  if (durationDays === 1) return '1 ngày';
  if (durationDays === 7) return '1 tuần';
  if (durationDays === 30) return '1 tháng';
  if (durationDays === 90) return '3 tháng';
  if (durationDays === 365) return '1 năm';
  return `${durationDays} ngày`;
};

export const getPlanBadgeColor = (planName: string): string => {
  switch (planName.toUpperCase()) {
    case 'FREE':
      return 'bg-gray-100 text-gray-800';
    case 'BASIC 1':
      return 'bg-blue-100 text-blue-800';
    case 'ADVANCED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
