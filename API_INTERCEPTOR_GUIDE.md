# API Interceptor và Error Handling Guide

## Tổng quan

Hệ thống API interceptor được thiết kế để xử lý nhất quán các response và error từ backend API. Backend trả về tất cả response theo cấu trúc `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  message: string;
  data: T;
}
```

## Cấu trúc Response

### 1. Response thành công (Single Data)

```json
{
  "message": "Post retrieved successfully!",
  "data": {
    "id": "3f3cca96-587a-4466-9932-6fe0b624027e",
    "userId": "2aa34073-56c4-45c7-a5e2-81d0db7a6b1c",
    "title": "Naruto Ep 1",
    "description": "Naruto Ep 1",
    "price": 3000,
    "currency": "VND"
  }
}
```

### 2. Response thành công (Paginated Data)

```json
{
  "message": "Posts retrieved successfully!",
  "data": {
    "items": [...],
    "meta": {
      "total_pages": 1,
      "total_items": 3,
      "current_page": 1,
      "page_size": 10
    }
  }
}
```

### 3. Error Response (General)

```json
{
  "message": "Invalid location level",
  "data": {
    "errorId": "4f6fc956-b48c-4033-b9b7-9133c81acf46",
    "timestamp": "2025-06-30T17:33:10.3138107Z",
    "retryAfter": null
  }
}
```

### 4. Validation Error (422)

```json
{
  "message": "Validation failed",
  "data": {
    "Price": ["Price must be greater than 0"],
    "UserPlanId": ["The value '3fa85f64-5717-4562-b3fc-2c963f66afa' is not valid for UserPlanId."],
    "Description": ["Description must be between 10 and 2000 characters"]
  }
}
```

## API Client Usage

### 1. Basic API Calls

```typescript
import { api } from '@/apis/client';

// GET request
const products = await api.get<Product[]>('/products');

// POST request
const newProduct = await api.post<Product>('/products', {
  name: 'New Product',
  price: 100,
});

// PUT request
const updatedProduct = await api.put<Product>(`/products/${id}`, updateData);

// DELETE request
await api.delete(`/products/${id}`);
```

### 2. Paginated Data

```typescript
// For paginated responses
const paginatedData = await api.getPaginated<Product>('/products?page=1&limit=10');
console.log(paginatedData.items); // Array of products
console.log(paginatedData.meta); // Pagination info
```

### 3. Full Response (including message)

```typescript
// To get both message and data
const fullResponse = await api.getFullResponse<Product>('/products/123');
console.log(fullResponse.message); // "Product retrieved successfully"
console.log(fullResponse.data); // Product data
```

## Error Handling trong Components

### 1. Sử dụng với React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApiError } from '@/hooks/useApiError';
import { api } from '@/apis/client';

const MyComponent = () => {
  const { handleError, handleValidationErrors } = useApiError();

  // Query với error handling
  const { data, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/products'),
  });

  // Handle error trong useEffect
  React.useEffect(() => {
    if (isError && error) {
      handleError(error as unknown as ApiError);
    }
  }, [isError, error, handleError]);

  // Mutation với error handling
  const mutation = useMutation({
    mutationFn: (data: CreateProductData) => api.post<Product>('/products', data),
    onSuccess: (data) => {
      toast.success('Product created successfully!');
    },
    onError: (error: ApiError) => {
      if (error.code === 'VALIDATION_ERROR') {
        const validationErrors = handleValidationErrors(error);
        setFormErrors(validationErrors);
      } else {
        handleError(error);
      }
    },
  });
};
```

### 2. Form Validation Errors

```typescript
const [formErrors, setFormErrors] = useState<Record<string, string>>({});

// Trong onError của mutation
onError: (error: ApiError) => {
  if (error.code === 'VALIDATION_ERROR') {
    const validationErrors = handleValidationErrors(error);
    setFormErrors(validationErrors);
  } else {
    handleError(error);
  }
}

// Trong JSX
<input
  className={formErrors['FieldName'] ? 'border-red-500' : 'border-gray-300'}
/>
{formErrors['FieldName'] && (
  <p className="text-red-500">{formErrors['FieldName']}</p>
)}
```

## Error Codes và Handling

### Automatic Error Handling

Interceptor tự động xử lý các HTTP status codes:

- **400 (Bad Request)**: `BAD_REQUEST`
- **401 (Unauthorized)**: `UNAUTHORIZED` - Tự động logout
- **403 (Forbidden)**: `FORBIDDEN`
- **404 (Not Found)**: `NOT_FOUND`
- **422 (Validation Error)**: `VALIDATION_ERROR` - Parse validation fields
- **429 (Rate Limit)**: `RATE_LIMIT`
- **500 (Server Error)**: `SERVER_ERROR`

### Custom Error Messages

```typescript
// useApiError hook tự động hiển thị toast messages phù hợp với từng error code
const { handleError } = useApiError();

try {
  await api.post('/some-endpoint', data);
} catch (error) {
  handleError(error as ApiError);
  // Toast sẽ được hiển thị tự động
}
```

## Best Practices

### 1. Component Pattern

```typescript
const MyComponent = () => {
  const { handleError, handleValidationErrors } = useApiError();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      toast.success('Success!');
      setFormErrors({}); // Clear validation errors
    },
    onError: (error: ApiError) => {
      if (error.code === 'VALIDATION_ERROR') {
        setFormErrors(handleValidationErrors(error));
      } else {
        handleError(error);
      }
    },
  });

  return (
    // JSX with form validation display
  );
};
```

### 2. Global Error Handling

```typescript
// Interceptor tự động xử lý:
// - Network errors
// - Authentication errors (redirect to login)
// - Server errors
// - Rate limiting

// Component chỉ cần xử lý:
// - Validation errors (hiển thị trên form)
// - Business logic errors (custom messages)
```

### 3. Loading States

```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
});

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage />; // Error đã được handle bởi useEffect
return <DataDisplay data={data} />;
```

## Testing

```typescript
// Mock API responses cho testing
const mockApiResponse = {
  message: 'Success',
  data: { id: '1', name: 'Test Product' },
};

const mockValidationError = {
  message: 'Validation failed',
  code: 'VALIDATION_ERROR',
  validationErrors: [{ field: 'name', message: 'Name is required' }],
};
```
