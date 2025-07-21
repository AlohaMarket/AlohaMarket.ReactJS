// App configuration
export const APP_CONFIG = {
  name: 'Aloha Market',
  description: 'Your one-stop services platform destination',
  version: '1.0.0',
  author: 'Aloha Market Team',
  email: 'support@alohamarket.com',
  phone: '+1 (555) 123-4567',
  address: '123 Market Street, City, State 12345',
} as const;

// API configuration
export const API_CONFIG = {
  baseURL: import.meta.env['VITE_API_GATEWAY_URL']
    ? import.meta.env['VITE_API_GATEWAY_URL'] + '/api'
    : '/api',
  timeout: 30000,
  retries: 3,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    register: '/user/register',
    profile: '/user/profile',
    all: '/user',
    delete: (userId: string) => `/user/${userId}`,
    updateStatus: (userId: string) => `/user/${userId}/status`,
    updateProfile: '/user/profile/update',
    verifyProfile: '/user/verify-profile',
    uploadAvatar: '/user/profile/avatar',
    removeAvatar: '/user/profile/avatar',
    sellerInfo: (userId: string) => `user/seller/${userId}`,
  },

  // Posts
  posts: {
    list: '/post',
    detail: (id: string) => `/post/${id}`,
    byUser: (userId: string) => `/post/user/${userId}`,
    create: '/post/create',
    afterCreate: (id: string) => `/post/${id}/after-create`,
    report: (id: string) => `/post/${id}/report`,
    violations: '/post/violations',
    status: '/post/status',
  },

  // Categories
  categories: {
    list: '/category',
  },

  location: {
    tree: '/location',
  },

  // Payment
  payment: {
    createOrder: '/Payment',
    createPaymentUrl: '/Payment/payment-url',
    getById: (id: string) => `/Payment/${id}`,
    getUserHistory: (userId: string) => `/Payment/user/${userId}`,
    ipn: '/Payment/ipn',
    callback: '/Payment/callback',
  },

  // User Plans
  userPlans: {
    list: '/plan',
    detail: (id: string) => `/plan/${id}`,
    me: '/plan/me',
    userId: (userId: string) => `/plan/user-plan/${userId}`,
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  token: 'aloha_market_token',
  user: 'aloha_market_user',
  cart: 'aloha_market_cart',
  language: 'aloha_market_language',
  theme: 'aloha_market_theme',
  recentSearches: 'aloha_market_recent_searches',
  wishlist: 'aloha_market_wishlist',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  // Auth
  user: ['user'] as const,
  // Products
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  postSearch: (filters: Record<string, unknown>) => ['posts', 'search', filters] as const,
  categories: ['categories'] as const,
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
] as const;

// Toast configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
} as const;

// Form validation
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message:
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Please enter a valid phone number',
  },
} as const;

// Image configuration
export const IMAGE_CONFIG = {
  maxSize: 3 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  placeholder: '/images/placeholder.jpg',
  maxImagesPerPost: 8,
} as const;

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/alohamarket',
  twitter: 'https://twitter.com/alohamarket',
  instagram: 'https://instagram.com/alohamarket',
  youtube: 'https://youtube.com/alohamarket',
  linkedin: 'https://linkedin.com/company/alohamarket',
} as const;
