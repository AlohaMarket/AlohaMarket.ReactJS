import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
  Product,
  Category,
  PaginatedResponse,
  SearchFilters,
  MarketplaceListing,
  MarketplaceApiResponse,
  RawMarketplaceItem,
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
  },  // Get marketplace listings
  getMarketplaceListings: async (limit?: number, page: number = 1): Promise<MarketplaceListing[]> => {
    try {
      const params = new URLSearchParams();
      if (limit) {
        params.append('limit', limit.toString());
      }
      params.append('fingerprint', 'undefined');
      params.append('page', page.toString());
      
      const url = `https://gateway.chotot.com/v1/public/recommender/homepage?${params.toString()}`;
      const response = await api.get<MarketplaceApiResponse>(url);
      
      // Extract and transform the data array from the response
      return (response?.data || []).map((item: RawMarketplaceItem) => ({
        id: item.ad_id?.toString() || item.list_id?.toString() || '',
        subject: item.subject || 'No title',
        price: item.price || 0,
        webp_image: item.image || item.webp_image || '',
        region_name: item.region_name || item.area || 'Unknown location',
        date: item.list_time ? new Date(item.list_time).toISOString() : new Date().toISOString(),
        seller_info: {
          full_name: item.account_name || 'Anonymous',
          avatar: item.avatar || '/placeholder-avatar.png'
        }
      }));
    } catch (error) {
      console.error('Failed to fetch marketplace listings:', error);
      return [];
    }
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