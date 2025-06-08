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
  baseURL: import.meta.env["VITE_API_BASE_URL"] || 'http://localhost:3000/api',
  timeout: 10000,
  retries: 3,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    updateProfile: '/auth/profile',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  // Products
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: '/products/search',
    categories: '/products/categories',
    featured: '/products/featured',
    trending: '/products/trending',
    recommendations: (id: string) => `/products/${id}/recommendations`,
  },
  // Cart
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: (id: string) => `/cart/update/${id}`,
    remove: (id: string) => `/cart/remove/${id}`,
    clear: '/cart/clear',
  },
  // Orders
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  // User
  user: {
    addresses: '/user/addresses',
    addAddress: '/user/addresses',
    updateAddress: (id: string) => `/user/addresses/${id}`,
    deleteAddress: (id: string) => `/user/addresses/${id}`,
    wishlist: '/user/wishlist',
    addToWishlist: '/user/wishlist/add',
    removeFromWishlist: (id: string) => `/user/wishlist/remove/${id}`,
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
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  productSearch: (filters: Record<string, unknown>) => ['products', 'search', filters] as const,
  categories: ['categories'] as const,
  featuredProducts: ['products', 'featured'] as const,
  trendingProducts: ['products', 'trending'] as const,
  recommendations: (id: string) => ['products', id, 'recommendations'] as const,
  // Cart
  cart: ['cart'] as const,
  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  // User
  addresses: ['user', 'addresses'] as const,
  wishlist: ['user', 'wishlist'] as const,
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'fashion', name: 'Fashion', slug: 'fashion' },
  { id: 'home', name: 'Home & Garden', slug: 'home-garden' },
  { id: 'sports', name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  { id: 'books', name: 'Books', slug: 'books' },
  { id: 'toys', name: 'Toys & Games', slug: 'toys-games' },
  { id: 'beauty', name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
  { id: 'automotive', name: 'Automotive', slug: 'automotive' },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'best-selling', label: 'Best Selling' },
] as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: Infinity, label: '$500 & Above' },
] as const;

// Rating options
export const RATING_OPTIONS = [
  { value: 4, label: '4 Stars & Up' },
  { value: 3, label: '3 Stars & Up' },
  { value: 2, label: '2 Stars & Up' },
  { value: 1, label: '1 Star & Up' },
] as const;

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
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  placeholder: '/images/placeholder.jpg',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/alohamarket',
  twitter: 'https://twitter.com/alohamarket',
  instagram: 'https://instagram.com/alohamarket',
  youtube: 'https://youtube.com/alohamarket',
  linkedin: 'https://linkedin.com/company/alohamarket',
} as const;
