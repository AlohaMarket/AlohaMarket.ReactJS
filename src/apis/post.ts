import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
  PaginatedResponse,
} from '@/types';
import type { PostDetailResponse, PostListResponse, PostFilters } from '@/types/post.type';

export const postsApi = {
  getPosts: async (filters?: PostFilters): Promise<PaginatedResponse<PostListResponse>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.posts.list}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<PaginatedResponse<PostListResponse>>(url);
  },

  // Get single Post by ID
  getPost: async (id: string): Promise<PostDetailResponse> => {
    return api.get<PostDetailResponse>(API_ENDPOINTS.posts.detail(id));
  },
};