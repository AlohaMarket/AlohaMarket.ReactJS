# 🚀 Development Guide - Aloha Market

A beginner-friendly guide to developing with the Aloha Market e-commerce project.

## 📚 Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [Creating a New Page](#creating-a-new-page)
3. [Adding Routes](#adding-routes)
4. [Creating Components](#creating-components)
5. [Working with Translations](#working-with-translations)
6. [Styling with Tailwind CSS](#styling-with-tailwind-css)
7. [API Integration](#api-integration)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

## 📁 Project Structure Overview

```
src/
├── @types/              # Global TypeScript type definitions
├── apis/                # API service functions
│   ├── client.ts        # Axios configuration
│   ├── auth.ts          # Authentication APIs
│   └── products.ts      # Product APIs
├── assets/              # Static files (images, icons)
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs)
│   └── common/          # Common components (Header, Footer)
├── constants/           # App constants and configuration
├── contexts/            # React contexts for global state
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization setup
├── layouts/             # Page layout components
├── locales/             # Translation files
│   ├── en.json          # English translations
│   └── vi.json          # Vietnamese translations
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── HomePage.tsx     # Home page
│   ├── ProductsPage.tsx # Products listing
│   └── ...
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main app component
├── main.tsx             # Application entry point
└── useRouteElements.tsx # Route configuration
```

## 🆕 Creating a New Page

### Step 1: Create the Page Component

Create a new file in the `src/pages/` directory:

```typescript
// src/pages/AboutPage.tsx
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('navigation.about')}</h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 text-lg">
          Welcome to our about page! This is where you can tell your story.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide the best e-commerce experience for our customers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading online marketplace in the region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Add Lazy Loading (Optional but Recommended)

For better performance, add lazy loading to your page:

```typescript
// In src/useRouteElements.tsx, add this import
const AboutPage = lazy(() => import('@/pages/AboutPage'));
```

### Step 3: Add the Route

Add your new page to the routing configuration:

```typescript
// In src/useRouteElements.tsx
export function useRouteElements() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Existing routes */}
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage />
            </Suspense>
          }
        />
        
        {/* Add your new route here */}
        <Route
          path="about"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          }
        />
        
        {/* Other existing routes */}
      </Route>
    </Routes>
  );
}
```

### Step 4: Add Navigation Link

Add a link to your new page in the header:

```typescript
// In src/components/common/Header.tsx
<nav className="hidden md:flex space-x-8">
  <Link to="/" className="text-gray-700 hover:text-primary-500">
    {t('navigation.home')}
  </Link>
  <Link to="/products" className="text-gray-700 hover:text-primary-500">
    {t('navigation.products')}
  </Link>
  <Link to="/about" className="text-gray-700 hover:text-primary-500">
    {t('navigation.about')}
  </Link>
</nav>
```

### Step 5: Add Translations

Add translations for your new page:

```json
// In src/locales/en.json
{
  "navigation": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "cart": "Cart"
  }
}
```

```json
// In src/locales/vi.json
{
  "navigation": {
    "home": "Trang chủ",
    "products": "Sản phẩm",
    "about": "Giới thiệu",
    "cart": "Giỏ hàng"
  }
}
```

## 🧩 Creating Components

### Basic Component Structure

```typescript
// src/components/ui/Button.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Using the Component

```typescript
// In any page or component
import Button from '@/components/ui/Button';

export default function MyPage() {
  return (
    <div>
      <Button variant="primary" size="lg" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
      
      <Button variant="outline" size="sm">
        Small Button
      </Button>
    </div>
  );
}
```

## 🌐 Working with Translations

### Adding New Translation Keys

1. **Add to English file** (`src/locales/en.json`):
```json
{
  "product": {
    "title": "Product",
    "description": "Description",
    "price": "Price",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}
```

2. **Add to Vietnamese file** (`src/locales/vi.json`):
```json
{
  "product": {
    "title": "Sản phẩm",
    "description": "Mô tả",
    "price": "Giá",
    "addToCart": "Thêm vào giỏ",
    "outOfStock": "Hết hàng"
  }
}
```

### Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

export default function ProductCard() {
  const { t } = useTranslation();

  return (
    <div className="product-card">
      <h3>{t('product.title')}</h3>
      <p>{t('product.description')}</p>
      <button>{t('product.addToCart')}</button>
    </div>
  );
}
```

## 🎨 Styling with Tailwind CSS

### Common Patterns

```typescript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Hover effects
<button className="bg-blue-500 hover:bg-blue-600 transition-colors">

// Focus states
<input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">

// Conditional classes
<div className={clsx(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
```

### Custom Classes (defined in `src/index.css`)

```typescript
// Use predefined component classes
<button className="btn btn-primary">Primary Button</button>
<input className="input" placeholder="Enter text" />
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-content">Content</div>
</div>
```

## 🔌 API Integration

### Creating an API Service

```typescript
// src/apis/categories.ts
import { apiClient } from './client';
import { Category } from '@/types';

export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await apiClient.post('/categories', category);
    return response.data;
  },
};
```

### Using API with React Query

```typescript
// In a component
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/apis/categories';

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  // Mutation for creating category
  const createCategoryMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading categories</div>;

  return (
    <div>
      {categories?.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
```

## 🔄 Common Patterns

### Form Handling with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          className="input"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          className="input"
          placeholder="Your email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
```

### Loading States

```typescript
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <div>Your content here</div>;
}
```

### Error Handling

```typescript
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MyComponent() {
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setError(null);
      // Your async operation
      await someApiCall();
      toast.success('Operation successful!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button onClick={handleAction}>Perform Action</button>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

1. **Import Path Issues**
   ```typescript
   // ❌ Wrong
   import Button from '../../../components/ui/Button';
   
   // ✅ Correct
   import Button from '@/components/ui/Button';
   ```

2. **Missing Translation Keys**
   ```typescript
   // Check if key exists in both en.json and vi.json
   // Use fallback if needed
   {t('some.key', 'Fallback text')}
   ```

3. **Tailwind Classes Not Working**
   - Make sure the class exists in Tailwind CSS
   - Check if you're using custom classes defined in `src/index.css`
   - Restart the dev server after adding new classes

4. **Route Not Working**
   - Check if the route is added to `useRouteElements.tsx`
   - Verify the path matches exactly
   - Make sure the component is imported correctly

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Best Practices

1. **File Naming**: Use PascalCase for components (`HomePage.tsx`) and camelCase for utilities (`formatPrice.ts`)

2. **Component Structure**: Keep components small and focused on a single responsibility

3. **Type Safety**: Always define TypeScript interfaces for props and data structures

4. **Responsive Design**: Always consider mobile-first design with Tailwind CSS

5. **Performance**: Use lazy loading for pages and React.memo for expensive components

6. **Accessibility**: Include proper ARIA labels and semantic HTML

7. **Error Handling**: Always handle loading and error states in your components

---

Happy coding! 🎉 If you have any questions, feel free to ask or check the main README.md for more information. 