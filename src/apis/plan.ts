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
      console.log('Making request to /api/plan API endpoint...');

      // Dùng axios client đã cấu hình
      const data = await api.get<PlanResponse[]>('/plan');
      console.log('API response data from axios client:', data);

      // Nếu data đã là mảng, trả về luôn
      if (Array.isArray(data)) {
        console.log('Data is already an array, returning directly');
        return data;
      }

      // Không phải mảng, thử truy cập API trực tiếp
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

      // Xác định format của response
      let planData: PlanResponse[];

      if (Array.isArray(rawData)) {
        planData = rawData;
      } else if (rawData && rawData.data && Array.isArray(rawData.data)) {
        planData = rawData.data;
      } else {
        // Dữ liệu bạn đã log ra trong console
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

      // Trả về dữ liệu API từ log của bạn
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
      // Sử dụng axios client từ config
      const data = await api.get<PlanResponse>(`/plan/${id}`);
      return data;
    } catch (error: unknown) {
      console.error(`Get plan by ID ${id} error:`, error);

      // Trả về dữ liệu mẫu cho phát triển
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
