import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import {
  Product,
  Category,
  PaginatedResponse,
  SearchFilters,
} from '@/types';

export const productsApi = {
  // Get all products with pagination and filters
  getProducts: async (filters?: SearchFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.products.list}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<PaginatedResponse<Product>>(url);
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    return api.get<Product>(API_ENDPOINTS.products.detail(id));
  },

  // Search products
  searchProducts: async (query: string, filters?: SearchFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.products.search}?${params.toString()}`;
    return api.get<PaginatedResponse<Product>>(url);
  },

  // Get product categories
  getCategories: async (): Promise<Category[]> => {
    return api.get<Category[]>(API_ENDPOINTS.products.categories);
  },

  // Get featured products
  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<Product[]>(`${API_ENDPOINTS.products.featured}${params}`);
  },

  // Get trending products
  getTrendingProducts: async (limit?: number): Promise<Product[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<Product[]>(`${API_ENDPOINTS.products.trending}${params}`);
  },

  // Get product recommendations
  getRecommendations: async (productId: string, limit?: number): Promise<Product[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<Product[]>(`${API_ENDPOINTS.products.recommendations(productId)}${params}`);
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, filters?: SearchFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams({ category: categoryId });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.products.list}?${params.toString()}`;
    return api.get<PaginatedResponse<Product>>(url);
  },
}; 