# 🔄 React Context Guide - Aloha Market

A comprehensive guide to using React Context for state management in the Aloha Market project.

## 📚 Table of Contents

1. [What is React Context?](#what-is-react-context)
2. [Available Contexts](#available-contexts)
3. [Using AuthContext](#using-authcontext)
4. [Using CartContext](#using-cartcontext)
5. [Using ThemeContext](#using-themecontext)
6. [Creating Custom Contexts](#creating-custom-contexts)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

## 🤔 What is React Context?

React Context provides a way to pass data through the component tree without having to pass props down manually at every level. It's perfect for:

- **Global State**: User authentication, shopping cart, theme preferences
- **Avoiding Prop Drilling**: Passing data through many component levels
- **Shared Functionality**: Functions that multiple components need

## 🎯 Available Contexts

Our project includes three main contexts:

### 1. **AuthContext** - User Authentication
- Manages user login/logout state
- Handles authentication tokens
- Provides user information

### 2. **CartContext** - Shopping Cart
- Manages cart items and quantities
- Calculates totals and prices
- Persists cart data in localStorage

### 3. **ThemeContext** - Theme & Language
- Manages dark/light theme
- Handles language switching (EN/VI)
- Persists preferences in localStorage

## 🔐 Using AuthContext

### Basic Usage

```typescript
import { useAuth } from '@/contexts';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('email@example.com', 'password')}>
        Login
      </button>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Available Properties and Methods

```typescript
interface AuthContextType {
  user: User | null;                    // Current user data
  isLoading: boolean;                   // Loading state
  isAuthenticated: boolean;             // Is user logged in?
  login: (email, password) => Promise<void>;     // Login function
  register: (name, email, password) => Promise<void>; // Register function
  logout: () => void;                   // Logout function
  updateUser: (userData) => void;       // Update user data
}
```

### Login Form Example

```typescript
import { useState } from 'react';
import { useAuth } from '@/contexts';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Redirect to home after login
    } catch (error) {
      // Error is already handled by the context (toast notification)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## 🛒 Using CartContext

### Basic Usage

```typescript
import { useCart } from '@/contexts';

export default function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity, removeFromCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1); // Add 1 quantity
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {isInCart(product.id) ? (
        <div>
          <span>Quantity: {getItemQuantity(product.id)}</span>
          <button onClick={() => removeFromCart(product.id)}>
            Remove from Cart
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
}
```

### Available Properties and Methods

```typescript
interface CartContextType {
  items: CartItem[];                    // Array of cart items
  totalItems: number;                   // Total quantity of items
  totalPrice: number;                   // Total price of all items
  isLoading: boolean;                   // Loading state
  addToCart: (product, quantity?) => void;      // Add item to cart
  removeFromCart: (productId) => void;          // Remove item from cart
  updateQuantity: (productId, quantity) => void; // Update item quantity
  clearCart: () => void;                // Clear all items
  isInCart: (productId) => boolean;     // Check if item is in cart
  getItemQuantity: (productId) => number; // Get item quantity
}
```

### Cart Summary Component

```typescript
import { useCart } from '@/contexts';

export default function CartSummary() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="cart-summary">
      <h2>Cart Summary</h2>
      <p>Items: {totalItems}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.product.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

## 🎨 Using ThemeContext

### Basic Usage

```typescript
import { useTheme } from '@/contexts';

export default function ThemeControls() {
  const { theme, language, toggleTheme, changeLanguage } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      
      <button onClick={() => changeLanguage(language === 'en' ? 'vi' : 'en')}>
        Switch to {language === 'en' ? 'Vietnamese' : 'English'}
      </button>
      
      <p>Current theme: {theme}</p>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### Available Properties and Methods

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';              // Current theme
  language: 'en' | 'vi';                // Current language
  isLoading: boolean;                   // Loading state
  toggleTheme: () => void;              // Toggle between themes
  setTheme: (theme) => void;            // Set specific theme
  changeLanguage: (language) => void;   // Change language
}
```

### Responsive Theme Component

```typescript
import { useTheme } from '@/contexts';
import { useTranslation } from 'react-i18next';

export default function ThemedComponent() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`themed-component ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <h1>{t('welcome.title')}</h1>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

## 🛠️ Creating Custom Contexts

### Step 1: Create the Context

```typescript
// src/contexts/NotificationContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
```

### Step 2: Add to App.tsx

```typescript
import { NotificationProvider } from '@/contexts/NotificationContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <BrowserRouter>
                {/* Your app content */}
              </BrowserRouter>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Step 3: Use the Context

```typescript
import { useNotifications } from '@/contexts/NotificationContext';

export default function MyComponent() {
  const { addNotification, notifications } = useNotifications();

  const handleSuccess = () => {
    addNotification('Operation successful!', 'success');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Trigger Success</button>
      
      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 📝 Best Practices

### 1. **Keep Contexts Focused**
```typescript
// ✅ Good - Focused on authentication
const AuthContext = createContext<AuthContextType>();

// ❌ Bad - Too many responsibilities
const AppContext = createContext<{
  user: User;
  cart: CartItem[];
  theme: Theme;
  notifications: Notification[];
}>();
```

### 2. **Use Custom Hooks**
```typescript
// ✅ Good - Custom hook with error handling
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ❌ Bad - Direct context usage
const authContext = useContext(AuthContext);
```

### 3. **Optimize Re-renders**
```typescript
// ✅ Good - Memoize context value
const value = useMemo(() => ({
  user,
  login,
  logout,
  isAuthenticated
}), [user, isAuthenticated]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

### 4. **Handle Loading States**
```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    initializeAuth().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🔄 Common Patterns

### 1. **Conditional Rendering Based on Auth**
```typescript
import { useAuth } from '@/contexts';

export default function ProtectedComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome back, {user?.name}!</h1>
      {/* Protected content */}
    </div>
  );
}
```

### 2. **Cart Badge with Live Updates**
```typescript
import { useCart } from '@/contexts';

export default function CartBadge() {
  const { totalItems } = useCart();

  return (
    <div className="relative">
      <ShoppingCartIcon />
      {totalItems > 0 && (
        <span className="badge">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  );
}
```

### 3. **Theme-Aware Components**
```typescript
import { useTheme } from '@/contexts';

export default function ThemedButton({ children, ...props }) {
  const { theme } = useTheme();

  const buttonClass = theme === 'dark' 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-800';

  return (
    <button className={`btn ${buttonClass}`} {...props}>
      {children}
    </button>
  );
}
```

### 4. **Persisting State**
```typescript
// In your context
useEffect(() => {
  // Save to localStorage whenever state changes
  localStorage.setItem('cart', JSON.stringify(cartItems));
}, [cartItems]);

useEffect(() => {
  // Load from localStorage on mount
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    setCartItems(JSON.parse(savedCart));
  }
}, []);
```

## 🚀 Advanced Usage

### Combining Multiple Contexts
```typescript
import { useAuth, useCart, useTheme } from '@/contexts';

export default function Dashboard() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { theme } = useTheme();

  return (
    <div className={`dashboard ${theme}`}>
      <h1>Welcome, {user?.name}</h1>
      <p>You have {totalItems} items in your cart</p>
    </div>
  );
}
```

### Context with Reducers
```typescript
import { useReducer } from 'react';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  // ... rest of the provider
}
```

---

This guide covers everything you need to know about using React Context in the Aloha Market project. Remember to always use the custom hooks (`useAuth`, `useCart`, `useTheme`) instead of accessing contexts directly! 