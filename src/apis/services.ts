import { api } from './client';
import { type Product, type User, type PaginatedResponse } from '@/types';

// ===== PRODUCT API SERVICES =====

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    categoryId?: string;
    images?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: string;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export const productApi = {
    // Get single product
    getById: (id: string): Promise<Product> =>
        api.get<Product>(`/products/${id}`),

    // Get paginated products
    getAll: (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.category) params.append('category', filters.category);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.search) params.append('search', filters.search);

        return api.getPaginated<Product>(`/products?${params.toString()}`);
    },

    // Create product
    create: (data: CreateProductRequest): Promise<Product> =>
        api.post<Product>('/products', data),

    // Update product
    update: (data: UpdateProductRequest): Promise<Product> =>
        api.put<Product>(`/products/${data.id}`, data),

    // Delete product
    delete: (id: string): Promise<void> =>
        api.delete<void>(`/products/${id}`),

    // Get product recommendations
    getRecommendations: (id: string): Promise<Product[]> =>
        api.get<Product[]>(`/products/${id}/recommendations`),
};

// ===== USER API SERVICES =====

export interface UpdateUserProfileRequest {
    userName?: string;
    phoneNumber?: string;
    birthDate?: string;
}

export interface UploadAvatarRequest {
    file: File;
}

export const userApi = {
    // Get current user profile
    getProfile: (): Promise<User> =>
        api.get<User>('/user/profile'),

    // Update user profile
    updateProfile: (data: UpdateUserProfileRequest): Promise<User> =>
        api.put<User>('/user/profile/update', data),

    // Upload avatar
    uploadAvatar: (file: File): Promise<{ avatarUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        return api.post<{ avatarUrl: string }>('/user/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Remove avatar
    removeAvatar: (): Promise<void> =>
        api.delete<void>('/user/profile/avatar'),

    // Verify profile
    verifyProfile: (): Promise<{ isVerified: boolean }> =>
        api.post<{ isVerified: boolean }>('/user/verify-profile'),
};

// ===== POST API SERVICES (Example from your backend) =====

export interface CreatePostRequest {
    title: string;
    description: string;
    price: number;
    currency: string;
    provinceText: string;
    districtText: string;
    wardText: string;
    userPlanId?: string;
    images?: Array<{
        imageUrl: string;
        order: number;
    }>;
}

export interface PostFilters {
    page?: number;
    limit?: number;
    province?: string;
    district?: string;
    ward?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export interface Post {
    id: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    provinceText: string;
    districtText: string;
    wardText: string;
    attributes?: Record<string, unknown>;
    images?: Array<{
        imageUrl: string;
        order: number;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export const postApi = {
    // Get single post
    getById: (id: string): Promise<Post> =>
        api.get<Post>(`/posts/${id}`),

    // Get paginated posts
    getAll: (filters?: PostFilters): Promise<PaginatedResponse<Post>> => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.province) params.append('province', filters.province);
        if (filters?.district) params.append('district', filters.district);
        if (filters?.ward) params.append('ward', filters.ward);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.search) params.append('search', filters.search);

        return api.getPaginated<Post>(`/posts?${params.toString()}`);
    },

    // Create post
    create: (data: CreatePostRequest): Promise<Post> =>
        api.post<Post>('/posts', data),

    // Update post
    update: (id: string, data: Partial<CreatePostRequest>): Promise<Post> =>
        api.put<Post>(`/posts/${id}`, data),

    // Delete post
    delete: (id: string): Promise<void> =>
        api.delete<void>(`/posts/${id}`),
};

// ===== EXAMPLE USAGE IN COMPONENTS =====

/*
// Component example sử dụng productApi
import { useQuery, useMutation } from '@tanstack/react-query';
import { productApi } from '@/apis/services';
import { useApiError } from '@/hooks/useApiError';

const ProductList = () => {
  const { handleError } = useApiError();

  // Fetch products with pagination
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products', { page: 1, limit: 10 }],
    queryFn: () => productApi.getAll({ page: 1, limit: 10 }),
  });

  // Handle error
  React.useEffect(() => {
    if (isError && error) {
      handleError(error as unknown as ApiError);
    }
  }, [isError, error, handleError]);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      toast.success('Product created successfully!');
    },
    onError: (error: ApiError) => {
      handleError(error);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        Total: {products?.meta.total_items} products
        (Page {products?.meta.current_page} of {products?.meta.total_pages})
      </div>
      
      {products?.items.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

// Form component với validation errors
const CreateProductForm = () => {
  const { handleError, handleValidationErrors } = useApiError();
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: '',
    description: '',
    price: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      toast.success('Product created!');
      setFormData({ title: '', description: '', price: 0 });
      setFormErrors({});
    },
    onError: (error: ApiError) => {
      if (error.code === 'VALIDATION_ERROR') {
        setFormErrors(handleValidationErrors(error));
      } else {
        handleError(error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className={formErrors['Title'] ? 'border-red-500' : 'border-gray-300'}
      />
      {formErrors['Title'] && <span className="text-red-500">{formErrors['Title']}</span>}
      
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};
*/
