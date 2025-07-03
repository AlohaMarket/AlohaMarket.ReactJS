import type { Category } from '@/types/category.type';
import apiClient from './client';
import type { ApiResponse } from '@/types';

export const categoryAPI = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/category');
    return response.data.data;
  },
};
