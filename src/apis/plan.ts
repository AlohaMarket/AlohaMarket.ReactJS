import { api } from './client';

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

// Plan API Functions - Only GET and GET ALL
export const planAPI = {
  // GET /api/plans - Get all plans
  getAllPlans: async (): Promise<PlanResponse[]> => {
    try {
      // Sử dụng proxy thay vì direct call
      const response = await fetch('/plans-api/plans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error: any) {
      console.error('Get all plans error:', error);
      throw new Error(error.message || 'Không thể lấy danh sách gói dịch vụ');
    }
  },

  // GET /api/plans/{id} - Get plan by ID
  getPlanById: async (id: number): Promise<PlanResponse> => {
    try {
      const response = await fetch(`/plans-api/plans/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get plan by ID error:', error);
      throw new Error(error.message || 'Không thể lấy thông tin gói dịch vụ');
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
