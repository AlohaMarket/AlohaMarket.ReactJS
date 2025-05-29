// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  categoryId?: string;
  brand?: string;
  rating: number;
  reviews: number;
  stock?: number;
  specifications?: Record<string, string>;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Pick<Product, 'id' | 'name' | 'image' | 'stock'>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Pick<Product, 'name' | 'image'>;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

// Language types
export type Language = 'en' | 'vi';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

// Marketplace listing types
export interface SellerInfo {
  full_name: string;
  avatar: string;
}

export interface MarketplaceListing {
  id: string;
  subject: string;
  price: number;
  webp_image: string;
  region_name: string;
  date: string;
  seller_info: SellerInfo;
}

// Raw API response types for marketplace
export interface RawMarketplaceItem {
  ad_id?: string | number;
  list_id?: string | number;
  subject?: string;
  price?: number;
  image?: string;
  webp_image?: string;
  region_name?: string;
  area?: string;
  date?: string;
  list_time?: string | number;
  account_name?: string;
  avatar?: string;
}

export interface MarketplaceApiResponse {
  data?: RawMarketplaceItem[];
}