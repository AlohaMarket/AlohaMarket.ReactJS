import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, CartItem, Product } from '@/types';
import { authApi } from '@/apis/auth';
import { getStoredToken, removeStoredToken, setStoredToken, getStoredData, setStoredData } from '@/utils';
import toast from 'react-hot-toast';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'vi';

export interface AppContextInterface {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  
  // Cart state
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartLoading: boolean;
  
  // Theme state
  theme: Theme;
  language: Language;
  isThemeLoading: boolean;
  
  // Auth actions
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Cart actions
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  
  // Theme actions
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  toggleTheme: () => void;
  changeLanguage: (language: Language) => void;
  
  // Global reset
  reset: () => void;
}

const CART_STORAGE_KEY = 'aloha_market_cart';
const THEME_STORAGE_KEY = 'aloha_market_theme';
const LANGUAGE_STORAGE_KEY = 'aloha_market_language';

export const getInitialAppContext: () => AppContextInterface = () => ({
  // Auth state
  user: null,
  isAuthenticated: !!getStoredToken(),
  isAuthLoading: true,
  
  // Cart state
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  isCartLoading: true,
  
  // Theme state
  theme: 'light',
  language: 'en',
  isThemeLoading: true,
  
  // Auth actions
  setUser: () => null,
  setIsAuthLoading: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => null,
  updateUser: () => null,
  
  // Cart actions
  setCartItems: () => null,
  addToCart: () => null,
  removeFromCart: () => null,
  updateQuantity: () => null,
  clearCart: () => null,
  isInCart: () => false,
  getItemQuantity: () => 0,
  
  // Theme actions
  setTheme: () => null,
  setLanguage: () => null,
  toggleTheme: () => null,
  changeLanguage: () => null,
  
  // Global reset
  reset: () => null
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: ReactNode;
  defaultValue?: AppContextInterface;
}) => {
  const { i18n } = useTranslation();
  
  // Auth state
  const [user, setUser] = useState<User | null>(defaultValue.user);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(defaultValue.isAuthLoading);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(defaultValue.cartItems);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(defaultValue.isCartLoading);
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(defaultValue.theme);
  const [language, setLanguage] = useState<Language>(defaultValue.language);
  const [isThemeLoading, setIsThemeLoading] = useState<boolean>(defaultValue.isThemeLoading);

  // Computed values
  const isAuthenticated = !!user;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Token is invalid, remove it
          removeStoredToken();
        }
      }
      setIsAuthLoading(false);
    };

    initializeAuth();
  }, []);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = getStoredData<CartItem[]>(CART_STORAGE_KEY);
    if (savedCart) {
      setCartItems(savedCart);
    }
    setIsCartLoading(false);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isCartLoading) {
      setStoredData(CART_STORAGE_KEY, cartItems);
    }
  }, [cartItems, isCartLoading]);

  // Initialize theme and language
  useEffect(() => {
    const savedTheme = getStoredData<Theme>(THEME_STORAGE_KEY);
    const savedLanguage = getStoredData<Language>(LANGUAGE_STORAGE_KEY);

    // Set theme
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    // Set language
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
      setLanguage(browserLang);
      i18n.changeLanguage(browserLang);
    }

    setIsThemeLoading(false);
  }, [i18n]);

  // Apply theme to document
  useEffect(() => {
    if (!isThemeLoading) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      setStoredData(THEME_STORAGE_KEY, theme);
    }
  }, [theme, isThemeLoading]);

  // Save language preference
  useEffect(() => {
    if (!isThemeLoading) {
      setStoredData(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language, isThemeLoading]);

  // Auth actions
  const login = async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      const response = await authApi.login({ email, password });
      
      // Store token
      setStoredToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsAuthLoading(true);
      const response = await authApi.register({ name, email, password, confirmPassword });
      
      // Store token
      setStoredToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      toast.success('Registration successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          quantity,
          price: product.price,
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            stock: product.stock ?? 0,
          },
        };
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const isInCart = (productId: string): boolean => {
    return cartItems.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Theme actions
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  // Global reset function
  const reset = () => {
    // Reset auth
    setUser(null);
    setIsAuthLoading(false);
    removeStoredToken();
    
    // Reset cart
    setCartItems([]);
    setIsCartLoading(false);
    
    // Reset theme to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    
    // Reset language to browser preference
    const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
    setLanguage(browserLang);
    i18n.changeLanguage(browserLang);
    setIsThemeLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        // Auth state
        user,
        isAuthenticated,
        isAuthLoading,
        
        // Cart state
        cartItems,
        totalItems,
        totalPrice,
        isCartLoading,
        
        // Theme state
        theme,
        language,
        isThemeLoading,
        
        // Auth actions
        setUser,
        setIsAuthLoading,
        login,
        register,
        logout,
        updateUser,
        
        // Cart actions
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        
        // Theme actions
        setTheme,
        setLanguage,
        toggleTheme,
        changeLanguage,
        
        // Global reset
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};