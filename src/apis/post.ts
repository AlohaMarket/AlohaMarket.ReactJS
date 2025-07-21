import type { PaginatedResponse } from '@/types';
import type { PostCreateResponse, PostDetailResponse, PostFilters, PostListResponse, UserPostFilters } from '@/types/post.type';
import { api } from './client';
import { API_ENDPOINTS } from '@/constants';

export const postsApi = {
  getPosts: (filters?: PostFilters) =>
    api.get<PaginatedResponse<PostListResponse>>(API_ENDPOINTS.posts.list, { params: filters }),

  getPost: (id: string) =>
    api.get<PostDetailResponse>(`${API_ENDPOINTS.posts.detail(id)}`),

  createPost: (formData: FormData) =>
    api.post<PostCreateResponse>(API_ENDPOINTS.posts.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Get posts created by the logged-in user
  getMyPosts: (filters?: UserPostFilters) =>
    api.get<PaginatedResponse<PostListResponse>>(`${API_ENDPOINTS.posts.list}/me`, { params: filters }),

  // get post after created data (for validation view)
  getPostAfterCreate: (id: string) =>
    api.get<PostCreateResponse>(`${API_ENDPOINTS.posts.afterCreate(id)}`),

  // Get posts by a specific seller
  getPostsBySeller: (sellerId: string, filters?: UserPostFilters) =>
    api.get<PaginatedResponse<PostListResponse>>(`${API_ENDPOINTS.posts.byUser(sellerId)}`, { params: filters }),

  // Gửi report bài đăng, không cần body, chỉ cần token
  reportPost: (postId: string) =>
    api.put<{ message: string; data: any }>(API_ENDPOINTS.posts.report(postId)),
};